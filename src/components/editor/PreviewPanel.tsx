'use client';

import { useEditorStore } from '@/stores/editor-store';
import { useThemeStyles } from '@/hooks/use-theme-styles';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export function PreviewPanel() {
  const { event, currentTheme, previewMode, enabledBlocks } = useEditorStore();
  const { styles, fontLinks } = useThemeStyles(currentTheme);

  if (!event || !currentTheme) {
    return (
      <div className="h-full flex items-center justify-center text-muted">
        Загрузка превью...
      </div>
    );
  }

  const blocks = enabledBlocks();

  return (
    <div className="h-full flex items-center justify-center p-4 overflow-auto">
      {/* Font imports */}
      {fontLinks.map((link) => (
        <link key={link} rel="stylesheet" href={link} />
      ))}

      {/* Preview frame */}
      <div
        className={`transition-all duration-300 ${
          previewMode === 'mobile'
            ? 'w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-800 shadow-2xl'
            : 'w-full max-w-4xl h-full rounded-lg border border-muted-foreground/20 shadow-lg'
        }`}
      >
        <div
          className={`w-full h-full overflow-y-auto ${
            previewMode === 'mobile' ? 'rounded-[2.5rem]' : 'rounded-lg'
          }`}
          style={{
            ...styles,
            backgroundColor: currentTheme.colors.primary,
            fontFamily: currentTheme.fonts.body,
          }}
        >
          {blocks.map((block, index) => (
            <BlockRenderer
              key={`${block.type}-${index}`}
              block={block}
              data={event.data}
              theme={currentTheme}
              isPreview
            />
          ))}

          {blocks.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted p-8">
              <p className="text-center">
                Включите блоки в панели слева,<br />
                чтобы увидеть превью
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
