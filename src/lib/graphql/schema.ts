import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getAllPosts, getPostBySlug, getPostsByCategory } from "@/lib/posts";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    tags: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
    },
    coverImage: { type: GraphQLString },
    coverAlt: { type: GraphQLString },
    author: { type: new GraphQLNonNull(GraphQLString) },
    published: { type: new GraphQLNonNull(GraphQLBoolean) },
    views: { type: new GraphQLNonNull(GraphQLInt) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    readingTime: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: {
    slug: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const SocialType = new GraphQLObjectType({
  name: "Social",
  fields: {
    github: { type: GraphQLString },
    telegram: { type: GraphQLString },
    x: { type: GraphQLString },
    discord: { type: GraphQLString },
  },
});

const SiteType = new GraphQLObjectType({
  name: "Site",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    url: { type: new GraphQLNonNull(GraphQLString) },
    author: { type: new GraphQLNonNull(GraphQLString) },
    social: { type: SocialType },
    adsEnabled: { type: GraphQLBoolean },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      args: {
        limit: { type: GraphQLInt },
        category: { type: GraphQLString },
      },
      resolve: async (_src, args: { limit?: number; category?: string }) => {
        const posts = args.category
          ? await getPostsByCategory(args.category)
          : await getAllPosts();
        return args.limit ? posts.slice(0, args.limit) : posts;
      },
    },
    post: {
      type: PostType,
      args: {
        slug: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_src, args: { slug: string }) => getPostBySlug(args.slug),
    },
    categories: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CategoryType))),
      resolve: () => getCategories(),
    },
    category: {
      type: CategoryType,
      args: {
        slug: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_src, args: { slug: string }) =>
        getCategoryBySlug(args.slug),
    },
    site: {
      type: new GraphQLNonNull(SiteType),
      resolve: async () => {
        const settings = await getSiteSettings();
        return {
          name: settings.site_name,
          title: settings.site_title,
          description: settings.site_description,
          url: siteConfig.url,
          author: settings.default_author,
          social: settings.social,
          adsEnabled: settings.ads_enabled,
        };
      },
    },
  },
});

export const graphqlSchema = new GraphQLSchema({ query: QueryType });

export const graphqlExampleQuery = `# Example query
query {
  site {
    name
    title
    url
    social {
      github
      telegram
      x
      discord
    }
  }
  categories {
    slug
    name
  }
  posts(limit: 5) {
    slug
    title
    description
    date
    tags
  }
}`;
