'use client';

import { useState, useEffect } from 'react';
import { useThemeStyles } from '@/hooks/use-theme-styles';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { PublicEventResponse, ThemeConfig } from '@/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface InvitationPageProps {
  invitation: PublicEventResponse;
  guestName?: string;
  guestSlug?: string;
  eventSlug?: string;
}

export function InvitationPage({ invitation, guestName, guestSlug, eventSlug }: InvitationPageProps) {
  const [showIntro, setShowIntro] = useState(true);
  const theme = invitation.theme as ThemeConfig;
  const { styles, fontLinks } = useThemeStyles(theme);

  // Check if intro block is enabled
  const hasIntro = invitation.blocks.some(b => b.type === 'intro' && b.enabled);

  useEffect(() => {
    if (!hasIntro) {
      setShowIntro(false);
    }
  }, [hasIntro]);

  const handleRSVP = async (status: string, guestCount: number, wishes: string) => {
    if (!eventSlug || !guestSlug) {
      toast.error('Невозможно отправить ответ');
      return;
    }

    try {
      await api.submitRSVP(eventSlug, guestSlug, { status, guestCount, wishes });
      toast.success('Ваш ответ записан!');
    } catch (error) {
      toast.error('Ошибка при отправке ответа');
      throw error;
    }
  };

  const blocks = invitation.blocks.filter(b => b.enabled && b.type !== 'intro');

  // Intro screen (envelope)
  if (showIntro && hasIntro) {
    return (
      <>
        {fontLinks.map((link) => (
          <link key={link} rel="stylesheet" href={link} />
        ))}
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8"
          style={{
            ...styles,
            backgroundColor: theme.colors.primary,
          }}
        >
          <div className="text-center">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6 opacity-60"
              style={{ color: theme.colors.textMuted }}
            >
              Приглашение
            </p>

            {guestName && (
              <h1
                className="text-2xl md:text-3xl mb-6"
                style={{
                  fontFamily: theme.fonts.heading,
                  fontWeight: theme.fonts.headingWeight,
                  color: theme.colors.text,
                }}
              >
                Құрметті {guestName}!
              </h1>
            )}

            <div
              className="w-32 h-40 mx-auto mb-8 relative"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Envelope */}
              <div
                className="w-full h-full rounded-lg relative overflow-hidden"
                style={{
                  backgroundColor: theme.colors.secondary,
                  border: `2px solid ${theme.colors.accent}`,
                }}
              >
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors.accent}40 50%, transparent 50%)`,
                  }}
                />
                {/* Heart seal */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <span className="text-white text-sm">♥</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIntro(false)}
              className="px-8 py-3 rounded-full font-medium transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.secondary,
              }}
            >
              Открыть приглашение
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {fontLinks.map((link) => (
        <link key={link} rel="stylesheet" href={link} />
      ))}
      <div
        className="min-h-screen"
        style={{
          ...styles,
          backgroundColor: theme.colors.primary,
          fontFamily: theme.fonts.body,
        }}
      >
        {blocks.map((block, index) => (
          <BlockRenderer
            key={`${block.type}-${index}`}
            block={block}
            data={invitation.data}
            theme={theme}
            guestName={guestName}
            onRSVP={guestSlug ? handleRSVP : undefined}
          />
        ))}
      </div>
    </>
  );
}
