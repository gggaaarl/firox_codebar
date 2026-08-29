import bcrypt from "bcryptjs";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  role: "admin" | "editor";
};

type DbUserRow = {
  id: string;
  username: string;
  password_hash: string;
  display_name: string;
  role: "admin" | "editor";
  is_active: boolean;
};

export async function verifyAppUser(
  username: string,
  password: string
): Promise<AppUser | null> {
  if (!isSupabaseConfigured()) {
    return verifyLocalDevUser(username, password);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("app_users")
    .select("id, username, password_hash, display_name, role, is_active")
    .eq("username", username.trim())
    .maybeSingle();

  if (error || !data) return null;

  const row = data as DbUserRow;
  if (!row.is_active) return null;

  const valid = await bcrypt.compare(password, row.password_hash).catch(() => false);
  if (!valid) return null;

  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
  };
}

/** Solo cuando Supabase no está configurado (desarrollo local). */
function verifyLocalDevUser(
  username: string,
  password: string
): AppUser | null {
  const envUsername = process.env.AUTH_USERNAME ?? "admin";
  const envPassword = process.env.AUTH_PASSWORD ?? "Firox2026";

  if (username === envUsername && password === envPassword) {
    return {
      id: "local-admin",
      username: envUsername,
      displayName: "Administrador",
      role: "admin",
    };
  }

  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
