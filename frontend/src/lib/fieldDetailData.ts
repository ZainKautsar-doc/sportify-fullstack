import type { Field } from '@/src/types/domain';
import { toImageByFieldType, getImagesByFieldType } from '@/src/lib/format';

export interface VenueDetailContent {
  name: string;
  type: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  description: string[];
  rules: string[];
  facilities: string[];
  promoText: string;
  images: string[];
  mapQuery: string;
}

interface VenuePreset {
  city: string;
  address: string;
  description: string[];
  rules: string[];
  facilities: string[];
  promoText: string;
  mapQuery: string;
  images: string[];
  ratingBase: number;
  reviewBase: number;
}

const TYPE_PRESETS: Record<string, VenuePreset> = {
  futsal: {
    city: 'Jakarta Selatan',
    address: 'Jl. Raya Fatmawati No. 88, Cilandak, Jakarta Selatan',
    description: [
      'Lapangan futsal ini cocok buat kamu yang cari venue nyaman dengan rumput sintetis premium dan pencahayaan yang stabil di semua sisi lapangan.',
      'Area tribun mini, sirkulasi udara bagus, dan alur masuk-keluar pemain dibuat praktis supaya sesi latihan maupun sparring terasa lebih efisien.',
      'Tim operasional juga standby setiap hari untuk bantu kebutuhan teknis, jadi kamu bisa fokus main tanpa ribet urusan venue.',
    ],
    rules: [
      'Dilarang merokok di area lapangan dan tribun.',
      'Wajib menggunakan sepatu olahraga non-metal.',
      'Dilarang membawa makanan berat ke dalam area permainan.',
    ],
    facilities: ['Parkir', 'Toilet', 'Musholla', 'Ruang Ganti', 'CCTV', 'Cafe'],
    promoText: 'Diskon hingga Rp20.000 untuk booking hari ini sebelum jam 18.00.',
    mapQuery: 'Sportify+Futsal+Arena+Cilandak+Jakarta+Selatan',
    images: [],
    ratingBase: 4.8,
    reviewBase: 214,
  },
  'mini soccer': {
    city: 'Tangerang Selatan',
    address: 'Jl. BSD Green Office Park No. 12, Serpong, Tangerang Selatan',
    description: [
      'Ukuran lapangan mini soccer ideal untuk game intensitas tinggi, dengan permukaan hybrid turf yang nyaman buat passing cepat dan kontrol bola.',
      'Kapasitas pemain cadangan cukup luas, lengkap dengan area tunggu teduh dan sistem penerangan malam yang merata.',
      'Venue ini sering dipakai untuk fun league komunitas sehingga standar kebersihan dan keamanan dijaga ketat setiap pergantian sesi.',
    ],
    rules: [
      'Maksimal keterlambatan 15 menit dari jam booking.',
      'Wajib melakukan pemanasan di area warming-up.',
      'Dilarang membawa botol kaca ke area lapangan.',
    ],
    facilities: ['Parkir', 'Toilet', 'Ruang Ganti', 'CCTV', 'Cafe', 'Tribun'],
    promoText: 'Cashback Rp30.000 untuk booking mini soccer di weekday.',
    mapQuery: 'Sportify+Mini+Soccer+Serpong',
    images: [],
    ratingBase: 4.7,
    reviewBase: 173,
  },
  padel: {
    city: 'Jakarta Barat',
    address: 'Jl. Panjang No. 21, Kebon Jeruk, Jakarta Barat',
    description: [
      'Court padel dengan kaca standar kompetisi dan pencahayaan anti-glare yang bikin permainan tetap nyaman meski malam hari.',
      'Akses masuk court dibuat seamless, area duduk pemain rapih, dan tersedia perlengkapan pendukung untuk sesi latihan pemula hingga intermediate.',
      'Atmosfer venue lebih premium namun tetap santai, cocok untuk main bareng teman atau sesi sparring rutin mingguan.',
    ],
    rules: [
      'Gunakan sepatu khusus court untuk menjaga permukaan lapangan.',
      'Dilarang menempelkan stiker atau properti pada kaca lapangan.',
      'Mohon menjaga volume musik agar tidak mengganggu court lain.',
    ],
    facilities: ['Parkir', 'Toilet', 'Musholla', 'CCTV', 'Cafe', 'Pro Shop'],
    promoText: 'Gratis sewa raket untuk booking padel pertama minggu ini.',
    mapQuery: 'Sportify+Padel+Kebon+Jeruk',
    images: [],
    ratingBase: 4.9,
    reviewBase: 129,
  },
  badminton: {
    city: 'Bandung',
    address: 'Jl. Soekarno-Hatta No. 234, Buahbatu, Bandung',
    description: [
      'Lapangan badminton dengan lantai vinyl anti-slip dan tinggi atap ideal, bikin permainan lebih nyaman untuk rally cepat.',
      'Ventilasi ruangan dirancang agar sirkulasi udara tetap stabil walau peak hour, ditambah pencahayaan putih netral untuk visibilitas shuttlecock.',
      'Area tunggu pemain, ruang ganti, dan layanan minuman ringan memudahkan tim yang ingin latihan beberapa sesi sekaligus.',
    ],
    rules: [
      'Wajib menggunakan sepatu indoor non-marking.',
      'Dilarang membawa makanan ke dalam area court.',
      'Gunakan waktu sesuai slot agar pergantian sesi tetap tepat waktu.',
    ],
    facilities: ['Parkir', 'Toilet', 'Musholla', 'Ruang Ganti', 'CCTV', 'Cafe'],
    promoText: 'Potongan 10% untuk booking badminton minimal 2 jam.',
    mapQuery: 'Sportify+Badminton+Buahbatu+Bandung',
    images: [],
    ratingBase: 4.7,
    reviewBase: 242,
  },
};

const DEFAULT_PRESET: VenuePreset = {
  city: 'Jakarta',
  address: 'Jl. Sportify Center No. 1, Jakarta',
  description: [
    'Lapangan ini cocok untuk kamu yang ingin bermain nyaman dengan fasilitas modern dan jadwal yang fleksibel.',
    'Area venue bersih, akses mudah dijangkau, dan proses check-in dibuat cepat agar pengalaman booking terasa praktis.',
    'Cocok untuk latihan rutin, fun match, maupun sesi komunitas dengan kebutuhan waktu yang konsisten.',
  ],
  rules: [
    'Dilarang merokok di area venue.',
    'Wajib menggunakan perlengkapan olahraga yang sesuai.',
    'Mohon menjaga kebersihan area lapangan.',
  ],
  facilities: ['Parkir', 'Toilet', 'Musholla', 'Ruang Ganti', 'CCTV', 'Cafe'],
  promoText: 'Ada promo spesial untuk booking hari ini.',
  mapQuery: 'Sportify+Arena+Jakarta',
  images: [],
  ratingBase: 4.8,
  reviewBase: 150,
};

export function getVenueDetailContent(field: Field): VenueDetailContent {
  const key = field.type.toLowerCase();
  const preset = TYPE_PRESETS[key] ?? DEFAULT_PRESET;
  const rating = Number(Math.min(5, preset.ratingBase + ((field.id % 3) * 0.1 - 0.1)).toFixed(1));
  const reviewCount = preset.reviewBase + field.id * 7;

  return {
    name: field.name,
    type: field.type,
    city: preset.city,
    address: preset.address,
    rating,
    reviewCount,
    description: preset.description,
    rules: preset.rules,
    facilities: preset.facilities,
    promoText: preset.promoText,
    images: getImagesByFieldType(field.type),
    mapQuery: preset.mapQuery,
  };
}
