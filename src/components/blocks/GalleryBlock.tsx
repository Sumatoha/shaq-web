'use client';

import { EventData, ThemeConfig } from '@/types';

interface GalleryBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function GalleryBlock({ data, theme, variant, isPreview }: GalleryBlockProps) {
  const photos = data.photos?.gallery || [];

  if (photos.length === 0) {
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
            Галерея
          </h2>
          <p style={{ color: theme.colors.textMuted }}>
            Фотографии будут добавлены позже
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
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-2xl md:text-3xl text-center mb-10"
          style={{
            fontFamily: theme.fonts.heading,
            fontWeight: theme.fonts.headingWeight,
            color: theme.colors.text,
          }}
        >
          Галерея
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="aspect-square rounded-xl overflow-hidden bg-muted-foreground/10"
            >
              <img
                src={photo}
                alt={`Фото ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
