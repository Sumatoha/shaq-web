'use client';

import { EventData, ThemeConfig, TemplateType } from '@/types';
import { ClassicElegant } from './ClassicElegant';

export interface TemplateProps {
  data: EventData;
  theme: ThemeConfig;
  guestName?: string;
  onRSVP?: (status: string, guestCount: number, wishes: string) => void;
}

// Template registry
const templates: Record<TemplateType, React.ComponentType<TemplateProps>> = {
  'classic-elegant': ClassicElegant,
  // Placeholders - will show ClassicElegant until implemented
  'horizontal-story': ClassicElegant,
  'typewriter-reveal': ClassicElegant,
  'light-switch': ClassicElegant,
  'card-flip': ClassicElegant,
  'parallax-cinematic': ClassicElegant,
  'minimal-modern': ClassicElegant,
  'magazine-layout': ClassicElegant,
  'kazakh-ornamental': ClassicElegant,
};

interface TemplateRendererProps extends TemplateProps {
  template: TemplateType;
}

export function TemplateRenderer({ template, ...props }: TemplateRendererProps) {
  const Template = templates[template] || ClassicElegant;
  return <Template {...props} />;
}

// Export individual templates
export { ClassicElegant };

// Template metadata for editor
export const TEMPLATE_INFO: Record<TemplateType, { name: string; description: string; preview: string }> = {
  'classic-elegant': {
    name: 'Классическая элегантность',
    description: 'Традиционный вертикальный скролл с конвертом и орнаментами',
    preview: '/templates/classic-elegant.jpg',
  },
  'horizontal-story': {
    name: 'Горизонтальная история',
    description: 'Свайп влево-вправо как в сторис',
    preview: '/templates/horizontal-story.jpg',
  },
  'typewriter-reveal': {
    name: 'Печатная машинка',
    description: 'Текст появляется как будто печатается',
    preview: '/templates/typewriter-reveal.jpg',
  },
  'light-switch': {
    name: 'Выключатель',
    description: 'Тёмная тема, можно "включить свет" дёрнув за шнур',
    preview: '/templates/light-switch.jpg',
  },
  'card-flip': {
    name: 'Переворот карточек',
    description: 'Секции переворачиваются как карточки',
    preview: '/templates/card-flip.jpg',
  },
  'parallax-cinematic': {
    name: 'Кинематограф',
    description: 'Глубокий параллакс, кинематографичный эффект',
    preview: '/templates/parallax-cinematic.jpg',
  },
  'minimal-modern': {
    name: 'Минимал модерн',
    description: 'Чистый дизайн, много воздуха, тонкие анимации',
    preview: '/templates/minimal-modern.jpg',
  },
  'magazine-layout': {
    name: 'Журнальный стиль',
    description: 'Layout как в журнале с разными размерами секций',
    preview: '/templates/magazine-layout.jpg',
  },
  'kazakh-ornamental': {
    name: 'Қазақ өрнегі',
    description: 'Богатые казахские орнаменты и узоры',
    preview: '/templates/kazakh-ornamental.jpg',
  },
};
