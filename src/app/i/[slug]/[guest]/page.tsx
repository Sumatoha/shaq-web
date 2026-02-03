'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitationPage } from '@/components/invitation/InvitationPage';
import { api } from '@/lib/api';
import { PublicGuestEventResponse } from '@/types';

export default function PersonalInvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guestSlug = params.guest as string;

  const [invitation, setInvitation] = useState<PublicGuestEventResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && guestSlug) {
      loadInvitation(slug, guestSlug);
    }
  }, [slug, guestSlug]);

  const loadInvitation = async (eventSlug: string, guest: string) => {
    try {
      const data = await api.getPublicInvitationWithGuest(eventSlug, guest);
      setInvitation(data);

      const names = data.data.names.person2
        ? `${data.data.names.person1} & ${data.data.names.person2}`
        : data.data.names.person1;
      document.title = `Приглашение для ${data.guestName} от ${names} | Shaq`;
    } catch (err) {
      setError('Приглашение не найдено');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted">Загрузка приглашения...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted mb-8">{error || 'Приглашение не найдено'}</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
          >
            Вернуться на главную
          </a>
        </div>
      </div>
    );
  }

  return (
    <InvitationPage
      invitation={invitation}
      guestName={invitation.guestName}
      guestSlug={guestSlug}
      eventSlug={slug}
    />
  );
}
