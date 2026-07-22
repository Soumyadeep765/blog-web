import Image from "next/image";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "@/components/CodeBlock";
import { HeadingAnchor } from "@/components/HeadingAnchor";
import { LinkPreview } from "@/components/LinkPreview";
import { createHeadingIdFactory, getNodeText } from "@/lib/slug";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

type MarkdownProps = {
  content: string;
};

type HastNode = {
  children?: Array<{
    type: string;
    tagName?: string;
    value?: string;
    properties?: Record<string, any>;
    children?: Array<{
      type: string;
      value?: string;
    }>;
  }>;
};

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) {
    return null;
  }

  return (
    <figure className="prose__figure">
      <Image
        src={src}
        alt={alt ?? ""}
        width={1200}
        height={675}
        className="prose__image"
        sizes="(max-width: 900px) 100vw, 680px"
        style={{
          width: "100%",
          height: "auto",
          aspectRatio: "16 / 9",
          objectFit: "cover",
        }}
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

function isImageOnlyParagraph(node?: HastNode) {
  if (!node?.children?.length) {
    return false;
  }

  const meaningful = node.children.filter((child) => {
    if (child.type === "text") {
      return Boolean(child.value?.trim());
    }
    return true;
  });

  return (
    meaningful.length === 1 &&
    meaningful[0]?.type === "element" &&
    meaningful[0].tagName === "img"
  );
}

function isLinkOnlyParagraph(node?: HastNode) {
  if (!node?.children?.length) {
    return false;
  }

  const meaningful = node.children.filter((child) => {
    if (child.type === "text") {
      return Boolean(child.value?.trim());
    }
    return true;
  });

  return (
    meaningful.length === 1 &&
    meaningful[0]?.type === "element" &&
    (meaningful[0] as any).tagName === "a"
  );
}

export function Markdown({ content }: MarkdownProps) {
  const nextHeadingId = createHeadingIdFactory();

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          a: ({ href, children }) => {
            const isExternal = Boolean(href?.startsWith("http"));
            return (
              <a
                href={href}
                rel={isExternal ? "noopener noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <MarkdownImage
              src={typeof src === "string" ? src : undefined}
              alt={alt}
            />
          ),
          p: ({ node, children }) => {
            if (isImageOnlyParagraph(node)) {
              return <>{children as ReactNode}</>;
            }
            if (isLinkOnlyParagraph(node)) {
              const linkChild = node?.children?.find(
                (child) => child.type === "element" && (child as any).tagName === "a"
              ) as any;
              const href = linkChild?.properties?.href;
              const text = linkChild?.children?.[0]?.value || "";
              if (text === "preview" && typeof href === "string" && href.startsWith("http")) {
                return <LinkPreview href={href} fallbackText={text} />;
              }
            }
            return <p>{children}</p>;
          },
          h2: ({ children }) => {
            const id = nextHeadingId(getNodeText(children));
            return (
              <HeadingAnchor id={id} level={2}>
                {children}
              </HeadingAnchor>
            );
          },
          h3: ({ children }) => {
            const id = nextHeadingId(getNodeText(children));
            return (
              <HeadingAnchor id={id} level={3}>
                {children}
              </HeadingAnchor>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="prose__quote">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="prose__table-wrap">
              <table>{children}</table>
            </div>
          ),
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className?.includes("language-") || className?.includes("hljs"));
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="prose__inline-code" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
