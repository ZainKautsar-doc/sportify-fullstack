import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import Button from '@/src/components/ui/Button';

interface ImageGalleryProps {
  name: string;
  images: string[];
}

export default function ImageGallery({ name, images }: ImageGalleryProps) {
  const normalizedImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [name, normalizedImages.length]);

  const activeImage = normalizedImages[activeIndex] ?? normalizedImages[0];
  const thumbnails = normalizedImages.slice(1, 4);

  if (!activeImage) return null;

  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={activeImage} alt={name} className="h-72 w-full object-cover md:h-[27.5rem]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-slate-900/60 to-transparent p-4 text-white">
            <p className="text-sm font-semibold">{name}</p>
            <Button size="sm" variant="secondary" className="h-8 rounded-xl border-white/70 bg-white/90 px-3 text-xs text-slate-700">
              <ImageIcon size={14} />
              Lihat semua foto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {thumbnails.map((image, index) => {
            const actualIndex = index + 1;
            const active = actualIndex === activeIndex;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(actualIndex)}
                className={`overflow-hidden rounded-2xl border transition ${
                  active ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <img src={image} alt={`${name} ${actualIndex + 1}`} className="h-24 w-full object-cover md:h-[8.6rem]" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
