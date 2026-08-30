/**
 * Widget chatbot GICOS — conseil client et orientation vers les offres
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, MapPin, ExternalLink } from 'lucide-react';
import { getImageUrl } from '../api';
import SafeImage from './SafeImage';
import { getWelcomeMessage, processMessage } from '../utils/chatBotEngine';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([{ id: 'welcome', role: 'bot', ...welcome }]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const pushBot = async (payload) => {
    setBusy(true);
    try {
      const reply = await processMessage(payload);
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: 'bot', ...reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'bot',
          text: 'Désolé, une erreur est survenue. Réessayez ou contactez-nous via la page Contact.',
          quickReplies: [{ id: 'contact', label: 'Nous contacter' }],
          offers: [],
          links: [{ label: 'Contact', to: '/contact' }],
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleSend = async (text) => {
    const value = (text ?? input).trim();
    if (!value || busy) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: value },
    ]);
    await pushBot(value);
  };

  const handleQuick = async (reply) => {
    if (busy) return;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: reply.label },
    ]);
    await pushBot(reply.id);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 font-inter">
      {open && (
        <div
          className="w-[min(100vw-1.5rem,380px)] h-[min(70vh,520px)] bg-white rounded-2xl shadow-soft-lg border border-gray-100 flex flex-col overflow-hidden animate-[fadeInUp_0.25s_ease-out]"
          role="dialog"
          aria-label="Assistant GICOS"
        >
          {/* Header */}
          <div className="bg-primary-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Assistant GICOS</p>
                <p className="text-xs text-primary-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En ligne — conseils & offres
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fermer le chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary-700 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Offres */}
                  {msg.offers?.length > 0 && (
                    <div className="space-y-2">
                      {msg.offers.map((offer) => (
                        <Link
                          key={offer.id}
                          to={offer.link}
                          onClick={() => setOpen(false)}
                          className="flex gap-2.5 p-2 rounded-xl bg-white border border-gray-100 hover:border-primary-300 hover:shadow-sm transition-all group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {offer.image ? (
                              <SafeImage
                                src={getImageUrl(offer.image)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                                —
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-800">
                              {offer.title}
                            </p>
                            <p className="text-xs text-gold-600 font-medium mt-0.5">{offer.price}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />
                              {offer.city} · {offer.type}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Liens */}
                  {msg.links?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.links.map((link) =>
                        link.to ? (
                          <Link
                            key={link.label}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-full transition-colors"
                          >
                            {link.label}
                            <ExternalLink size={10} />
                          </Link>
                        ) : (
                          <a
                            key={link.label}
                            href={link.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-full transition-colors"
                          >
                            {link.label}
                          </a>
                        )
                      )}
                    </div>
                  )}

                  {/* Quick replies */}
                  {msg.role === 'bot' && msg.quickReplies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr.id}
                          type="button"
                          disabled={busy}
                          onClick={() => handleQuick(qr)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-full border border-primary-200 text-primary-800 bg-white hover:bg-primary-50 disabled:opacity-50 transition-colors"
                        >
                          {qr.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-primary-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex gap-2 items-center text-gray-400 text-xs pl-9">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:300ms]" />
                </span>
                Recherche en cours…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-gray-100 p-3 bg-white flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex. : maison à Ouagadougou…"
              disabled={busy}
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center hover:bg-primary-800 disabled:opacity-40 transition-colors shrink-0"
              aria-label="Envoyer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-gray-700 text-white rotate-0'
            : 'bg-primary-800 text-white hover:bg-primary-900 hover:scale-105'
        }`}
        aria-label={open ? 'Fermer l’assistant' : 'Ouvrir l’assistant GICOS'}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
