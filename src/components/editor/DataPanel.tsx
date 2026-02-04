'use client';

import { useEditorStore } from '@/stores/editor-store';
import { Input } from '@/components/ui/Input';

export function DataPanel() {
  const { event, updateData } = useEditorStore();

  if (!event) return null;

  const { data } = event;

  return (
    <div className="space-y-6">
      {/* Names */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Имена</h3>
        <div className="space-y-3">
          <Input
            label="Имя 1"
            value={data.names.person1}
            onChange={(e) => updateData('names.person1', e.target.value)}
            placeholder="Айдар"
          />
          {event.eventType === 'wedding' && (
            <Input
              label="Имя 2"
              value={data.names.person2 || ''}
              onChange={(e) => updateData('names.person2', e.target.value)}
              placeholder="Дана"
            />
          )}
        </div>
      </section>

      {/* Date & Time */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Дата и время</h3>
        <div className="space-y-3">
          <Input
            label="Дата"
            type="date"
            value={data.date}
            onChange={(e) => updateData('date', e.target.value)}
          />
          <Input
            label="Время начала"
            type="time"
            value={data.time || ''}
            onChange={(e) => updateData('time', e.target.value)}
          />
          <Input
            label="Сбор гостей"
            type="time"
            value={data.gatheringTime || ''}
            onChange={(e) => updateData('gatheringTime', e.target.value)}
          />
        </div>
      </section>

      {/* Venue */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Место проведения</h3>
        <div className="space-y-3">
          <Input
            label="Название"
            value={data.venue?.name || ''}
            onChange={(e) => updateData('venue.name', e.target.value)}
            placeholder="Ресторан Той"
          />
          <Input
            label="Адрес"
            value={data.venue?.address || ''}
            onChange={(e) => updateData('venue.address', e.target.value)}
            placeholder="ул. Абая 123, Алматы"
          />
          <Input
            label="Ссылка на карту"
            value={data.venue?.mapUrl || ''}
            onChange={(e) => updateData('venue.mapUrl', e.target.value)}
            placeholder="https://maps.google.com/..."
          />
          <Input
            label="2GIS ID"
            value={data.venue?.twoGisId || ''}
            onChange={(e) => updateData('venue.twoGisId', e.target.value)}
            placeholder="ID организации в 2GIS"
          />
        </div>
      </section>

      {/* Greeting */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Текст приглашения</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">На казахском</label>
            <textarea
              value={data.greetingKz || ''}
              onChange={(e) => updateData('greetingKz', e.target.value)}
              className="w-full px-3 py-2 border border-muted-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={3}
              placeholder="Құрметті қонақ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">На русском</label>
            <textarea
              value={data.greetingRu || ''}
              onChange={(e) => updateData('greetingRu', e.target.value)}
              className="w-full px-3 py-2 border border-muted-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              rows={3}
              placeholder="Уважаемый гость..."
            />
          </div>
        </div>
      </section>

      {/* Additional */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Дополнительно</h3>
        <div className="space-y-3">
          <Input
            label="Дресс-код"
            value={data.dressCode || ''}
            onChange={(e) => updateData('dressCode', e.target.value)}
            placeholder="Классический / Пастельные тона"
          />
          <Input
            label="Хэштег"
            value={data.hashtag || ''}
            onChange={(e) => updateData('hashtag', e.target.value)}
            placeholder="#АйдарДана2026"
          />
          <Input
            label="Дедлайн RSVP"
            type="date"
            value={data.rsvpDeadline || ''}
            onChange={(e) => updateData('rsvpDeadline', e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}
