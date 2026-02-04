'use client';

import { useThemeStyles } from '@/hooks/use-theme-styles';
import { TemplateRenderer } from '@/components/templates';
import { PublicEventResponse, ThemeConfig } from '@/types';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface InvitationPageProps {
  invitation: PublicEventResponse;
  guestName?: string;
  guestSlug?: string;
  eventSlug?: string;
}

export function InvitationPage({ invitation, guestName, guestSlug, eventSlug }: InvitationPageProps) {
  const theme = invitation.theme as ThemeConfig;
  const { fontLinks } = useThemeStyles(theme);

  const handleRSVP = async (status: string, guestCount: number, wishes: string) => {
    if (!eventSlug || !guestSlug) {
      toast.error('Невозможно отправить ответ');
      return;
    }

    try {
      await api.submitRSVP(eventSlug, guestSlug, { status, guestCount, wishes });
      toast.success('Ваш ответ записан!');
    } catch (error) {
      toast.error('Ошибка при отправке ответа');
      throw error;
    }
  };

  // Use template system - fallback to classic-elegant if not specified
  const template = invitation.template || 'classic-elegant';

  return (
    <>
      {fontLinks.map((link) => (
        <link key={link} rel="stylesheet" href={link} />
      ))}
      <TemplateRenderer
        template={template}
        data={invitation.data}
        theme={theme}
        guestName={guestName}
        onRSVP={guestSlug ? handleRSVP : undefined}
      />
    </>
  );
}
