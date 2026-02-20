import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn("Supabase URL or SERVICE_ROLE_KEY missing – upload will not work.");
}

export const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey) : null;

export const UPLOAD_BUCKET = "villa-images";
