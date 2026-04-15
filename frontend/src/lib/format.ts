import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateLabel(value: string) {
  try {
    return format(parseISO(value), 'EEEE, d MMM yyyy', { locale: id });
  } catch {
    return value;
  }
}

export function toImageByFieldType(type: string) {
  const mapping: Record<string, string> = {
    futsal:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    'mini soccer':
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    padel:
      'https://images.unsplash.com/photo-1632644011560-e95e2eaf64b2?auto=format&fit=crop&w=1200&q=80',
    badminton:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
  };

  const key = type.toLowerCase();
  return (
    mapping[key] ??
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80'
  );
}
