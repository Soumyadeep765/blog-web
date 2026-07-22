import { graphql } from "graphql";
import { graphqlExampleQuery, graphqlSchema } from "@/lib/graphql/schema";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    endpoint: "/api/graphql",
    method: "POST",
    contentType: "application/json",
    body: { query: "query { site { name title url } posts(limit: 5) { slug title } }" },
    example: graphqlExampleQuery,
  });
}

export async function POST(request: Request) {
  let body: { query?: string; variables?: Record<string, unknown> };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { errors: [{ message: "Invalid JSON body." }] },
      { status: 400 },
    );
  }

  if (!body.query?.trim()) {
    return Response.json(
      { errors: [{ message: "Missing query." }] },
      { status: 400 },
    );
  }

  const result = await graphql({
    schema: graphqlSchema,
    source: body.query,
    variableValues: body.variables,
  });

  const status = result.errors?.length ? 400 : 200;
  return Response.json(result, { status });
}
