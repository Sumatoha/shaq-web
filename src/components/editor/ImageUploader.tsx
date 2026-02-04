'use client';

import { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react';
import { Upload, X, Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageSettings } from '@/types';

interface ImageUploaderProps {
  label?: string;
  value?: ImageSettings | null;
  onChange: (settings: ImageSettings | null) => void;
  aspectRatio?: 'square' | 'video' | 'hero';
  maxSizeMB?: number;
  className?: string;
}

const DEFAULT_SETTINGS: ImageSettings = {
  url: '',
  brightness: 100,
  overlay: 0,
};

export function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = 'hero',
  maxSizeMB = 5,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const settings = value || DEFAULT_SETTINGS;
  const hasImage = Boolean(settings.url);

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    hero: 'aspect-[16/9]',
  }[aspectRatio];

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`Размер файла не должен превышать ${maxSizeMB} МБ`);
      return;
    }

    setIsLoading(true);

    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file);

      onChange({
        url,
        brightness: 100,
        overlay: 0,
      });
    } catch {
      setError('Ошибка при загрузке изображения');
    } finally {
      setIsLoading(false);
    }
  }, [maxSizeMB, onChange]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  }, [processFile]);

  const handleRemove = useCallback(() => {
    if (settings.url && settings.url.startsWith('blob:')) {
      URL.revokeObjectURL(settings.url);
    }
    onChange(null);
  }, [settings.url, onChange]);

  const handleBrightnessChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const brightness = parseInt(e.target.value, 10);
    onChange({ ...settings, brightness });
  }, [settings, onChange]);

  const handleOverlayChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const overlay = parseInt(e.target.value, 10);
    onChange({ ...settings, overlay });
  }, [settings, onChange]);

  const imageStyle = {
    filter: `brightness(${settings.brightness / 100})`,
  };

  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${settings.overlay / 100})`,
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Upload area / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !hasImage && fileInputRef.current?.click()}
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-200',
          aspectRatioClass,
          !hasImage && 'border-2 border-dashed cursor-pointer',
          !hasImage && isDragging && 'border-accent bg-accent/5',
          !hasImage && !isDragging && 'border-muted-foreground/30 hover:border-accent/50 hover:bg-accent/5',
          isLoading && 'opacity-50 pointer-events-none'
        )}
      >
        {hasImage ? (
          <>
            {/* Image with brightness */}
            <img
              src={settings.url}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
              style={imageStyle}
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-200"
              style={overlayStyle}
            />
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
            {isLoading ? (
              <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={32} className="mb-2" />
                <p className="text-sm font-medium">
                  {isDragging ? 'Отпустите для загрузки' : 'Перетащите или нажмите'}
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  PNG, JPG до {maxSizeMB} МБ
                </p>
              </>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Controls (only when image is loaded) */}
      {hasImage && (
        <div className="mt-4 space-y-4">
          {/* Brightness slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sun size={16} className="text-muted" />
                Яркость
              </label>
              <span className="text-sm text-muted">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={settings.brightness}
              onChange={handleBrightnessChange}
              className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Overlay slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Moon size={16} className="text-muted" />
                Затемнение
              </label>
              <span className="text-sm text-muted">{settings.overlay}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              value={settings.overlay}
              onChange={handleOverlayChange}
              className="w-full h-2 bg-muted-foreground/20 rounded-full appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Gallery uploader for multiple images
interface GalleryUploaderProps {
  label?: string;
  value?: ImageSettings[];
  onChange: (images: ImageSettings[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  className?: string;
}

export function GalleryUploader({
  label,
  value = [],
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
  className,
}: GalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = value.length < maxImages;

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files: FileList) => {
    setError(null);
    setIsLoading(true);

    const newImages: ImageSettings[] = [];
    const availableSlots = maxImages - value.length;

    for (let i = 0; i < Math.min(files.length, availableSlots); i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) continue;

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) continue;

      const url = URL.createObjectURL(file);
      newImages.push({ url, brightness: 100, overlay: 0 });
    }

    if (newImages.length > 0) {
      onChange([...value, ...newImages]);
    }

    if (files.length > availableSlots) {
      setError(`Можно добавить максимум ${maxImages} фото`);
    }

    setIsLoading(false);
  }, [maxImages, maxSizeMB, value, onChange]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  }, [processFiles]);

  const handleRemove = useCallback((index: number) => {
    const image = value[index];
    if (image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
    onChange(value.filter((_, i) => i !== index));
  }, [value, onChange]);

  const handleUpdateImage = useCallback((index: number, settings: Partial<ImageSettings>) => {
    const newImages = [...value];
    newImages[index] = { ...newImages[index], ...settings };
    onChange(newImages);
  }, [value, onChange]);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-3">
        {value.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={image.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: `brightness(${image.brightness / 100})` }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: `rgba(0, 0, 0, ${image.overlay / 100})` }}
            />
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Add more button */}
        {canAddMore && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all',
              isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/30 hover:border-accent/50'
            )}
          >
            {isLoading ? (
              <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent rounded-full" />
            ) : (
              <>
                <ImageIcon size={24} className="text-muted mb-1" />
                <span className="text-xs text-muted">Добавить</span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="mt-2 text-xs text-muted">
        {value.length} / {maxImages} фото
      </p>
    </div>
  );
}
