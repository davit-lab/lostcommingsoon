import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Upload, Loader2, Link2, Image as ImageIcon, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

interface ReelRow {
  id: string;
  reel_id: string;
  position: number;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  likes: number;
  link?: string;
}

const emptyRow = (position: number): ReelRow => ({
  id: '',
  reel_id: `reel-${Date.now()}`,
  position,
  title: '',
  description: '',
  video: '',
  thumbnail: '',
  likes: 0,
  link: '',
});

const inputCls =
  'w-full p-2.5 rounded-xl bg-muted border border-primary/20 text-foreground text-sm focus:outline-none focus:border-primary';

/* ---------------------------------------------------------- */
/*  Upload helper — signs a URL via the Edge Function, then PUTs */
/* ---------------------------------------------------------- */
async function uploadFile(file: File, folder: 'uploads' | 'thumbnails'): Promise<string> {
  const { data, error } = await supabase.functions.invoke('reel-upload-sign', {
    body: {
      username: ADMIN_USER,
      password: ADMIN_PASS,
      fileName: file.name,
      contentType: file.type || (folder === 'thumbnails' ? 'image/jpeg' : 'video/mp4'),
      folder,
    },
  });
  if (error) throw error;
  if (!data?.signedUrl || !data?.publicUrl) throw new Error('signing failed');
  const res = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' },
    body: file,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  return data.publicUrl as string;
}

/* ---------------------------------------------------------- */
/*  Reels admin                                                */
/* ---------------------------------------------------------- */
const ReelsAdmin: React.FC = () => {
  const [rows, setRows] = useState<ReelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<{ id: string; kind: 'video' | 'thumbnail' } | null>(null);
  const [err, setErr] = useState('');
  const uploadRefs = useRef<Record<string, { video?: HTMLInputElement; thumb?: HTMLInputElement }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('ll_admin_list_reels', {
      p_username: ADMIN_USER,
      p_password: ADMIN_PASS,
    });
    if (error) {
      console.error('[reels-admin] load failed', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      setErr('წაკითხვა ვერ მოხერხდა.');
    } else {
      setRows((data ?? []) as unknown as ReelRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (row: ReelRow) => {
    setSavingId(row.id || row.reel_id);
    setErr('');
    const { error } = await supabase.rpc('ll_admin_save_reel', {
      p_username: ADMIN_USER,
      p_password: ADMIN_PASS,
      p_id: row.id || null,
      p_reel_id: row.reel_id,
      p_position: row.position,
      p_title: row.title,
      p_description: row.description,
      p_video: row.video,
      p_thumbnail: row.thumbnail,
      p_likes: row.likes,
      p_link: row.link || '',
    });
    if (error) {
      console.error('[reels-admin] save failed', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      setErr('შენახვა ვერ მოხერხდა.');
    } else {
      await load();
    }
    setSavingId(null);
  };

  const remove = async (row: ReelRow) => {
    if (!row.id) return;
    setErr('');
    const { error } = await supabase.rpc('ll_admin_delete_reel', {
      p_username: ADMIN_USER,
      p_password: ADMIN_PASS,
      p_id: row.id,
    });
    if (error) {
      console.error('[reels-admin] delete failed', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      setErr('წაშლა ვერ მოხერხდა.');
      return;
    }
    await load();
  };

  const handleUpload = async (row: ReelRow, kind: 'video' | 'thumbnail', file: File) => {
    setUploadingFor({ id: row.id || row.reel_id, kind });
    setErr('');
    try {
      const url = await uploadFile(file, kind === 'video' ? 'uploads' : 'thumbnails');
      setRows((rs) =>
        rs.map((r) =>
          r.id === row.id && r.reel_id === row.reel_id
            ? { ...r, [kind]: url }
            : r,
        ),
      );
    } catch (e) {
      console.error('[reels-admin] upload failed', e);
      setErr('ატვირთვა ვერ მოხერხდა.');
    } finally {
      setUploadingFor(null);
    }
  };

  const move = (index: number, dir: number) => {
    const next = [...rows];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next.map((r, i) => ({ ...r, position: i })));
  };

  const addNew = () => setRows((rs) => [...rs, emptyRow(rs.length)]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-vintage text-2xl md:text-3xl text-foreground">რილები</h2>
          <p className="text-sm text-muted-foreground mt-1">მართეთ ვიდეობი ვებგვერდის სექციაში — ლინკები ან ატვირთვა.</p>
        </div>
        <button onClick={addNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-wider hover:opacity-90 transition-all">
          <Plus size={15} /> ახალი რილი
        </button>
      </div>

      {err && <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-bold">{err}</div>}
      {rows.length === 0 && !loading && (
        <div className="p-10 rounded-2xl bg-muted/30 border border-primary/10 text-center text-muted-foreground font-bold">
          რილები არ არის. დაამატეთ პირველი.
        </div>
      )}

      <div className="flex flex-col gap-5">
        {rows.map((row, idx) => (
          <motion.div
            key={row.id || row.reel_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-muted/40 border border-primary/15 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <GripVertical size={16} className="text-muted-foreground/50" />
              <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">#{idx + 1}</span>
              <div className="flex gap-1.5 ml-auto">
                <button onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="px-2.5 py-1 rounded-lg bg-muted border border-primary/20 text-xs font-black disabled:opacity-30 hover:bg-primary/10">↑</button>
                <button onClick={() => move(idx, 1)} disabled={idx === rows.length - 1}
                  className="px-2.5 py-1 rounded-lg bg-muted border border-primary/20 text-xs font-black disabled:opacity-30 hover:bg-primary/10">↓</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">სათაური</label>
                <input className={inputCls} value={row.title}
                  onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, title: e.target.value } : r)))} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">მოწონებები (საწყისი)</label>
                <input className={inputCls} type="number" min={0} value={row.likes}
                  onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, likes: Number(e.target.value) || 0 } : r)))} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">აღწერა</label>
              <textarea rows={2} className={`${inputCls} resize-y`} value={row.description}
                onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, description: e.target.value } : r)))} />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ლინკი (ოთახი/სერვისი — მაგ. #marao)</label>
              <div className="flex gap-2 items-center">
                <Link2 size={14} className="text-primary shrink-0" />
                <input className={inputCls} placeholder="#marao ან https://..." value={row.link || ''}
                  onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, link: e.target.value } : r)))} />
              </div>
            </div>

            {/* video */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ვიდეო</label>
              <div className="flex gap-2 items-center">
                <Link2 size={14} className="text-primary shrink-0" />
                <input className={inputCls} placeholder="https://.../video.mp4 ან ატვირთეთ" value={row.video}
                  onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, video: e.target.value } : r)))} />
                <input
                  type="file" hidden accept="video/*"
                  ref={(el) => { if (el) uploadRefs.current[row.id || row.reel_id] = { ...uploadRefs.current[row.id || row.reel_id], video: el }; }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(row, 'video', f); e.target.value = ''; }}
                />
                <button type="button" onClick={() => uploadRefs.current[row.id || row.reel_id]?.video?.click()} disabled={!!uploadingFor}
                  className="shrink-0 px-3 py-2.5 rounded-xl bg-muted border border-primary/25 text-primary text-xs font-black flex items-center gap-1.5 hover:bg-primary/10 disabled:opacity-50">
                  {uploadingFor?.id === (row.id || row.reel_id) && uploadingFor.kind === 'video' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} ვიდეო
                </button>
              </div>
              {row.video && (
                <div className="flex items-center gap-3 mt-1">
                  <video src={row.video} className="h-16 w-12 object-cover rounded-lg bg-black border border-zinc-800" muted playsInline />
                  <span className="text-[10px] text-muted-foreground truncate">{row.video}</span>
                </div>
              )}
            </div>

            {/* thumbnail */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">პრევიუ (thumbnail)</label>
              <div className="flex gap-2 items-center">
                <ImageIcon size={14} className="text-primary shrink-0" />
                <input className={inputCls} placeholder="https://.../poster.jpg ან ატვირთეთ" value={row.thumbnail}
                  onChange={(e) => setRows((rs) => rs.map((r) => (r.id === row.id && r.reel_id === row.reel_id ? { ...r, thumbnail: e.target.value } : r)))} />
                <input
                  type="file" hidden accept="image/*"
                  ref={(el) => { if (el) uploadRefs.current[row.id || row.reel_id] = { ...uploadRefs.current[row.id || row.reel_id], thumb: el }; }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(row, 'thumbnail', f); e.target.value = ''; }}
                />
                <button type="button" onClick={() => uploadRefs.current[row.id || row.reel_id]?.thumb?.click()} disabled={!!uploadingFor}
                  className="shrink-0 px-3 py-2.5 rounded-xl bg-muted border border-primary/25 text-primary text-xs font-black flex items-center gap-1.5 hover:bg-primary/10 disabled:opacity-50">
                  {uploadingFor?.id === (row.id || row.reel_id) && uploadingFor.kind === 'thumbnail' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} სურათი
                </button>
              </div>
              {row.thumbnail && (
                <div className="flex items-center gap-3 mt-1">
                  <img src={row.thumbnail} alt="" className="h-16 w-12 object-cover rounded-lg bg-black border border-zinc-800" />
                  <span className="text-[10px] text-muted-foreground truncate">{row.thumbnail}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => save(row)} disabled={!!savingId}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-wider hover:opacity-90 disabled:opacity-50 transition-all">
                {savingId === (row.id || row.reel_id) ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} შენახვა
              </button>
              {row.id && (
                <button onClick={() => remove(row)} disabled={!!savingId}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-black uppercase text-xs tracking-wider hover:bg-destructive/20 disabled:opacity-50 transition-all">
                  <Trash2 size={14} /> წაშლა
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReelsAdmin;