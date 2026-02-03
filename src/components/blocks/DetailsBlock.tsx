'use client';

import { Calendar, Clock, MapPin, Shirt } from 'lucide-react';
import { EventData, ThemeConfig } from '@/types';
import { formatDate } from '@/lib/utils';

interface DetailsBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function DetailsBlock({ data, theme, variant, isPreview }: DetailsBlockProps) {
  const details = [
    {
      icon: Calendar,
      label: 'Дата',
      value: data.date ? formatDate(data.date) : 'Не указана',
    },
    {
      icon: Clock,
      label: 'Время',
      value: data.time || 'Не указано',
      sub: data.gatheringTime ? `Сбор гостей: ${data.gatheringTime}` : undefined,
    },
    {
      icon: MapPin,
      label: 'Место',
      value: data.venue?.name || 'Не указано',
      sub: data.venue?.address,
    },
  ];

  if (data.dressCode) {
    details.push({
      icon: Shirt,
      label: 'Дресс-код',
      value: data.dressCode,
    });
  }

  const cardStyle = {
    bordered: 'border-2',
    shadow: 'shadow-lg',
    flat: '',
  }[theme.decoration.cardStyle] || '';

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.primary }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl md:text-3xl text-center mb-10"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          Детали
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${cardStyle}`}
              style={{
                backgroundColor: theme.colors.secondary,
                borderColor: cardStyle.includes('border') ? theme.colors.accent + '30' : undefined,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.colors.accent + '20' }}
                >
                  <detail.icon size={20} style={{ color: theme.colors.accent }} />
                </div>
                <div>
                  <p
                    className="text-sm mb-1"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {detail.label}
                  </p>
                  <p
                    className="font-medium"
                    style={{ color: theme.colors.text }}
                  >
                    {detail.value}
                  </p>
                  {detail.sub && (
                    <p
                      className="text-sm mt-1"
                      style={{ color: theme.colors.textMuted }}
                    >
                      {detail.sub}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
