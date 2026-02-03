'use client';

import { Heart } from 'lucide-react';
import { EventData, ThemeConfig } from '@/types';

interface FooterBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function FooterBlock({ data, theme, variant, isPreview }: FooterBlockProps) {
  const names = data.names.person2
    ? `${data.names.person1} & ${data.names.person2}`
    : data.names.person1;

  return (
    <section
      className="py-12 px-8"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <div className="max-w-md mx-auto text-center">
        {variant === 'with-hashtag' && data.hashtag && (
          <p
            className="text-lg font-medium mb-4"
            style={{ color: theme.colors.accent }}
          >
            {data.hashtag}
          </p>
        )}

        <p
          className="text-lg mb-6"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text,
          }}
        >
          Күтеміз!
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-12 h-px"
            style={{ backgroundColor: theme.colors.accent + '40' }}
          />
          <Heart
            size={20}
            fill={theme.colors.accent}
            style={{ color: theme.colors.accent }}
          />
          <div
            className="w-12 h-px"
            style={{ backgroundColor: theme.colors.accent + '40' }}
          />
        </div>

        <p
          className="text-xs"
          style={{ color: theme.colors.textMuted }}
        >
          Создано на{' '}
          <a
            href="https://shaq.kz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{ color: theme.colors.accent }}
          >
            Shaq
          </a>
        </p>
      </div>
    </section>
  );
}
