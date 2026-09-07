// ============================================================================
// reel-upload-sign
// Verifies admin credentials, then returns a signed upload URL for the
// `lostlock-reels` storage bucket so only admins can upload video files.
//
// Request (POST, application/json):
//   { "username": "lostlock", "password": "lostlock2013",
//     "fileName": "clip.mp4", "contentType": "video/mp4",
//     "folder": "uploads" | "thumbnails" }
//
// Response:
//   { "signedUrl": "https://...", "publicUrl": "https://.../lostlock-reels/<path>" }
//
// The service-role key is used ONLY here (server-side), never in the browser.
// ============================================================================

// @ts-ignore — Deno runtime
Deno.serve(async (req: Request) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: cors });
  }

  const URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const ADMIN_USER = Deno.env.get('REEL_ADMIN_USER') || 'lostlock';
  const ADMIN_PASS = Deno.env.get('REEL_ADMIN_PASS') || 'lostlock2013';

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'bad_json' }), { status: 400, headers: cors });
  }

  if (body.username !== ADMIN_USER || body.password !== ADMIN_PASS) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
  }

  const fileExt = (body.fileName || 'video.mp4').split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'mp4';
  const safeName = `${crypto.randomUUID()}.${fileExt}`;
  const contentType = body.contentType || 'video/mp4';
  const folder = body.folder === 'thumbnails' ? 'thumbnails' : 'uploads';
  const path = `${folder}/${safeName}`;

  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const sb = createClient(URL, SERVICE_ROLE, { auth: { persistSession: false } });
    const { data, error } = await sb.storage
      .from('lostlock-reels')
      .createSignedUploadUrl(path, { contentType, cacheControl: '31536000' });
    if (error) throw error;
    const publicUrl = sb.storage.from('lostlock-reels').getPublicUrl(path).data.publicUrl;
    return new Response(
      JSON.stringify({ signedUrl: data.signedUrl, path, publicUrl }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: cors });
  }
});
