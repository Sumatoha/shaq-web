'use client';

import { EventData, ThemeConfig } from '@/types';

interface ProgramBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function ProgramBlock({ data, theme, variant, isPreview }: ProgramBlockProps) {
  const program = data.program || [];

  if (program.length === 0) {
    return (
      <section
        className="py-16 px-8"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-2xl md:text-3xl mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            Программа
          </h2>
          <p style={{ color: theme.colors.textMuted }}>
            Программа будет добавлена позже
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-2xl md:text-3xl text-center mb-10"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          Программа вечера
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-[27px] top-0 bottom-0 w-px"
            style={{ backgroundColor: theme.colors.accent + '40' }}
          />

          <div className="space-y-6">
            {program.map((item, index) => (
              <div key={index} className="flex gap-6">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: theme.colors.secondary,
                      border: `2px solid ${theme.colors.accent}`,
                      color: theme.colors.accent,
                    }}
                  >
                    {item.time}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-3">
                  <h3
                    className="font-medium"
                    style={{ color: theme.colors.text }}
                  >
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
