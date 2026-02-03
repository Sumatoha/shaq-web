'use client';

import { useEditorStore } from '@/stores/editor-store';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemePanel() {
  const { event, themes, currentTheme, changeTheme, updateCustomColor } = useEditorStore();

  if (!event || !currentTheme) return null;

  return (
    <div className="space-y-6">
      {/* Theme selection */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Выберите тему</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.slug}
              onClick={() => changeTheme(theme.slug)}
              className={cn(
                'relative rounded-xl overflow-hidden border-2 transition-all',
                event.theme.id === theme.slug
                  ? 'border-accent'
                  : 'border-muted-foreground/20 hover:border-accent/50'
              )}
            >
              <div
                className="aspect-[3/4] p-3"
                style={{ backgroundColor: theme.config.colors.primary }}
              >
                <div
                  className="w-full h-full rounded-lg flex flex-col items-center justify-center p-2"
                  style={{ backgroundColor: theme.config.colors.secondary }}
                >
                  <div
                    className="w-8 h-1 rounded mb-2"
                    style={{ backgroundColor: theme.config.colors.accent }}
                  />
                  <div
                    className="text-[8px] font-serif text-center"
                    style={{
                      color: theme.config.colors.text,
                      fontFamily: theme.config.fonts.heading,
                    }}
                  >
                    A & D
                  </div>
                </div>
              </div>
              <div className="p-2 text-center bg-white">
                <p className="text-xs font-medium truncate">{theme.name}</p>
                <p className="text-[10px] text-muted capitalize">{theme.tier}</p>
              </div>
              {event.theme.id === theme.slug && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center">
                  <Check size={12} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Color customization */}
      <section>
        <h3 className="text-sm font-medium text-muted mb-3">Настройка цветов</h3>
        <div className="space-y-3">
          <ColorPicker
            label="Основной фон"
            value={currentTheme.colors.primary}
            onChange={(value) => updateCustomColor('primary', value)}
          />
          <ColorPicker
            label="Фон блоков"
            value={currentTheme.colors.secondary}
            onChange={(value) => updateCustomColor('secondary', value)}
          />
          <ColorPicker
            label="Акцентный цвет"
            value={currentTheme.colors.accent}
            onChange={(value) => updateCustomColor('accent', value)}
          />
          <ColorPicker
            label="Текст"
            value={currentTheme.colors.text}
            onChange={(value) => updateCustomColor('text', value)}
          />
        </div>
      </section>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-muted-foreground/20"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-muted-foreground/20 rounded"
        />
      </div>
    </div>
  );
}
