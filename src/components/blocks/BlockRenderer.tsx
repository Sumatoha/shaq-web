'use client';

import { BlockConfig, EventData, ThemeConfig } from '@/types';
import { HeroBlock } from './HeroBlock';
import { GreetingBlock } from './GreetingBlock';
import { DetailsBlock } from './DetailsBlock';
import { CountdownBlock } from './CountdownBlock';
import { ProgramBlock } from './ProgramBlock';
import { LocationBlock } from './LocationBlock';
import { GalleryBlock } from './GalleryBlock';
import { RSVPBlock } from './RSVPBlock';
import { FooterBlock } from './FooterBlock';

interface BlockRendererProps {
  block: BlockConfig;
  data: EventData;
  theme: ThemeConfig;
  guestName?: string;
  isPreview?: boolean;
  onRSVP?: (status: string, guestCount: number, wishes: string) => void;
}

export function BlockRenderer({ block, data, theme, guestName, isPreview, onRSVP }: BlockRendererProps) {
  const commonProps = {
    data,
    theme,
    variant: block.variant,
    guestName,
    isPreview,
  };

  switch (block.type) {
    case 'hero':
      return <HeroBlock {...commonProps} />;
    case 'greeting':
      return <GreetingBlock {...commonProps} />;
    case 'details':
      return <DetailsBlock {...commonProps} />;
    case 'countdown':
      return <CountdownBlock {...commonProps} />;
    case 'program':
      return <ProgramBlock {...commonProps} />;
    case 'location':
      return <LocationBlock {...commonProps} />;
    case 'gallery':
      return <GalleryBlock {...commonProps} />;
    case 'rsvp':
      return <RSVPBlock {...commonProps} onSubmit={onRSVP} />;
    case 'footer':
      return <FooterBlock {...commonProps} />;
    case 'intro':
      // Intro block is handled separately at the page level
      return null;
    default:
      return (
        <div className="p-8 text-center text-sm opacity-50">
          Блок "{block.type}" в разработке
        </div>
      );
  }
}
