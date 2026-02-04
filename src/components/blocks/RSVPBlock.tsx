'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { EventData, ThemeConfig } from '@/types';

interface RSVPBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  guestName?: string;
  isPreview?: boolean;
  onSubmit?: (status: string, guestCount: number, wishes: string) => void;
}

export function RSVPBlock({ data, theme, variant, guestName, isPreview, onSubmit }: RSVPBlockProps) {
  const [status, setStatus] = useState<'confirmed' | 'declined' | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (selectedStatus: 'confirmed' | 'declined') => {
    if (isPreview) return;

    setStatus(selectedStatus);
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(selectedStatus, guestCount, wishes);
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonStyle = theme.decoration.buttonStyle === 'rounded'
    ? 'rounded-full'
    : 'rounded-lg';

  if (isSubmitted) {
    return (
      <section
        className="py-16 px-8"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        <div className="max-w-md mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: theme.colors.accent + '20' }}
          >
            <Check size={40} style={{ color: theme.colors.accent }} />
          </div>
          <h2
            className="text-2xl md:text-3xl mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            Рахмет!
          </h2>
          <p style={{ color: theme.colors.textMuted }}>
            {status === 'confirmed'
              ? 'Мы рады, что вы будете с нами!'
              : 'Жаль, что вы не сможете присутствовать. Надеемся увидеть вас в следующий раз!'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="max-w-md mx-auto">
        <h2
          className="text-2xl md:text-3xl text-center mb-2"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          Подтвердите присутствие
        </h2>

        {data.rsvpDeadline && (
          <p
            className="text-center text-sm mb-8"
            style={{ color: theme.colors.textMuted }}
          >
            Пожалуйста, ответьте до {new Date(data.rsvpDeadline).toLocaleDateString('ru-RU')}
          </p>
        )}

        {variant === 'full-form' && (
          <div className="space-y-4 mb-6">
            {guestName && (
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: theme.colors.textMuted }}
                >
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={guestName}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-white/50"
                  style={{
                    color: theme.colors.text,
                    borderColor: theme.colors.accent + '30',
                  }}
                />
              </div>
            )}

            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: theme.colors.textMuted }}
              >
                Количество гостей
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text,
                  borderColor: theme.colors.accent + '30',
                }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: theme.colors.textMuted }}
              >
                Пожелания (необязательно)
              </label>
              <textarea
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border resize-none"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text,
                  borderColor: theme.colors.accent + '30',
                }}
                placeholder="Ваши пожелания или особые пожелания по питанию..."
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleSubmit('confirmed')}
            disabled={isSubmitting || isPreview}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 ${buttonStyle} font-medium transition-all`}
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.secondary,
            }}
          >
            <Check size={20} />
            Приду
          </button>

          <button
            onClick={() => handleSubmit('declined')}
            disabled={isSubmitting || isPreview}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 ${buttonStyle} font-medium transition-all border-2`}
            style={{
              borderColor: theme.colors.textMuted,
              color: theme.colors.textMuted,
              backgroundColor: 'transparent',
            }}
          >
            <X size={20} />
            Не смогу
          </button>
        </div>
      </div>
    </section>
  );
}
