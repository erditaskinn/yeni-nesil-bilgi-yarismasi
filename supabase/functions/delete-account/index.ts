import { createClient } from "npm:@supabase/supabase-js@2.117.2";
import { deletionHandler } from "./handler.ts";

const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const admin = createClient(url, key, options);
const origins = ["https://yeninesilbilgiyarismasi.com", "https://localhost", "capacitor://localhost", ...(Deno.env.get("EXTRA_ALLOWED_ORIGINS") ?? "").split(",").filter(Boolean)];

Deno.serve(deletionHandler({
  identity: async token => {
    const { data, error } = await admin.auth.getUser(token);
    return !error && data.user?.email ? { id: data.user.id, email: data.user.email } : null;
  },
  verifyPassword: async (email, password) => {
    // A separate client avoids mutating the administrative auth session.
    const verification = createClient(url, key, options);
    const { data, error } = await verification.auth.signInWithPassword({ email, password });
    return !error ? data.user?.id ?? null : null;
  },
  deleteUser: async id => !(await admin.auth.admin.deleteUser(id)).error,
}, origins));
