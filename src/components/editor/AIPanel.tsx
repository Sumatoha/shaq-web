'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/stores/editor-store';
import { useAIDesignStore } from '@/stores/ai-design-store';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface AISession {
  messages: Message[];
  currentHtml: string;
}

export function AIPanel() {
  const { event } = useEditorStore();
  const { currentHtml, setCurrentHtml } = useAIDesignStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event?.id) {
      loadSession();
    }
  }, [event?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async () => {
    if (!event?.id) return;
    setIsLoadingSession(true);
    try {
      const session = await api.getAISession(event.id);
      setMessages(session.messages || []);
      if (session.currentHtml) {
        setCurrentHtml(session.currentHtml);
      }
    } catch (error) {
      console.error('Failed to load AI session:', error);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !event?.id || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.generateAIDesign(event.id, userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);
      if (response.html) {
        setCurrentHtml(response.html);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate design');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!event?.id) return;
    try {
      await api.resetAISession(event.id);
      setMessages([]);
      setCurrentHtml('');
      toast.success('Сессия сброшена');
    } catch (error) {
      toast.error('Ошибка сброса сессии');
    }
  };

  const suggestedPrompts = [
    'Создай минималистичный дизайн',
    'Сделай элегантное свадебное приглашение',
    'Оформи в теплых землистых тонах',
    'Создай романтичный стиль',
  ];

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -m-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-muted-foreground/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-medium text-sm">AI Дизайнер</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-muted hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Сброс
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted text-center">
              Опишите ваше идеальное приглашение, и AI создаст его для вас.
            </p>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="w-full text-left text-sm p-3 rounded-lg border border-muted-foreground/10 hover:border-accent hover:bg-accent/5 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-muted-foreground/10'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted-foreground/10 rounded-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-muted-foreground/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Опишите дизайн..."
            className="flex-1 px-3 py-2 text-sm border border-muted-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Preview indicator */}
      {currentHtml && (
        <div className="px-4 pb-4">
          <div className="text-xs text-muted bg-green-50 text-green-700 px-3 py-2 rounded-lg">
            Дизайн сгенерирован! Смотрите превью справа.
          </div>
        </div>
      )}
    </div>
  );
}
