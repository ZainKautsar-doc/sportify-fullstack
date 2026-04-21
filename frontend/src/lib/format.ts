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

export function getImagesByFieldType(type: string): string[] {
  const mapping: Record<string, string[]> = {
    futsal: [
      '/img/futsaldetail/futsal1.webp',
      '/img/futsaldetail/futsal2.webp',
      '/img/futsaldetail/futsal3.webp',
      '/img/futsaldetail/futsal4.webp',
    ],
    'mini soccer': [
      '/img/minisoccerdetail/minisoccer1.webp',
      '/img/minisoccerdetail/minisoccer2.webp',
      '/img/minisoccerdetail/minisoccer3.webp',
      '/img/minisoccerdetail/minisoccer4.webp',
    ],
    padel: [
      '/img/padeldetail/padel1.webp',
      '/img/padeldetail/padel2.webp',
      '/img/padeldetail/padel3.webp',
      '/img/padeldetail/padel4.webp',
    ],
    badminton: [
      '/img/badmintondetail/badminton1.webp',
      '/img/badmintondetail/badminton2.webp',
      '/img/badmintondetail/badminton3.webp',
      '/img/badmintondetail/badminton4.webp',
    ],
  };

  const key = type.toLowerCase();
  return mapping[key] ?? mapping.futsal; // Fallback to futsal
}

export function toImageByFieldType(type: string) {
  const images = getImagesByFieldType(type);
  return images[0];
}

