import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

const COOKIE_NAME = "tbh_admin_session";

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: "owner" | "editor";
  active: boolean;
  created_at: string;
};

type AdminUserRow = AdminUser & {
  password_hash: string;
};

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "telebothost-admin"
  );
}

function signUserId(userId: string) {
  return createHmac("sha256", sessionSecret()).update(userId).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hash) {
    return false;
  }

  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(password, salt, 64);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function mapUser(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    role: row.role,
    active: row.active,
    created_at: row.created_at,
  };
}

export async function getAdminUserByUsername(username: string) {
  const rows = await sql<AdminUserRow[]>`
    select id, username, name, role, active, password_hash, created_at
    from admin_users
    where lower(username) = lower(${username})
    limit 1
  `;
  return rows[0] ?? null;
}

export async function getAdminUserById(id: string) {
  const rows = await sql<AdminUserRow[]>`
    select id, username, name, role, active, password_hash, created_at
    from admin_users
    where id = ${id}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const rows = await sql<AdminUserRow[]>`
    select id, username, name, role, active, password_hash, created_at
    from admin_users
    order by created_at asc
  `;
  return rows.map(mapUser);
}

export async function countAdminUsers() {
  const rows = await sql<{ count: string }[]>`
    select count(*)::text as count from admin_users
  `;
  return Number(rows[0]?.count || 0);
}

export async function createAdminUser(input: {
  username: string;
  name: string;
  password: string;
  role?: "owner" | "editor";
}) {
  const rows = await sql<AdminUserRow[]>`
    insert into admin_users (username, name, password_hash, role, active)
    values (
      ${input.username.toLowerCase().trim()},
      ${input.name.trim()},
      ${hashPassword(input.password)},
      ${input.role || "editor"},
      true
    )
    returning id, username, name, role, active, password_hash, created_at
  `;
  return mapUser(rows[0]);
}

export async function setAdminUserActive(id: string, active: boolean) {
  await sql`
    update admin_users
    set active = ${active}, updated_at = now()
    where id = ${id}
  `;
}

export async function ensureBootstrapOwner() {
  const count = await countAdminUsers();
  if (count > 0) {
    return;
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return;
  }

  await createAdminUser({
    username: "admin",
    name: "TeleBotHost Admin",
    password,
    role: "owner",
  });
}

export async function authenticateAdmin(username: string, password: string) {
  await ensureBootstrapOwner();

  const user = await getAdminUserByUsername(username.trim());
  if (!user || !user.active || !verifyPassword(password, user.password_hash)) {
    return null;
  }

  return mapUser(user);
}

export async function setAdminSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, `${userId}.${signUserId(userId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) {
    return null;
  }

  const [userId, signature] = value.split(".");
  if (!userId || !signature) {
    return null;
  }

  const expected = Buffer.from(signUserId(userId));
  const actual = Buffer.from(signature);
  if (
    expected.length !== actual.length ||
    !timingSafeEqual(expected, actual)
  ) {
    return null;
  }

  const user = await getAdminUserById(userId);
  if (!user || !user.active) {
    return null;
  }

  return mapUser(user);
}

export async function isAdminAuthenticated() {
  return Boolean(await getCurrentAdmin());
}

export function fingerprint(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}
