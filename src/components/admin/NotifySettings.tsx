import React, { useEffect, useState } from 'react';
import { Save, Send, Loader2, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_USER = 'lostlock';
const ADMIN_PASS = 'lostlock2013';

const NotifySettings: React.FC = () => {
  const [token, setToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('ll_admin_get_setting', { p_username: ADMIN_USER, p_password: ADMIN_PASS, p_key: 'telegram' });
      if (data && typeof data === 'object') {
        const cfg = data as { bot_token?: string; chat_id?: string };
        setToken(cfg.bot_token ?? '');
        setChatId(cfg.chat_id ?? '');
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setTestResult('');
    const { error } = await supabase.rpc('ll_admin_set_setting', {
      p_username: ADMIN_USER, p_password: ADMIN_PASS, p_key: 'telegram',
      p_value: { bot_token: token.trim(), chat_id: chatId.trim() },
    });
    setSaving(false);
    if (!error) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
    }
  };

  const test = async () => {
    setTesting(true);
    setTestResult('');
    await save();
    const { data } = await supabase.rpc('ll_admin_send_telegram', { p_username: ADMIN_USER, p_password: ADMIN_PASS, p_text: 'Lost Lock — შეტყობინებები ჩართულია. ახალი ჯავშნები აქ მოვა.' });
    const res = typeof data === 'string' ? data : 'error';
    setTestResult(res === 'sent'
      ? 'გაგზავნილია! შეამოწმეთ Telegram.'
      : res === 'not_configured' ? 'ჯერ შეავსეთ ველები და დააჭირეთ შენახვას.'
      : 'ვერ გაიგზავნა — გადაამოწმეთ token / chat id.');
    setTesting(false);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="font-vintage text-xl text-foreground">შეტყობინებები ტელეფონზე</h2>
        <p className="text-sm text-muted-foreground mt-1">როცა ვინმე ჯავშანს გააკეთებს, Telegram-ში მოვა შეტყობინება ტელეფონზე — № კოდი, თარიღი, სახელი, თანხა.</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-muted/25 p-4 flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="font-semibold text-foreground">როგორ გავაქტიურო (1-2 წუთი):</div>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Telegram-ში მოძებნეთ <span className="text-primary font-semibold">@BotFather</span> → გაგზავნეთ <code className="text-foreground">/newbot</code> → დაარქვით სახელი → მიიღეთ <b>Token</b>.</li>
          <li>მოძებნეთ <span className="text-primary font-semibold">@userinfobot</span> → დააჭირეთ Start → მიიღებთ თქვენს <b>Chat ID</b>-ს.</li>
          <li><b>მნიშვნელოვანია:</b> თქვენს ახალ ბოტს დააჭირეთ Start (მოძებნეთ მისი @username) — წინააღმდეგ შემთხვევაში ბოტი ვერ გამოგიგზავნიდა შეტყობინებას.</li>
          <li>ჩასვით ორივე ველში და დააჭირეთ „შენახვა", შემდეგ „ტესტი".</li>
        </ol>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground py-4">იტვირთება…</div>
      ) : (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bot Token</span>
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456789:AAF..."
              className="px-3 py-2.5 rounded-lg bg-muted border border-zinc-700 text-foreground text-sm font-mono focus:outline-none focus:border-primary" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chat ID</span>
            <input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="123456789"
              className="px-3 py-2.5 rounded-lg bg-muted border border-zinc-700 text-foreground text-sm font-mono focus:outline-none focus:border-primary" />
          </label>

          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity">
              {saving ? <Loader2 size={14} className="animate-spin" /> : savedFlash ? <Check size={14} /> : <Save size={14} />}
              {savedFlash ? 'შენახულია' : 'შენახვა'}
            </button>
            <button onClick={test} disabled={testing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-muted-foreground hover:text-primary hover:border-primary/40 text-sm font-semibold disabled:opacity-40 transition-colors">
              {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} ტესტი
            </button>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 text-sm ${testResult.includes('გაგზავნილია') ? 'text-green-400' : 'text-destructive'}`}>
              {testResult.includes('გაგზავნილია') ? <Check size={14} /> : <AlertTriangle size={14} />} {testResult}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotifySettings;
