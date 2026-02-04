'use client';

import { useState, useEffect } from 'react';
import { EventData, ThemeConfig } from '@/types';
import { getTimeUntil, TimeUntilResult } from '@/lib/utils';

interface CountdownBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function CountdownBlock({ data, theme, variant, isPreview }: CountdownBlockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeUntilResult>(() => getTimeUntil(data.date, data.time));

  useEffect(() => {
    // Don't run timer in preview mode or if showing placeholder
    if (isPreview || timeLeft.isPlaceholder) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeUntil(data.date, data.time));
    }, 1000);

    return () => clearInterval(timer);
  }, [data.date, data.time, isPreview, timeLeft.isPlaceholder]);

  // Update when data changes
  useEffect(() => {
    setTimeLeft(getTimeUntil(data.date, data.time));
  }, [data.date, data.time]);

  const units = [
    { value: timeLeft.days, label: 'дней', labelKz: 'күн' },
    { value: timeLeft.hours, label: 'часов', labelKz: 'сағат' },
    { value: timeLeft.minutes, label: 'минут', labelKz: 'минут' },
    { value: timeLeft.seconds, label: 'секунд', labelKz: 'секунд' },
  ];

  if (timeLeft.isPast && !timeLeft.isPlaceholder) {
    return (
      <section
        className="py-16 px-8 text-center"
        style={{ backgroundColor: theme.colors.secondary }}
      >
        <h2
          className="text-2xl md:text-3xl"
          style={{
            fontFamily: theme.fonts.heading,
            color: theme.colors.text,
          }}
        >
          Событие состоялось!
        </h2>
        <p
          className="mt-4"
          style={{ color: theme.colors.textMuted }}
        >
          Спасибо, что были с нами
        </p>
      </section>
    );
  }

  const boxStyle = variant === 'boxed' ? 'border-2' : '';
  const numberSize = variant === 'large-number' ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl';

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.secondary }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className="text-xl md:text-2xl mb-10"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          До события осталось
        </h2>

        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((unit, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${boxStyle} rounded-xl p-4 min-w-[70px] md:min-w-[90px]`}
              style={{
                borderColor: boxStyle ? theme.colors.accent + '40' : undefined,
                backgroundColor: variant === 'boxed' ? theme.colors.primary : undefined,
              }}
            >
              <span
                className={`${numberSize} font-bold`}
                style={{ color: theme.colors.accent }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span
                className="text-xs md:text-sm mt-2"
                style={{ color: theme.colors.textMuted }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
