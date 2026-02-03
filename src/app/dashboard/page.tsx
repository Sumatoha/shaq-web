'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Edit2, Eye, Trash2, Users, Calendar, ExternalLink, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { Event, EventType, EVENT_TYPE_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newEvent, setNewEvent] = useState({
    eventType: '' as EventType,
    person1: '',
    person2: '',
    date: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data || []);
    } catch (error) {
      toast.error('Не удалось загрузить события');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const event = await api.createEvent({
        eventType: newEvent.eventType,
        names: {
          person1: newEvent.person1,
          person2: newEvent.person2 || undefined,
        },
        date: newEvent.date,
      });
      toast.success('Приглашение создано!');
      setShowCreateModal(false);
      setCreateStep(1);
      setNewEvent({ eventType: '' as EventType, person1: '', person2: '', date: '' });
      router.push(`/editor/${event.id}`);
    } catch (error) {
      toast.error('Не удалось создать приглашение');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это приглашение?')) return;

    try {
      await api.deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
      toast.success('Приглашение удалено');
    } catch (error) {
      toast.error('Не удалось удалить приглашение');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const eventTypes: EventType[] = ['wedding', 'sundet', 'tusau', 'birthday', 'jubilee', 'corporate'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-muted-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-serif font-bold">Shaq</span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-muted hover:text-foreground transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold">Мои приглашения</h1>
            <p className="text-muted">Создавайте и управляйте приглашениями</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} className="mr-2" />
            Создать приглашение
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : events.length === 0 ? (
          <Card variant="bordered" className="text-center py-12">
            <div className="text-6xl mb-4">💌</div>
            <h3 className="text-lg font-semibold mb-2">У вас пока нет приглашений</h3>
            <p className="text-muted mb-6">Создайте своё первое приглашение прямо сейчас</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="mr-2" />
              Создать приглашение
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="bordered" className="h-full flex flex-col">
                  <div className="h-2 bg-accent rounded-t-xl -mx-6 -mt-6 mb-4" />

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-semibold text-lg">
                        {event.data.names.person1}
                        {event.data.names.person2 && ` & ${event.data.names.person2}`}
                      </h3>
                      <p className="text-sm text-muted">
                        {EVENT_TYPE_LABELS[event.eventType]?.emoji}{' '}
                        {EVENT_TYPE_LABELS[event.eventType]?.label}
                      </p>
                    </div>
                    <Badge variant={event.status === 'published' ? 'success' : 'default'}>
                      {event.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {event.data.date ? formatDate(event.data.date) : 'Дата не указана'}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-4 border-t border-muted-foreground/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/editor/${event.id}`)}
                    >
                      <Edit2 size={16} className="mr-1" />
                      Редактировать
                    </Button>
                    {event.status === 'published' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/i/${event.slug}`, '_blank')}
                      >
                        <Eye size={16} className="mr-1" />
                        Просмотр
                      </Button>
                    )}
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="ml-auto p-2 text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateStep(1);
        }}
        title="Создать приглашение"
        size="lg"
      >
        {createStep === 1 && (
          <div>
            <p className="text-muted mb-4">Выберите тип события</p>
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setNewEvent({ ...newEvent, eventType: type });
                    setCreateStep(2);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    newEvent.eventType === type
                      ? 'border-accent bg-accent/5'
                      : 'border-muted-foreground/20 hover:border-accent/50'
                  }`}
                >
                  <span className="text-2xl">{EVENT_TYPE_LABELS[type]?.emoji}</span>
                  <p className="mt-2 font-medium">{EVENT_TYPE_LABELS[type]?.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {createStep === 2 && (
          <div>
            <p className="text-muted mb-4">Укажите основные данные</p>
            <div className="space-y-4">
              <Input
                label={newEvent.eventType === 'wedding' ? 'Имя жениха' : 'Имя'}
                value={newEvent.person1}
                onChange={(e) => setNewEvent({ ...newEvent, person1: e.target.value })}
                placeholder="Айдар"
              />
              {(newEvent.eventType === 'wedding') && (
                <Input
                  label="Имя невесты"
                  value={newEvent.person2}
                  onChange={(e) => setNewEvent({ ...newEvent, person2: e.target.value })}
                  placeholder="Дана"
                />
              )}
              <Input
                label="Дата события"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setCreateStep(1)}>
                Назад
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={!newEvent.person1 || !newEvent.date}
                className="flex-1"
              >
                Создать приглашение
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
