'use client';

import { useMemo } from 'react';
import { ThemeConfig } from '@/types';

export function useThemeStyles(theme: ThemeConfig | null) {
  const styles = useMemo(() => {
    if (!theme) return {};

    const { colors, fonts, decoration } = theme;

    const borderRadius = decoration.buttonStyle === 'rounded' ? '0.5rem' : '0';
    const animationDuration = decoration.animationSpeed === 'smooth' ? '0.5s' :
                              decoration.animationSpeed === 'snappy' ? '0.2s' : '0s';

    return {
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-accent': colors.accent,
      '--color-accent-light': colors.accentLight,
      '--color-text': colors.text,
      '--color-text-muted': colors.textMuted,
      '--font-heading': fonts.heading,
      '--font-body': fonts.body,
      '--font-heading-weight': fonts.headingWeight,
      '--font-body-weight': fonts.bodyWeight,
      '--border-radius': borderRadius,
      '--animation-duration': animationDuration,
    } as React.CSSProperties;
  }, [theme]);

  const fontLinks = useMemo(() => {
    if (!theme) return [];

    const fonts = [theme.fonts.heading, theme.fonts.body].filter(
      (f, i, arr) => arr.indexOf(f) === i
    );

    return fonts.map((font) => {
      const fontName = font.replace(/ /g, '+');
      return `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
    });
  }, [theme]);

  return { styles, fontLinks };
}
