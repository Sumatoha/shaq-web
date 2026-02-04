const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE}/api${endpoint}`;
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || 'An error occurred');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  register: (login: string, password: string, name: string) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ login, password, name }),
      requireAuth: false,
    }),

  login: (login: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
      requireAuth: false,
    }),

  getMe: () => request<any>('/auth/me'),

  // Events
  createEvent: (data: any) =>
    request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getEvents: () => request<any[]>('/events'),

  getEvent: (id: string) => request<any>(`/events/${id}`),

  updateEvent: (id: string, data: any) =>
    request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  publishEvent: (id: string) =>
    request<any>(`/events/${id}/publish`, {
      method: 'PUT',
    }),

  deleteEvent: (id: string) =>
    request<void>(`/events/${id}`, {
      method: 'DELETE',
    }),

  updateSeating: (id: string, tables: any[]) =>
    request<void>(`/events/${id}/seating`, {
      method: 'PUT',
      body: JSON.stringify({ tables }),
    }),

  // Guests
  createGuest: (eventId: string, data: any) =>
    request<any>(`/events/${eventId}/guests`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createGuestsBulk: (eventId: string, names: string[]) =>
    request<any[]>(`/events/${eventId}/guests/bulk`, {
      method: 'POST',
      body: JSON.stringify({ names }),
    }),

  getGuests: (eventId: string) => request<any[]>(`/events/${eventId}/guests`),

  updateGuest: (eventId: string, guestId: string, data: any) =>
    request<any>(`/events/${eventId}/guests/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGuest: (eventId: string, guestId: string) =>
    request<void>(`/events/${eventId}/guests/${guestId}`, {
      method: 'DELETE',
    }),

  getDashboard: (eventId: string) => request<any>(`/events/${eventId}/dashboard`),

  // Themes
  getThemes: () => request<any[]>('/themes', { requireAuth: false }),

  getTheme: (slug: string) => request<any>(`/themes/${slug}`, { requireAuth: false }),

  // Public invitation
  getPublicInvitation: (slug: string) =>
    request<any>(`/i/${slug}`, { requireAuth: false }),

  getPublicInvitationWithGuest: (slug: string, guestSlug: string) =>
    request<any>(`/i/${slug}/${guestSlug}`, { requireAuth: false }),

  submitRSVP: (slug: string, guestSlug: string, data: any) =>
    request<any>(`/i/${slug}/${guestSlug}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth: false,
    }),

  // Upload
  getPresignedUrl: (eventId: string, filename: string) =>
    request<{ uploadUrl: string; fileUrl: string }>('/upload/presign', {
      method: 'POST',
      body: JSON.stringify({ eventId, filename }),
    }),

  // Photo Hub
  getGuestPhotoPresignedUrl: (slug: string, filename: string) =>
    request<{ uploadUrl: string; fileUrl: string }>(`/i/${slug}/photos/upload`, {
      method: 'POST',
      body: JSON.stringify({ filename }),
      requireAuth: false,
    }),

  getGuestPhotos: (slug: string) =>
    request<{ photos: string[] }>(`/i/${slug}/photos`, { requireAuth: false }),

  // AI Design
  getAISession: (eventId: string) =>
    request<{ messages: any[]; currentHtml: string }>(`/events/${eventId}/ai-design`),

  generateAIDesign: (eventId: string, message: string) =>
    request<{ html: string; message: string }>(`/events/${eventId}/ai-design`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  resetAISession: (eventId: string) =>
    request<void>(`/events/${eventId}/ai-design`, {
      method: 'DELETE',
    }),
};

export { ApiError };
