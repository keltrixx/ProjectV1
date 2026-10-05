import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Messages() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const activeId = params.get('c'); // open chat lives in the URL (?c=<id>) so links and refresh work
  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const activeRef = useRef(activeId);
  const bottomRef = useRef(null);

  const setActiveId = (id) => setParams(id ? { c: id } : {});
  const loadConvos = () => api.get('/messages/conversations').then((r) => setConvos(r.data)).catch((e) => setError(errMsg(e)));

  const convosRef = useRef(convos);
  useEffect(() => { activeRef.current = activeId; }, [activeId]);
  useEffect(() => { convosRef.current = convos; }, [convos]);

  // one socket connection for the whole page; the server sends every new message for us here
  useEffect(() => {
    const socket = io({ auth: { token: localStorage.getItem('token') } });
    socket.on('message:new', (msg) => {
      if (msg.conversation === activeRef.current) {
        setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
      }
      // brand-new chat started by someone else: reload the list to pick it up
      if (!convosRef.current.some((c) => c._id === msg.conversation)) return loadConvos();
      // otherwise bump that conversation to the top with its new preview
      setConvos((prev) => {
        const convo = prev.find((c) => c._id === msg.conversation);
        const updated = { ...convo, lastMessage: msg.text || 'Sent a photo', lastMessageAt: msg.createdAt };
        return [updated, ...prev.filter((c) => c._id !== msg.conversation)];
      });
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => { loadConvos(); }, []);

  // open a conversation: load its history
  useEffect(() => {
    setMessages([]);
    setError('');
    if (!activeId) return;
    api.get(`/messages/conversations/${activeId}/messages`)
      .then((r) => { if (activeRef.current === activeId) setMessages(r.data); })
      .catch((e) => setError(errMsg(e)));
  }, [activeId]);

  // braces matter: newer browsers return a Promise from scrollIntoView, which React would treat as a cleanup
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e, file) => {
    e?.preventDefault();
    if ((!text.trim() && !file) || sending) return;
    setSending(true);
    setError('');
    try {
      const body = new FormData();
      body.append('text', file ? '' : text);
      if (file) body.append('photo', file);
      const { data } = await api.post(`/messages/conversations/${activeId}/messages`, body);
      // show it right away even if the socket is slow or disconnected
      setMessages((prev) => (prev.some((m) => m._id === data._id) ? prev : [...prev, data]));
      if (!file) setText('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSending(false);
    }
  };

  const other = (c) => c?.participants.find((p) => p._id !== user._id);
  const active = convos.find((c) => c._id === activeId);

  return (
    <div className="card -mx-4 grid h-[calc(100dvh-10.5rem-env(safe-area-inset-bottom))] overflow-hidden rounded-none border-x-0 sm:mx-0 sm:rounded-xl sm:border-x md:h-[70vh] md:grid-cols-[280px_1fr]">
      {/* list: hidden on phones once a chat is open */}
      <div className={`scroll-thin overflow-y-auto border-slate-200 md:border-r ${activeId ? 'hidden md:block' : ''}`}>
        <h1 className="border-b border-slate-200 p-4 font-bold">Messages</h1>
        {convos.length === 0 && <p className="p-4 text-sm text-slate-500">No conversations yet. Message a seller from a listing.</p>}
        {convos.map((c) => (
          <button key={c._id} onClick={() => setActiveId(c._id)}
            className={`block w-full border-b border-l-4 border-b-slate-100 p-4 text-left transition duration-200 hover:bg-sky ${c._id === activeId ? 'border-l-navy bg-sky' : 'border-l-transparent'}`}>
            <p className="text-sm font-semibold">{other(c)?.fullName}</p>
            <p className="truncate text-xs text-slate-500">{c.listing?.title}</p>
            <p className="truncate text-xs text-slate-400">{c.lastMessage}</p>
          </button>
        ))}
      </div>

      <div className={`flex min-h-0 flex-col ${activeId ? '' : 'hidden md:flex'}`}>
        {!activeId ? (
          <p className="m-auto text-sm text-slate-500">Pick a conversation to start chatting.</p>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-slate-200 px-2 py-2 sm:gap-3 sm:p-4">
              <button className="rounded-lg px-3 py-2 text-sm font-medium text-navy active:bg-sky md:hidden" onClick={() => setActiveId(null)}>← Back</button>
              <div className="min-w-0">
                <p className="truncate font-semibold">{other(active)?.fullName}</p>
                {active?.listing && (
                  <Link to={`/listings/${active.listing._id}`} className="block truncate text-xs text-slate-500 hover:text-navy hover:underline">
                    Re: {active.listing.title}
                  </Link>
                )}
              </div>
            </div>
            <div className="scroll-thin flex-1 space-y-2 overflow-y-auto bg-mist p-4">
              {messages.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No messages yet. Say hi!</p>}
              {messages.map((m) => {
                const mine = m.sender === user._id;
                return (
                  <div key={m._id} className={`flex animate-fade-up ${mine ? 'justify-end' : ''}`}>
                    <div className={`max-w-[85%] break-words rounded-2xl sm:max-w-[75%] px-3 py-2 text-sm shadow-sm ${mine ? 'rounded-br-md bg-navy text-white' : 'rounded-bl-md bg-white border border-slate-200'}`}>
                      {m.image && <img src={m.image} alt="Shared" className="mb-1 max-h-48 rounded-lg" />}
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            {error && <p role="alert" className="px-4 text-xs text-red-600">{error}</p>}
            <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-200 p-2 sm:p-3">
              <label className="btn-outline shrink-0 cursor-pointer !px-3" aria-label="Attach photo">
                Photo
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) send(null, f); }} />
              </label>
              <input className="input" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn-primary shrink-0" disabled={sending || !text.trim()}>Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
