'use client';

import { EventData, ThemeConfig } from '@/types';

interface GreetingBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  guestName?: string;
  isPreview?: boolean;
}

export function GreetingBlock({ data, theme, variant, guestName, isPreview }: GreetingBlockProps) {
  const displayName = guestName || 'Құрметті қонақ';

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-2xl md:text-3xl mb-8"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          {displayName}!
        </h2>

        {variant === 'bilingual' ? (
          <div className="space-y-8">
            {data.greetingKz && (
              <p
                className="leading-relaxed"
                style={{ color: theme.colors.text }}
              >
                {data.greetingKz}
              </p>
            )}

            {data.greetingKz && data.greetingRu && (
              <div
                className="w-16 h-px mx-auto"
                style={{ backgroundColor: theme.colors.accent }}
              />
            )}

            {data.greetingRu && (
              <p
                className="leading-relaxed"
                style={{ color: theme.colors.text }}
              >
                {data.greetingRu}
              </p>
            )}
          </div>
        ) : (
          <p
            className="leading-relaxed"
            style={{ color: theme.colors.text }}
          >
            {data.greetingRu || data.greetingKz || 'Қуанышты сәтті бірге бөлісуге шақырамыз!'}
          </p>
        )}

        {!data.greetingKz && !data.greetingRu && (
          <p
            className="leading-relaxed opacity-60"
            style={{ color: theme.colors.textMuted }}
          >
            Құрметті қонақтар, сіздерді біздің тойымызға шақырамыз!
            <br /><br />
            Уважаемые гости, приглашаем вас на наше торжество!
          </p>
        )}
      </div>
    </section>
  );
}
