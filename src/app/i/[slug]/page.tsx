'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { InvitationPage } from '@/components/invitation/InvitationPage';
import { api } from '@/lib/api';
import { PublicEventResponse } from '@/types';

export default function PublicInvitationPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [invitation, setInvitation] = useState<PublicEventResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadInvitation(slug);
    }
  }, [slug]);

  const loadInvitation = async (eventSlug: string) => {
    try {
      const data = await api.getPublicInvitation(eventSlug);
      setInvitation(data);

      const names = data.data.names.person2
        ? `${data.data.names.person1} & ${data.data.names.person2}`
        : data.data.names.person1;
      document.title = `Приглашение от ${names} | Shaq`;
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

  return <InvitationPage invitation={invitation} />;
}
