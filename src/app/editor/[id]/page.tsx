'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Smartphone, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useEditorStore } from '@/stores/editor-store';
import { useAuth } from '@/hooks/use-auth';
import { BlocksPanel } from '@/components/editor/BlocksPanel';
import { DataPanel } from '@/components/editor/DataPanel';
import { ThemePanel } from '@/components/editor/ThemePanel';
import { GuestsPanel } from '@/components/editor/GuestsPanel';
import { PreviewPanel } from '@/components/editor/PreviewPanel';
import { AIPanel } from '@/components/editor/AIPanel';
import toast from 'react-hot-toast';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    event,
    isLoading,
    isDirty,
    isSaving,
    activePanel,
    previewMode,
    loadEvent,
    loadThemes,
    setActivePanel,
    setPreviewMode,
    saveEvent,
    publishEvent,
  } = useEditorStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && eventId) {
      loadThemes();
      loadEvent(eventId);
    }
  }, [isAuthenticated, eventId, loadThemes, loadEvent]);

  const handleSave = async () => {
    try {
      await saveEvent();
      toast.success('Сохранено');
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handlePublish = async () => {
    try {
      await publishEvent();
      toast.success('Приглашение опубликовано!');
    } catch (error) {
      toast.error('Ошибка публикации');
    }
  };

  if (authLoading || isLoading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  const tabs = [
    { id: 'data', label: 'Данные' },
    { id: 'blocks', label: 'Блоки' },
    { id: 'theme', label: 'Тема' },
    { id: 'guests', label: 'Гости' },
    { id: 'ai', label: 'AI' },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-none h-14 bg-white border-b border-muted-foreground/10 flex items-center px-4 gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex-1">
          <h1 className="font-medium truncate">
            {event.data.names.person1}
            {event.data.names.person2 && ` & ${event.data.names.person2}`}
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-muted-foreground/10 rounded-lg p-1">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <Button variant="outline" size="sm" onClick={handleSave} isLoading={isSaving}>
              <Save size={16} className="mr-1" />
              Сохранить
            </Button>
          )}
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={event.status === 'published' && !isDirty}
          >
            <Send size={16} className="mr-1" />
            {event.status === 'published' ? 'Обновить' : 'Опубликовать'}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 flex-none bg-white border-r border-muted-foreground/10 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-muted-foreground/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activePanel === tab.id
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'data' && <DataPanel />}
            {activePanel === 'blocks' && <BlocksPanel />}
            {activePanel === 'theme' && <ThemePanel />}
            {activePanel === 'guests' && <GuestsPanel />}
            {activePanel === 'ai' && <AIPanel />}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 bg-muted-foreground/5 overflow-hidden">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
