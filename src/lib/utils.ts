import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default placeholder data for preview/empty states
export const DEFAULT_PLACEHOLDER = {
  date: '2025-06-15',
  time: '18:00',
  names: { person1: 'Айдар', person2: 'Дана' },
  venue: { name: 'Ресторан', address: 'Алматы' },
  greetingKz: 'Құрметті қонақтар, сіздерді біздің тойға шақырамыз!',
  greetingRu: 'Уважаемые гости, приглашаем вас на наше торжество!',
};

// Check if a date string is valid
export function isValidDate(dateString: string | undefined | null): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Safe date formatting with fallback
export function formatDate(dateString: string | undefined | null, locale: string = 'ru-RU'): string {
  if (!dateString) return 'Дата не указана';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Дата не указана';

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Safe date formatting for RSVP deadline
export function formatRsvpDeadline(dateString: string | undefined | null, locale: string = 'ru-RU'): string | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  });
}

export function formatTime(timeString: string | undefined | null): string {
  if (!timeString) return '';
  return timeString;
}

export function getDaysUntil(dateString: string | undefined | null): number {
  if (!dateString) return 90; // Default placeholder

  const eventDate = new Date(dateString);
  if (isNaN(eventDate.getTime())) return 90;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diff = eventDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export interface TimeUntilResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isPlaceholder: boolean;
}

export function getTimeUntil(dateString: string | undefined | null, timeString: string = '12:00'): TimeUntilResult {
  // Return placeholder countdown if no date provided
  if (!dateString) {
    return { days: 90, hours: 12, minutes: 30, seconds: 45, isPast: false, isPlaceholder: true };
  }

  const dateParts = dateString.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) {
    return { days: 90, hours: 12, minutes: 30, seconds: 45, isPast: false, isPlaceholder: true };
  }

  const [year, month, day] = dateParts;
  const timeParts = (timeString || '12:00').split(':').map(Number);
  const [hours, minutes] = timeParts.length >= 2 ? timeParts : [12, 0];

  if (isNaN(hours) || isNaN(minutes)) {
    return { days: 90, hours: 12, minutes: 30, seconds: 45, isPast: false, isPlaceholder: true };
  }

  const eventDate = new Date(year, month - 1, day, hours, minutes);
  if (isNaN(eventDate.getTime())) {
    return { days: 90, hours: 12, minutes: 30, seconds: 45, isPast: false, isPlaceholder: true };
  }

  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isPlaceholder: false };
  }

  const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

  return { days: daysLeft, hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft, isPast: false, isPlaceholder: false };
}

export function generateWhatsAppLink(personalLink: string, guestName: string): string {
  const fullUrl = `https://shaq.kz${personalLink}`;
  const message = encodeURIComponent(
    `Құрметті ${guestName}!\n\nСізді біздің тойға шақырамыз!\n\n${fullUrl}`
  );
  return `https://wa.me/?text=${message}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
