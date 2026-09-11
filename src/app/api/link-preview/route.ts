import { NextRequest } from "next/server";

export const runtime = "nodejs";

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-z0-9:-]+)\s*=\s*(?:(['"])([\s\S]*?)\2|([^\s'"]+))/gi;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1];
    const value = match[3] || match[4] || "";
    attrs[name.toLowerCase()] = value;
  }
  return attrs;
}

function parseMetaTags(html: string) {
  const metaRegex = /<meta\s+([^>]+)\/?>/gi;
  const tags: Record<string, string> = {};
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrString = match[1];
    const attrs = parseAttributes(attrString);
    const key = attrs.property || attrs.name || attrs.itemprop;
    if (key && attrs.content) {
      tags[key.toLowerCase()] = attrs.content;
    }
  }

  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  const title = titleMatch ? titleMatch[1].trim() : "";

  return { tags, title };
}

const previewCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Check memory cache first
  const cached = previewCache.get(targetUrl);
  if (cached && cached.expiry > Date.now()) {
    return Response.json(cached.data);
  }

  try {
    const parsedUrl = new URL(targetUrl);
    if (!parsedUrl.protocol.startsWith("http")) {
      return Response.json({ error: "Invalid protocol" }, { status: 400 });
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
      },
      next: { revalidate: 3600 }
    });
    clearTimeout(id);

    if (!response.ok) {
      return Response.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return Response.json({ error: "URL is not an HTML document" }, { status: 400 });
    }

    // Read stream until </head> or 150KB to maximize performance
    let html = "";
    const reader = response.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: chunkDone } = await reader.read();
        done = chunkDone;
        if (value) {
          html += decoder.decode(value, { stream: !done });
          if (html.includes("</head>") || html.length > 150 * 1024) {
            done = true;
            await reader.cancel();
          }
        }
      }
    } else {
      html = await response.text();
    }

    const { tags, title: docTitle } = parseMetaTags(html);

    const title = tags["og:title"] || tags["twitter:title"] || docTitle || "";
    const description = tags["og:description"] || tags["twitter:description"] || tags["description"] || "";
    let image = tags["og:image"] || tags["twitter:image"] || "";
    const siteName = tags["og:site_name"] || parsedUrl.hostname;

    if (image && !image.startsWith("http")) {
      try {
        image = new URL(image, targetUrl).toString();
      } catch {
        image = "";
      }
    }

    const result = {
      title,
      description,
      image,
      siteName,
      url: targetUrl,
    };

    // Store in cache
    previewCache.set(targetUrl, {
      data: result,
      expiry: Date.now() + CACHE_TTL,
    });

    return Response.json(result);
  } catch (error: unknown) {
    return Response.json({ error: error instanceof Error ? error.message : "Failed to fetch metadata" }, { status: 500 });
  }
}
