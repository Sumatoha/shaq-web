export type EventType = 'wedding' | 'sundet' | 'tusau' | 'birthday' | 'jubilee' | 'corporate';
export type EventStatus = 'draft' | 'published' | 'archived';
export type RSVPStatus = 'pending' | 'confirmed' | 'declined';
export type BlockType = 'hero' | 'intro' | 'greeting' | 'details' | 'countdown' | 'program' | 'location' | 'gallery' | 'rsvp' | 'story' | 'wishes' | 'dresscode' | 'baby-info' | 'footer';

export interface User {
  id: string;
  login: string;
  name: string;
  phone?: string;
  plan: 'free' | 'standard' | 'premium';
}

export interface EventNames {
  person1: string;
  person2?: string;
}

export interface Venue {
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
  twoGisId?: string;
}

export interface ProgramItem {
  time: string;
  title: string;
  desc?: string;
}

export interface EventPhotos {
  hero?: string;
  gallery?: string[];
}

export interface EventData {
  names: EventNames;
  date: string;
  time: string;
  gatheringTime?: string;
  venue: Venue;
  greetingKz?: string;
  greetingRu?: string;
  dressCode?: string;
  hashtag?: string;
  rsvpDeadline?: string;
  program?: ProgramItem[];
  photos?: EventPhotos;
}

export interface BlockConfig {
  type: BlockType;
  variant: string;
  enabled: boolean;
  order: number;
}

export interface EventThemeRef {
  id: string;
  customColors?: Record<string, string>;
}

export interface SeatingTable {
  tableNumber: number;
  tableName?: string;
  guestIds: string[];
}

export interface Event {
  id: string;
  userId: string;
  slug: string;
  status: EventStatus;
  eventType: EventType;
  data: EventData;
  theme: EventThemeRef;
  blocks: BlockConfig[];
  seating?: SeatingTable[];
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  phone?: string;
  slug: string;
  personalLink: string;
  rsvpStatus: RSVPStatus;
  guestCount: number;
  wishes?: string;
  tableNumber?: number;
  viewedAt?: string;
  respondedAt?: string;
}

export interface RSVPStats {
  confirmed: number;
  declined: number;
  pending: number;
  totalGuests: number;
}

export interface DashboardData {
  guests: Guest[];
  stats: RSVPStats;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  accentLight: string;
  text: string;
  textMuted: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface ThemeDecoration {
  cornerOrnaments: boolean;
  dividerStyle: 'diamond' | 'line' | 'dots' | 'none';
  borderStyle: 'double' | 'single' | 'none';
  cardStyle: 'bordered' | 'shadow' | 'flat';
  buttonStyle: 'sharp' | 'rounded';
  animationSpeed: 'smooth' | 'snappy' | 'none';
}

export interface ThemeAssets {
  cornerSvg?: string;
  dividerSvg?: string;
  patternBg?: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: ThemeFonts;
  decoration: ThemeDecoration;
  assets: ThemeAssets;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string;
  previewUrl: string;
  tier: 'free' | 'standard' | 'premium';
  supportedEventTypes: EventType[];
  config: ThemeConfig;
}

export interface PublicEventResponse {
  id: string;
  slug: string;
  eventType: EventType;
  data: EventData;
  theme: ThemeConfig;
  blocks: BlockConfig[];
}

export interface PublicGuestEventResponse extends PublicEventResponse {
  guestName: string;
  tableNumber?: number;
}

export const BLOCK_VARIANTS: Record<BlockType, { value: string; label: string }[]> = {
  hero: [
    { value: 'fullscreen-text', label: 'Текст на весь экран' },
    { value: 'photo-bg', label: 'Фото на фоне' },
    { value: 'split-screen', label: 'Разделённый' },
  ],
  intro: [
    { value: 'envelope', label: 'Конверт' },
    { value: 'swipe-up', label: 'Свайп вверх' },
    { value: 'none', label: 'Без заставки' },
  ],
  greeting: [
    { value: 'bilingual', label: 'Двуязычное' },
    { value: 'single-lang', label: 'Одноязычное' },
    { value: 'with-photo', label: 'С фото' },
  ],
  details: [
    { value: 'cards', label: 'Карточки' },
    { value: 'list', label: 'Список' },
    { value: 'icon-grid', label: 'Иконки в сетке' },
  ],
  countdown: [
    { value: 'minimal', label: 'Минимальный' },
    { value: 'boxed', label: 'В рамках' },
    { value: 'large-number', label: 'Крупные числа' },
  ],
  program: [
    { value: 'timeline', label: 'Таймлайн' },
    { value: 'cards', label: 'Карточки' },
    { value: 'horizontal', label: 'Горизонтальный' },
  ],
  location: [
    { value: 'map-with-button', label: 'Карта + кнопка' },
    { value: 'address-only', label: 'Только адрес' },
  ],
  gallery: [
    { value: 'grid', label: 'Сетка' },
    { value: 'carousel', label: 'Карусель' },
    { value: 'masonry', label: 'Masonry' },
  ],
  rsvp: [
    { value: 'full-form', label: 'Полная форма' },
    { value: 'simple-buttons', label: 'Приду / Не приду' },
  ],
  story: [
    { value: 'timeline', label: 'Таймлайн' },
    { value: 'slides', label: 'Слайды' },
  ],
  wishes: [
    { value: 'open-text', label: 'Свободный текст' },
    { value: 'gift-registry', label: 'Реестр подарков' },
  ],
  dresscode: [
    { value: 'visual-palette', label: 'Цветовая палитра' },
    { value: 'text-only', label: 'Текст' },
  ],
  'baby-info': [
    { value: 'photo-stats', label: 'Фото + данные' },
    { value: 'milestone', label: 'Milestone' },
  ],
  footer: [
    { value: 'minimal', label: 'Минимальный' },
    { value: 'with-hashtag', label: 'С хэштегом' },
  ],
};

export const EVENT_TYPE_LABELS: Record<EventType, { label: string; emoji: string }> = {
  wedding: { label: 'Свадьба', emoji: '💒' },
  sundet: { label: 'Сүндет той', emoji: '👶' },
  tusau: { label: 'Тұсау кесу', emoji: '🎀' },
  birthday: { label: 'День рождения', emoji: '🎂' },
  jubilee: { label: 'Юбилей', emoji: '🎉' },
  corporate: { label: 'Корпоратив', emoji: '🏢' },
};
