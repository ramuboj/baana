'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatbotProps = {
  apiUrl?: string;
  className?: string;
  /** If provided, sent as Authorization header so the API can identify the user */
  token?: string | null;
};

export default function Chatbot({ apiUrl = API_URL, className = '', token }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`);
        setLoading(false);
        return;
      }

      const replyContent =
        typeof data.reply === 'string' ? data.reply : data.message ?? 'No response.';
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Network error. Is the API running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '400px',
        maxHeight: '600px',
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        overflow: 'hidden',
      }}
    >
      <div
        className="chatbot-messages"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 'auto' }}>
            Send a message to start the conversation.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.role === 'user' ? 'chatbot-msg-user' : 'chatbot-msg-assistant'}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#3b82f6' : '#334155',
              color: '#e2e8f0',
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div
            className="chatbot-msg-assistant"
            style={{
              alignSelf: 'flex-start',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: '#334155',
              color: '#94a3b8',
              fontSize: '0.875rem',
            }}
          >
            …
          </div>
        )}
        <div ref={listEndRef} />
      </div>

      {error && (
        <p role="alert" className="chatbot-error" style={{ padding: '0 1rem 0.5rem', fontSize: '0.8125rem', color: '#f87171' }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ padding: '1rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          disabled={loading}
          autoComplete="off"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          className="chatbot-send"
          disabled={loading || !input.trim()}
          style={{
            padding: '0.75rem 1.25rem',
            background: loading || !input.trim() ? '#475569' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.9375rem',
            fontWeight: 500,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
