'use client';

import { MapPin, Navigation, Map } from 'lucide-react';
import { EventData, ThemeConfig } from '@/types';

interface LocationBlockProps {
  data: EventData;
  theme: ThemeConfig;
  variant: string;
  isPreview?: boolean;
}

export function LocationBlock({ data, theme, variant, isPreview }: LocationBlockProps) {
  const { venue } = data;

  const openGoogleMaps = () => {
    if (venue?.mapUrl) {
      window.open(venue.mapUrl, '_blank');
    } else if (venue?.lat && venue?.lng) {
      window.open(`https://www.google.com/maps?q=${venue.lat},${venue.lng}`, '_blank');
    }
  };

  const open2GIS = () => {
    if (venue?.twoGisId) {
      window.open(`https://2gis.kz/almaty/firm/${venue.twoGisId}`, '_blank');
    } else if (venue?.lat && venue?.lng) {
      window.open(`dgis://2gis.kz/routeSearch/to/${venue.lng},${venue.lat}`, '_blank');
    }
  };

  const buttonStyle = theme.decoration.buttonStyle === 'rounded'
    ? 'rounded-full'
    : 'rounded-lg';

  return (
    <section
      className="py-16 px-8"
      style={{ backgroundColor: theme.colors.secondary }}
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
          Место проведения
        </h2>

        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: theme.colors.accent + '20' }}
          >
            <MapPin size={28} style={{ color: theme.colors.accent }} />
          </div>

          <h3
            className="text-xl font-medium mb-2"
            style={{ color: theme.colors.text }}
          >
            {venue?.name || 'Место не указано'}
          </h3>

          {venue?.address && (
            <p style={{ color: theme.colors.textMuted }}>
              {venue.address}
            </p>
          )}
        </div>

        {/* Map embed */}
        {venue?.lat && venue?.lng && !isPreview && (
          <div className="mb-8 rounded-xl overflow-hidden h-[200px]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${venue.lat},${venue.lng}&zoom=15`}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={openGoogleMaps}
            disabled={isPreview}
            className={`flex items-center justify-center gap-2 px-6 py-3 ${buttonStyle} font-medium transition-colors`}
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.secondary,
            }}
          >
            <Map size={18} />
            Google Maps
          </button>

          <button
            onClick={open2GIS}
            disabled={isPreview}
            className={`flex items-center justify-center gap-2 px-6 py-3 ${buttonStyle} font-medium transition-colors border-2`}
            style={{
              borderColor: theme.colors.accent,
              color: theme.colors.accent,
              backgroundColor: 'transparent',
            }}
          >
            <Navigation size={18} />
            2GIS
          </button>
        </div>
      </div>
    </section>
  );
}
