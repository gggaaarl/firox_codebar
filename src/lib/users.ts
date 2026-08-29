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

type VerifiedUserRow = {
  id: string;
  username: string;
  display_name: string;
  role: "admin" | "editor";
};

export async function verifyAppUser(
  username: string,
  password: string
): Promise<AppUser | null> {
  if (!isSupabaseConfigured()) {
    return verifyLocalDevUser(username, password);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc("verify_app_user_password", {
    p_username: username.trim(),
    p_password: password,
  });

  if (error || !data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const row = data[0] as VerifiedUserRow;

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
