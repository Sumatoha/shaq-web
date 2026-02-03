'use client';

import { EventData, ThemeConfig } from '@/types';
import { formatDate } from '@/lib/utils';

interface HeroBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function HeroBlock({ data, theme, variant, isPreview }: HeroBlockProps) {
  const names = data.names.person2
    ? `${data.names.person1} & ${data.names.person2}`
    : data.names.person1;

  const formattedDate = data.date ? formatDate(data.date) : '';

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative"
      style={{ backgroundColor: theme.colors.primary }}
    >
      {/* Decorative elements */}
      {theme.decoration.cornerOrnaments && (
        <>
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 opacity-30"
               style={{ borderColor: theme.colors.accent }} />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 opacity-30"
               style={{ borderColor: theme.colors.accent }} />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 opacity-30"
               style={{ borderColor: theme.colors.accent }} />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 opacity-30"
               style={{ borderColor: theme.colors.accent }} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        <p
          className="text-xs tracking-[0.3em] uppercase mb-6 opacity-60"
          style={{ color: theme.colors.textMuted }}
        >
          Приглашение
        </p>

        <h1
          className="text-4xl md:text-5xl lg:text-6xl mb-6"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          {names}
        </h1>

        <div
          className="w-20 h-px mx-auto mb-6"
          style={{ backgroundColor: theme.colors.accent }}
        />

        <p
          className="text-lg"
          style={{ color: theme.colors.textMuted }}
        >
          {formattedDate}
        </p>

        {data.time && (
          <p
            className="text-sm mt-2 opacity-60"
            style={{ color: theme.colors.textMuted }}
          >
            {data.time}
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      {!isPreview && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
            style={{ borderColor: theme.colors.accent }}
          >
            <div
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
