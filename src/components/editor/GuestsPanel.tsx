'use client';

import { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, MessageCircle, Users } from 'lucide-react';
import { useEditorStore } from '@/stores/editor-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { Guest, DashboardData } from '@/types';
import { copyToClipboard, generateWhatsAppLink } from '@/lib/utils';
import toast from 'react-hot-toast';

export function GuestsPanel() {
  const { event } = useEditorStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newGuestName, setNewGuestName] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkNames, setBulkNames] = useState('');

  useEffect(() => {
    if (event?.id) {
      loadDashboard();
    }
  }, [event?.id]);

  const loadDashboard = async () => {
    if (!event?.id) return;
    try {
      const data = await api.getDashboard(event.id);
      setDashboard(data);
    } catch (error) {
      toast.error('Не удалось загрузить гостей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!event?.id || !newGuestName.trim()) return;
    try {
      await api.createGuest(event.id, { name: newGuestName.trim() });
      setNewGuestName('');
      loadDashboard();
      toast.success('Гость добавлен');
    } catch (error) {
      toast.error('Ошибка добавления гостя');
    }
  };

  const handleBulkAdd = async () => {
    if (!event?.id || !bulkNames.trim()) return;
    const names = bulkNames.split('\n').map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) return;

    try {
      await api.createGuestsBulk(event.id, names);
      setBulkNames('');
      setShowBulkModal(false);
      loadDashboard();
      toast.success(`Добавлено ${names.length} гостей`);
    } catch (error) {
      toast.error('Ошибка добавления гостей');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!event?.id) return;
    try {
      await api.deleteGuest(event.id, guestId);
      loadDashboard();
      toast.success('Гость удалён');
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleCopyLink = async (guest: Guest) => {
    const link = `https://shaq.kz${guest.personalLink}`;
    await copyToClipboard(link);
    toast.success('Ссылка скопирована');
  };

  const handleShareWhatsApp = (guest: Guest) => {
    const link = generateWhatsAppLink(guest.personalLink, guest.name);
    window.open(link, '_blank');
  };

  if (!event) return null;

  const stats = dashboard?.stats || { confirmed: 0, declined: 0, pending: 0, totalGuests: 0 };
  const guests = dashboard?.guests || [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-xs text-green-700">Придут</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          <div className="text-xs text-red-700">Не придут</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-yellow-700">Ожидают</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.totalGuests}</div>
          <div className="text-xs text-blue-700">Всего гостей</div>
        </div>
      </div>

      {/* Add guest */}
      <div className="flex gap-2">
        <Input
          placeholder="Имя гостя"
          value={newGuestName}
          onChange={(e) => setNewGuestName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddGuest()}
        />
        <Button onClick={handleAddGuest} disabled={!newGuestName.trim()}>
          <Plus size={18} />
        </Button>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={() => setShowBulkModal(true)}>
        <Users size={16} className="mr-2" />
        Массовый импорт
      </Button>

      {/* Guest list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
        </div>
      ) : guests.length === 0 ? (
        <p className="text-center text-muted text-sm py-4">Гости не добавлены</p>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {guests.map((guest) => (
            <div
              key={guest.id}
              className="flex items-center gap-2 p-3 bg-white rounded-lg border border-muted-foreground/20"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{guest.name}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      guest.rsvpStatus === 'confirmed' ? 'success' :
                      guest.rsvpStatus === 'declined' ? 'error' : 'default'
                    }
                  >
                    {guest.rsvpStatus === 'confirmed' ? 'Придёт' :
                     guest.rsvpStatus === 'declined' ? 'Не придёт' : 'Ожидает'}
                  </Badge>
                  {guest.guestCount > 1 && (
                    <span className="text-xs text-muted">+{guest.guestCount - 1}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleCopyLink(guest)}
                className="p-1.5 text-muted hover:text-foreground transition-colors"
                title="Скопировать ссылку"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => handleShareWhatsApp(guest)}
                className="p-1.5 text-muted hover:text-green-500 transition-colors"
                title="Отправить в WhatsApp"
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={() => handleDeleteGuest(guest.id)}
                className="p-1.5 text-muted hover:text-red-500 transition-colors"
                title="Удалить"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bulk import modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Массовый импорт">
        <div className="space-y-4">
          <p className="text-sm text-muted">Введите имена гостей, каждое с новой строки</p>
          <textarea
            value={bulkNames}
            onChange={(e) => setBulkNames(e.target.value)}
            className="w-full h-48 px-3 py-2 border border-muted-foreground/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder="Айгуль&#10;Бекзат&#10;Дана&#10;..."
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowBulkModal(false)}>
              Отмена
            </Button>
            <Button onClick={handleBulkAdd} className="flex-1">
              Добавить гостей
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
