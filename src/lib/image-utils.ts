const SUPABASE_HOST = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^https?:\/\//, "");

/** true when the image lives on our own Supabase storage — everything else is external */
export function isExternalImage(url: string): boolean {
  if (!url) return true;
  if (url.includes("supabase.co")) return false;
  if (SUPABASE_HOST && url.includes(SUPABASE_HOST)) return false;
  if (url.includes("img.youtube.com")) return false;
  if (url.includes("unpkg.com")) return false;
  if (url.includes("images.unsplash.com")) return false;
  return true;
}
