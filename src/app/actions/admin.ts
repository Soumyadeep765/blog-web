"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  authenticateAdmin,
  clearAdminSession,
  createAdminUser,
  getCurrentAdmin,
  isAdminAuthenticated,
  setAdminSession,
  setAdminUserActive,
} from "@/lib/admin";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/categories";
import {
  createPost,
  deletePost,
  setPostPublished,
  slugifyTitle,
  updatePost,
} from "@/lib/posts";
import { updateSiteSettings } from "@/lib/settings";
import { sql } from "@/lib/db";
import { authorToSlug } from "@/lib/slug";

export type AdminFormState = {
  error?: string;
  success?: string;
};

function requireAuthMessage(): AdminFormState {
  return { error: "You need to log in first." };
}

function requireOwnerMessage(): AdminFormState {
  return { error: "Only owners can perform this action." };
}

function parsePostForm(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "technology").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverAlt = String(formData.get("coverAlt") || "").trim();
  const author = String(formData.get("author") || "TeleBotHost Team").trim();
  const date = String(formData.get("date") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const published = formData.get("published") === "on";

  const excerpt = String(formData.get("excerpt") || "").trim();
  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();

  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title,
    description,
    content,
    category,
    tags,
    coverImage,
    coverAlt,
    author,
    date,
    slugInput,
    published,
    excerpt,
    metaTitle,
    metaDescription,
  };
}

function revalidatePublicContent(slug?: string, category?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  if (category) {
    revalidatePath(`/blog/category/${category}`);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/analytics");
}

export async function loginAdmin(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }

  const user = await authenticateAdmin(username, password);
  if (!user) {
    return { error: "Wrong username or password." };
  }

  await setAdminSession(user.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createAdminAccount(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return requireAuthMessage();
  }
  if (current.role !== "owner") {
    return requireOwnerMessage();
  }

  const username = String(formData.get("username") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "editor") as "owner" | "editor";

  if (!username || !name || !password) {
    return { error: "Name, username, and password are required." };
  }

  if (username.length < 3) {
    return { error: "Username needs at least 3 characters." };
  }

  if (password.length < 8) {
    return { error: "Password needs at least 8 characters." };
  }

  if (role !== "owner" && role !== "editor") {
    return { error: "Pick a valid role." };
  }

  if (role === "owner" && current.role !== "owner") {
    return { error: "Only an owner can create another owner." };
  }

  try {
    await createAdminUser({ username, name, password, role });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: `Created account for ${username}.` };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create the user.";
    if (
      message.includes("admin_users_username_key") ||
      message.includes("duplicate")
    ) {
      return { error: "That username is already taken." };
    }
    return { error: message };
  }
}

export async function toggleAdminUser(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return requireAuthMessage();
  }
  if (current.role !== "owner") {
    return requireOwnerMessage();
  }

  const userId = String(formData.get("userId") || "");
  const active = String(formData.get("active") || "") === "true";

  if (!userId) {
    return { error: "Missing user." };
  }

  if (userId === current.id) {
    return { error: "You can't deactivate your own account." };
  }

  await setAdminUserActive(userId, active);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { success: active ? "User reactivated." : "User deactivated." };
}

export async function createBlogPost(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const data = parsePostForm(formData);

  if (!data.title || !data.description || !data.content) {
    return { error: "Title, description, and content are required." };
  }

  const slug = data.slugInput || slugifyTitle(data.title);
  if (!slug) {
    return { error: "Could not build a slug from that title." };
  }

  let post;
  try {
    post = await createPost({
      slug,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      tags: data.tags,
      coverImage: data.coverImage || undefined,
      coverAlt: data.coverAlt || undefined,
      author: data.author,
      published: data.published,
      date: data.date || undefined,
      excerpt: data.excerpt || undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create the post.";
    if (message.includes("posts_slug_key") || message.includes("duplicate")) {
      return { error: "That slug already exists. Pick another one." };
    }
    return { error: message };
  }

  revalidatePublicContent(post.slug, post.category);
  redirect(data.published ? `/blog/${post.slug}` : `/admin/posts/${post.id}/edit`);
}

export async function updateBlogPost(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const id = String(formData.get("id") || "").trim();
  if (!id) {
    return { error: "Missing post id." };
  }

  const data = parsePostForm(formData);

  if (!data.title || !data.description || !data.content) {
    return { error: "Title, description, and content are required." };
  }

  const slug = data.slugInput || slugifyTitle(data.title);
  if (!slug) {
    return { error: "Could not build a slug from that title." };
  }

  let post;
  try {
    post = await updatePost(id, {
      slug,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      tags: data.tags,
      coverImage: data.coverImage || undefined,
      coverAlt: data.coverAlt || undefined,
      author: data.author,
      published: data.published,
      date: data.date || undefined,
      excerpt: data.excerpt || undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update the post.";
    if (message.includes("posts_slug_key") || message.includes("duplicate")) {
      return { error: "That slug already exists. Pick another one." };
    }
    return { error: message };
  }

  revalidatePublicContent(post.slug, post.category);
  revalidatePath(`/admin/posts/${post.id}/edit`);
  return { success: data.published ? "Post updated and published." : "Draft saved." };
}

export async function deleteBlogPost(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const id = String(formData.get("id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();

  if (!id) {
    return { error: "Missing post id." };
  }

  await deletePost(id);
  revalidatePublicContent(slug || undefined, category || undefined);
  redirect("/admin/posts");
}

export async function toggleBlogPostPublished(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const id = String(formData.get("id") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const published = String(formData.get("published") || "") === "true";

  if (!id) {
    return { error: "Missing post id." };
  }

  await setPostPublished(id, published);
  revalidatePublicContent(slug || undefined, category || undefined);
  return {
    success: published ? "Post published." : "Post moved to drafts.",
  };
}

export async function createBlogCategory(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const slug = slugInput || slugifyTitle(name);

  if (!name || !slug) {
    return { error: "Name is required." };
  }

  try {
    await createCategory({ slug, name, description });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create category.";
    if (message.includes("blog_categories_pkey") || message.includes("duplicate")) {
      return { error: "That category slug already exists." };
    }
    return { error: message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return { success: `Created category ${name}.` };
}

export async function updateBlogCategory(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!slug || !name) {
    return { error: "Name is required." };
  }

  await updateCategory(slug, { name, description });
  revalidatePath("/admin/categories");
  revalidatePath(`/blog/category/${slug}`);
  revalidatePath("/");
  revalidatePath("/blog");
  return { success: "Category updated." };
}

export async function deleteBlogCategory(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!(await isAdminAuthenticated())) {
    return requireAuthMessage();
  }

  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return { error: "Missing category." };
  }

  try {
    await deleteCategory(slug);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete category.";
    return { error: message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return { success: "Category deleted." };
}

export async function saveSiteSettings(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return requireAuthMessage();
  }

  if (current.role !== "owner") {
    return { error: "Only owners can change site settings." };
  }

  const site_name = String(formData.get("site_name") || "").trim();
  const site_title = String(formData.get("site_title") || "").trim();
  const site_description = String(formData.get("site_description") || "").trim();
  const default_author = String(formData.get("default_author") || "").trim();
  const social_github = String(formData.get("social_github") || "").trim();
  const social_telegram = String(formData.get("social_telegram") || "").trim();
  const social_x = String(formData.get("social_x") || "").trim();
  const social_discord = String(formData.get("social_discord") || "").trim();
  const ads_enabled = formData.get("ads_enabled") === "on" ? "true" : "false";
  const google_ads_client = String(formData.get("google_ads_client") || "").trim();
  const ad_slot_article_top = String(formData.get("ad_slot_article_top") || "").trim();
  const ad_slot_article_mid = String(formData.get("ad_slot_article_mid") || "").trim();
  const ad_slot_article_bottom = String(formData.get("ad_slot_article_bottom") || "").trim();
  const ad_slot_sidebar = String(formData.get("ad_slot_sidebar") || "").trim();
  const ad_slot_blog_list = String(formData.get("ad_slot_blog_list") || "").trim();

  if (!site_name || !site_title || !site_description) {
    return { error: "Site name, title, and description are required." };
  }

  await updateSiteSettings({
    site_name,
    site_title,
    site_description,
    default_author: default_author || "TeleBotHost Team",
    social_github,
    social_telegram,
    social_x,
    social_discord,
    ads_enabled,
    google_ads_client,
    ad_slot_article_top,
    ad_slot_article_mid,
    ad_slot_article_bottom,
    ad_slot_sidebar,
    ad_slot_blog_list,
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/about");
  return { success: "Settings saved." };
}

export async function saveAuthor(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return requireAuthMessage();
  }
  if (current.role !== "owner") {
    return requireOwnerMessage();
  }

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const avatar = String(formData.get("avatar") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const twitter = String(formData.get("twitter") || "").trim();
  const github = String(formData.get("github") || "").trim();
  const website = String(formData.get("website") || "").trim();

  const slug = slugInput || authorToSlug(name);
  const isNew = formData.get("isNew") === "true";

  if (!name || !slug) {
    return { error: "Name and slug are required." };
  }

  try {
    if (isNew) {
      await sql`
        INSERT INTO authors (name, slug, role, bio, avatar, location, twitter, github, website)
        VALUES (${name}, ${slug}, ${role}, ${bio}, ${avatar}, ${location}, ${twitter}, ${github}, ${website})
      `;
    } else {
      const originalSlug = String(formData.get("originalSlug") || "").trim();
      await sql`
        UPDATE authors
        SET name = ${name}, slug = ${slug}, role = ${role}, bio = ${bio},
            avatar = ${avatar}, location = ${location}, twitter = ${twitter},
            github = ${github}, website = ${website}, updated_at = NOW()
        WHERE slug = ${originalSlug || slug}
      `;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save author.";
    if (message.includes("authors_slug_key") || message.includes("duplicate")) {
      return { error: "An author with that slug already exists." };
    }
    return { error: message };
  }

  revalidatePath("/admin/authors");
  revalidatePath(`/blog/author/${slug}`);
  return { success: "Author saved successfully." };
}

export async function deleteAuthor(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const current = await getCurrentAdmin();
  if (!current) {
    return requireAuthMessage();
  }
  if (current.role !== "owner") {
    return requireOwnerMessage();
  }

  const slug = String(formData.get("slug") || "").trim();
  if (!slug) {
    return { error: "Missing author slug." };
  }

  try {
    await sql`DELETE FROM authors WHERE slug = ${slug}`;
  } catch {
    return { error: "Failed to delete author." };
  }

  revalidatePath("/admin/authors");
  redirect("/admin/authors");
}
