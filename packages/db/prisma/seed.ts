// =============================================================================
// WanderViet Travel Platform — Prisma seed script
// Implements: Requirement 26 (Seed Data), Design §14
//
// This script is idempotent: all writes use `upsert` keyed on the model's
// unique field (email / slug / code / bookingCode / etc.) so re-running it
// won't create duplicates and won't throw on conflicts.
//
// Demo data seeded:
//   • 3 demo users (admin/user/staff) with bcrypt-hashed passwords
//   • 5 countries + 12 cities
//   • 12 destinations with rich content
//   • 8 tours with itineraries + departures on 6 of them
//   • 3 sample coupons (percent / fixed / expired)
//   • 7 mixed-status bookings (2 PENDING, 3 CONFIRMED, 2 COMPLETED) + payments
//   • 10 reviews (mix APPROVED / PENDING) on tours
//   • 8 blog posts (6 PUBLISHED + 2 DRAFT)
//   • 5 contact requests (mix NEW / IN_PROGRESS / RESOLVED)
//
// Note: the `prisma-client` (Prisma 7) generator emits the client to
// `../generated/client`. We import PrismaClient from that path; the
// `@prisma/client` npm package provides the runtime (@prisma/client/runtime).
// =============================================================================

import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../generated/client/client';

const SALT_ROUNDS = 12;

function createPrisma(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ?? 'postgresql://vietwander:vietwander@localhost:5432/vietwander';
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrisma();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Real Unsplash photo URLs per destination slug
// All photos are free under the Unsplash License (https://unsplash.com/license)
// ---------------------------------------------------------------------------
const DESTINATION_IMAGES: Record<string, string> = {
  // Vietnam
  'ha-long-bay':
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
  'da-nang':
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=80',
  'hoi-an':
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1400&q=80',
  sapa: 'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?auto=format&fit=crop&w=1400&q=80',
  'ninh-binh':
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1400&q=80',
  'phu-quoc':
    'https://images.unsplash.com/photo-1540202404-a2f29564651f?auto=format&fit=crop&w=1400&q=80',
  'da-lat':
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80',
  'ha-giang':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
  'ha-noi':
    'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1400&q=80',
  'ho-chi-minh':
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
  hue: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1400&q=80',
  'nha-trang':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  'phong-nha':
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=80',
  'mui-ne':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
  'can-tho':
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
  // International
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
  tokyo:
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80',
  kyoto:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
  osaka:
    'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1400&q=80',
  paris:
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
  bangkok:
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=80',
  'chiang-mai':
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80',
  phuket:
    'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1400&q=80',
  singapore:
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80',
  seoul:
    'https://images.unsplash.com/photo-1538485399081-7c8edcb4a11e?auto=format&fit=crop&w=1400&q=80',
  rome: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1400&q=80',
  barcelona:
    'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=80',
  sydney:
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
  dubai:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80',
  santorini:
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=80',
  'swiss-alps':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
  'kuala-lumpur':
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1400&q=80',
  'angkor-wat':
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=80',
};

const TOUR_IMAGES: Record<string, string[]> = {
  'northern-vietnam-adventure': [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?auto=format&fit=crop&w=1400&q=80',
  ],
  'central-vietnam-heritage-tour': [
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=80',
  ],
  'phu-quoc-beach-escape': [
    'https://images.unsplash.com/photo-1540202404-a2f29564651f?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  ],
  'ha-giang-motorbike-adventure': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1400&q=80',
  ],
  'bali-luxury-retreat': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
  ],
  'japan-spring-discovery': [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80',
  ],
  'thailand-city-island-tour': [
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80',
  ],
  'europe-romantic-journey': [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1400&q=80',
  ],
  'nha-trang-diving-adventure': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80',
  ],
  'hue-imperial-heritage': [
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1400&q=80',
  ],
  'mekong-delta-discovery': [
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
  ],
  'seoul-k-culture-tour': [
    'https://images.unsplash.com/photo-1538485399081-7c8edcb4a11e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80',
  ],
  'singapore-city-explorer': [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80',
  ],
  'london-classic-tour': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
  ],
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80';

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

function bookingCode(dateStr: string, suffix: string): string {
  return `WV-${dateStr}-${suffix}`;
}

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------

const COUNTRIES = [
  { key: 'VN', name: 'Việt Nam' },
  { key: 'ID', name: 'Indonesia' },
  { key: 'JP', name: 'Nhật Bản' },
  { key: 'FR', name: 'Pháp' },
  { key: 'TH', name: 'Thái Lan' },
  { key: 'SG', name: 'Singapore' },
  { key: 'KR', name: 'Hàn Quốc' },
  { key: 'IT', name: 'Ý' },
  { key: 'ES', name: 'Tây Ban Nha' },
  { key: 'AU', name: 'Úc' },
  { key: 'AE', name: 'UAE' },
  { key: 'GR', name: 'Hy Lạp' },
  { key: 'CH', name: 'Thụy Sĩ' },
  { key: 'MY', name: 'Malaysia' },
  { key: 'KH', name: 'Campuchia' },
  { key: 'GB', name: 'Anh' },
] as const;
type CountryKey = (typeof COUNTRIES)[number]['key'];

const CITIES: Array<{ name: string; countryKey: CountryKey }> = [
  // Vietnam
  { name: 'Quảng Ninh', countryKey: 'VN' },
  { name: 'Đà Nẵng', countryKey: 'VN' },
  { name: 'Quảng Nam', countryKey: 'VN' },
  { name: 'Lào Cai', countryKey: 'VN' },
  { name: 'Ninh Bình', countryKey: 'VN' },
  { name: 'Kiên Giang', countryKey: 'VN' },
  { name: 'Lâm Đồng', countryKey: 'VN' },
  { name: 'Hà Giang', countryKey: 'VN' },
  { name: 'Hà Nội', countryKey: 'VN' },
  { name: 'TP. Hồ Chí Minh', countryKey: 'VN' },
  { name: 'Thừa Thiên Huế', countryKey: 'VN' },
  { name: 'Khánh Hòa', countryKey: 'VN' },
  { name: 'Quảng Bình', countryKey: 'VN' },
  { name: 'Bình Thuận', countryKey: 'VN' },
  { name: 'Cần Thơ', countryKey: 'VN' },
  // International
  { name: 'Bali', countryKey: 'ID' },
  { name: 'Tokyo', countryKey: 'JP' },
  { name: 'Kyoto', countryKey: 'JP' },
  { name: 'Osaka', countryKey: 'JP' },
  { name: 'Paris', countryKey: 'FR' },
  { name: 'Bangkok', countryKey: 'TH' },
  { name: 'Chiang Mai', countryKey: 'TH' },
  { name: 'Phuket', countryKey: 'TH' },
  { name: 'Singapore', countryKey: 'SG' },
  { name: 'Seoul', countryKey: 'KR' },
  { name: 'Rome', countryKey: 'IT' },
  { name: 'Barcelona', countryKey: 'ES' },
  { name: 'Sydney', countryKey: 'AU' },
  { name: 'Dubai', countryKey: 'AE' },
  { name: 'Santorini', countryKey: 'GR' },
  { name: 'Zurich', countryKey: 'CH' },
  { name: 'Kuala Lumpur', countryKey: 'MY' },
  { name: 'Siem Reap', countryKey: 'KH' },
  { name: 'London', countryKey: 'GB' },
];

// ---------------------------------------------------------------------------
// Destinations (12)
// Content reuses the WanderViet `@vietwander/shared` seed where possible and
// adds Bali / Paris which aren't in the core VN set.
// ---------------------------------------------------------------------------

interface DestinationSeed {
  slug: string;
  name: string;
  countryKey: CountryKey;
  cityName: string;
  description: string;
  longDescription: string;
  shortDescription: string;
  bestTimeToVisit: string;
  budgetMin: number;
  budgetMax: number;
  latitude: number;
  longitude: number;
  safetyLevel: string;
  travelStyles: string[];
  cultureNotes: string[];
  foodHighlights: string[];
  category: string;
  isFeatured: boolean;
  ratingAvg: number;
  reviewCount: number;
}

const DESTINATIONS: DestinationSeed[] = [
  {
    slug: 'ha-long-bay',
    name: 'Hạ Long Bay',
    countryKey: 'VN',
    cityName: 'Quảng Ninh',
    shortDescription: 'Kỳ quan thiên nhiên với hàng nghìn đảo đá vôi trên mặt nước ngọc bích.',
    description:
      'Hạ Long Bay (Vịnh Hạ Long) là di sản thế giới UNESCO nổi tiếng với hơn 1.600 đảo đá vôi và hang động huyền ảo, phù hợp cho cruise 2N1Đ hoặc 3N2Đ.',
    longDescription:
      'Với mặt nước xanh ngọc, hàng nghìn đảo đá vôi và các hang động kỳ vĩ, Hạ Long Bay mang đến trải nghiệm cruise du thuyền, kayak, lặn ngắm san hô và làng chài cổ. Thời điểm đẹp nhất là từ tháng 10 đến tháng 4 khi trời khô ráo, biển lặng.',
    bestTimeToVisit: 'Tháng 10 – tháng 4',
    budgetMin: 1500000,
    budgetMax: 6500000,
    latitude: 20.9101,
    longitude: 107.1839,
    safetyLevel: 'high',
    travelStyles: ['beach', 'luxury', 'culture'],
    cultureNotes: [
      'Tôn trọng nghi thức lên du thuyền — giữ trật tự khi tàu khởi hành.',
      'Không xả rác xuống biển, bảo vệ hệ sinh thái vịnh.',
    ],
    foodHighlights: ['Chả mực Hạ Long', 'Hàu nướng mỡ hành', 'Sá sùng'],
    category: 'beach',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 520,
  },
  {
    slug: 'da-nang',
    name: 'Đà Nẵng',
    countryKey: 'VN',
    cityName: 'Đà Nẵng',
    shortDescription: 'Thành phố biển sôi động với Cầu Vàng, Ngũ Hành Sơn và bãi biển Mỹ Khê.',
    description:
      'Đà Nẵng kết hợp hoàn hảo giữa biển xanh, núi Sơn Trà và kiến trúc đương đại như Cầu Rồng, Cầu Vàng Bà Nà Hills.',
    longDescription:
      'Đà Nẵng là cửa ngõ du lịch miền Trung với bãi biển Mỹ Khê dài 20 km, Ngũ Hành Sơn huyền bí, Bà Nà Hills lãng mạn và ẩm thực đường phố phong phú. Thời điểm lý tưởng là tháng 2 đến tháng 8.',
    bestTimeToVisit: 'Tháng 2 – tháng 8',
    budgetMin: 800000,
    budgetMax: 3000000,
    latitude: 16.0544,
    longitude: 108.2022,
    safetyLevel: 'high',
    travelStyles: ['beach', 'food', 'family'],
    cultureNotes: [
      'Cầu Rồng phun lửa tối thứ 7, chủ nhật — đến sớm để có chỗ đẹp.',
      'Tại Ngũ Hành Sơn nên mặc trang phục kín đáo khi vào chùa.',
    ],
    foodHighlights: ['Mì Quảng', 'Bánh tráng cuốn thịt heo', 'Bún chả cá'],
    category: 'beach',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 430,
  },
  {
    slug: 'hoi-an',
    name: 'Hội An',
    countryKey: 'VN',
    cityName: 'Quảng Nam',
    shortDescription: 'Phố cổ đèn lồng với kiến trúc giao thoa Việt – Hoa – Nhật – Pháp.',
    description:
      'Hội An là di sản UNESCO nổi tiếng với phố cổ đèn lồng, sông Hoài lung linh và may đo áo dài truyền thống.',
    longDescription:
      'Dạo phố cổ Hội An về đêm khi hàng nghìn đèn lồng lung linh, thả đèn hoa đăng trên sông Hoài, thử may áo dài và thưởng thức cao lầu, mì Quảng. Tháng 2 – tháng 4 là mùa đẹp nhất với khí hậu khô ráo.',
    bestTimeToVisit: 'Tháng 2 – tháng 4',
    budgetMin: 750000,
    budgetMax: 2800000,
    latitude: 15.8801,
    longitude: 108.338,
    safetyLevel: 'high',
    travelStyles: ['culture', 'food', 'couple'],
    cultureNotes: [
      'Mua vé tham quan phố cổ để vào các di tích chính.',
      'Không chụp ảnh trong nhà cổ khi chủ chưa cho phép.',
    ],
    foodHighlights: ['Cao lầu', 'Bánh mì Phượng', 'Hoành thánh chiên'],
    category: 'culture',
    isFeatured: true,
    ratingAvg: 4.9,
    reviewCount: 612,
  },
  {
    slug: 'sapa',
    name: 'Sapa',
    countryKey: 'VN',
    cityName: 'Lào Cai',
    shortDescription: 'Ruộng bậc thang mây phủ, trekking bản làng và đỉnh Fansipan.',
    description:
      'Sapa mang vẻ đẹp hùng vĩ của núi rừng Tây Bắc với ruộng bậc thang mùa lúa chín, bản làng dân tộc và đỉnh Fansipan — nóc nhà Đông Dương.',
    longDescription:
      'Trekking qua các bản Cát Cát, Tả Van, Tả Phìn để khám phá văn hoá Mông, Dao. Mùa lúa chín tháng 9 – tháng 10 là thời điểm ruộng bậc thang đẹp nhất. Mùa tuyết (tháng 12 – tháng 2) hấp dẫn với cảnh băng tuyết hiếm có tại Việt Nam.',
    bestTimeToVisit: 'Tháng 9 – tháng 11',
    budgetMin: 700000,
    budgetMax: 2600000,
    latitude: 22.3364,
    longitude: 103.8438,
    safetyLevel: 'high',
    travelStyles: ['mountain', 'culture', 'adventure'],
    cultureNotes: [
      'Hỏi trước khi chụp ảnh người dân tộc bản địa.',
      'Chuẩn bị áo ấm đủ — Sapa có thể xuống dưới 5°C vào mùa đông.',
    ],
    foodHighlights: ['Thắng cố', 'Cá hồi Sapa', 'Rau cải mèo'],
    category: 'mountain',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 398,
  },
  {
    slug: 'ninh-binh',
    name: 'Ninh Bình',
    countryKey: 'VN',
    cityName: 'Ninh Bình',
    shortDescription: '"Hạ Long trên cạn" với Tràng An, Tam Cốc và Hang Múa.',
    description:
      'Ninh Bình là điểm đến của dãy núi đá vôi hùng vĩ, sông Ngô Đồng uốn lượn và quần thể di tích Tràng An — di sản thế giới hỗn hợp.',
    longDescription:
      'Chèo thuyền qua Tam Cốc, Tràng An, leo 500 bậc lên Hang Múa ngắm toàn cảnh sông núi, ghé cố đô Hoa Lư và chùa Bái Đính — ngôi chùa lớn nhất Đông Nam Á. Tháng 2 – tháng 5 là mùa đẹp với tiết trời khô mát.',
    bestTimeToVisit: 'Tháng 2 – tháng 5',
    budgetMin: 550000,
    budgetMax: 1800000,
    latitude: 20.2506,
    longitude: 105.9745,
    safetyLevel: 'high',
    travelStyles: ['nature', 'culture', 'family'],
    cultureNotes: [
      'Mặc trang phục kín đáo khi vào đền chùa.',
      'Cho thuê xe máy có sẵn tại trung tâm Tam Cốc.',
    ],
    foodHighlights: ['Cơm cháy Ninh Bình', 'Dê núi tái chanh', 'Gỏi cá nhệch'],
    category: 'nature',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 340,
  },
  {
    slug: 'phu-quoc',
    name: 'Phú Quốc',
    countryKey: 'VN',
    cityName: 'Kiên Giang',
    shortDescription: 'Đảo ngọc với bãi Sao, bãi Kem cát trắng và hoàng hôn Dinh Cậu.',
    description:
      'Phú Quốc là hòn đảo lớn nhất Việt Nam với bãi biển cát trắng, làng chài Hàm Ninh và cáp treo dài nhất thế giới đến Hòn Thơm.',
    longDescription:
      'Thả mình trên bãi Sao, bãi Kem cát trắng mịn, lặn biển ngắm san hô tại Hòn Mây Rút, đi cáp treo 7,9 km sang Hòn Thơm, tham quan nhà thùng nước mắm, chợ đêm Dinh Cậu. Mùa khô (tháng 11 – tháng 4) là thời điểm lý tưởng.',
    bestTimeToVisit: 'Tháng 11 – tháng 4',
    budgetMin: 1100000,
    budgetMax: 4200000,
    latitude: 10.2899,
    longitude: 103.984,
    safetyLevel: 'high',
    travelStyles: ['beach', 'luxury', 'family'],
    cultureNotes: [
      'Mua nước mắm Phú Quốc chính gốc tại các nhà thùng địa phương.',
      'Không chạm vào san hô khi lặn — hệ sinh thái dễ tổn thương.',
    ],
    foodHighlights: ['Gỏi cá trích', 'Nhum biển nướng', 'Tiêu Phú Quốc'],
    category: 'beach',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 485,
  },
  {
    slug: 'da-lat',
    name: 'Đà Lạt',
    countryKey: 'VN',
    cityName: 'Lâm Đồng',
    shortDescription: 'Thành phố ngàn hoa se lạnh quanh năm với rừng thông và hồ Xuân Hương.',
    description:
      'Đà Lạt mang khí hậu ôn đới, nổi tiếng với rừng thông, thác nước và các trang trại dâu, cà phê. Lý tưởng cho cặp đôi và gia đình.',
    longDescription:
      'Dạo hồ Xuân Hương, check-in Quảng Trường Lâm Viên, thăm Thiền Viện Trúc Lâm, thác Datanla, ga Đà Lạt cổ kính và thưởng thức cà phê tại cà phê trên mây. Tháng 11 – tháng 3 có tiết trời khô, hoa dã quỳ nở vàng.',
    bestTimeToVisit: 'Tháng 11 – tháng 3',
    budgetMin: 650000,
    budgetMax: 2400000,
    latitude: 11.9404,
    longitude: 108.4583,
    safetyLevel: 'high',
    travelStyles: ['mountain', 'couple', 'culture'],
    cultureNotes: [
      'Mang áo khoác — nhiệt độ đêm có thể xuống dưới 10°C.',
      'Nhiều quán cà phê view đẹp cần đặt chỗ trước qua mạng xã hội.',
    ],
    foodHighlights: ['Lẩu gà lá é', 'Bánh căn', 'Sữa đậu nành nóng'],
    category: 'mountain',
    isFeatured: false,
    ratingAvg: 4.6,
    reviewCount: 412,
  },
  {
    slug: 'ha-giang',
    name: 'Hà Giang',
    countryKey: 'VN',
    cityName: 'Hà Giang',
    shortDescription: 'Cao nguyên đá Đồng Văn, đèo Mã Pí Lèng và mùa tam giác mạch.',
    description:
      'Hà Giang là điểm đến của những cung đường đèo hiểm trở, bản làng dân tộc và cao nguyên đá UNESCO.',
    longDescription:
      'Phượt Hà Giang là hành trình 3 – 4 ngày qua cao nguyên đá Đồng Văn, cột cờ Lũng Cú, đèo Mã Pí Lèng hùng vĩ và dinh vua Mèo. Mùa hoa tam giác mạch tháng 10 – tháng 11 cùng mùa lúa chín tháng 9 là cao điểm đẹp nhất.',
    bestTimeToVisit: 'Tháng 9 – tháng 11',
    budgetMin: 700000,
    budgetMax: 2500000,
    latitude: 23.0035,
    longitude: 105.0146,
    safetyLevel: 'medium',
    travelStyles: ['adventure', 'culture', 'mountain'],
    cultureNotes: [
      'Thuê xe máy phải có bằng lái A1 và mũ bảo hiểm chất lượng.',
      'Mang tiền mặt — nhiều bản chưa có ATM.',
    ],
    foodHighlights: ['Cháo ấu tẩu', 'Thắng dền', 'Bánh tam giác mạch'],
    category: 'adventure',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 287,
  },
  {
    slug: 'bali',
    name: 'Bali',
    countryKey: 'ID',
    cityName: 'Bali',
    shortDescription: 'Hòn đảo thiên đường với đền Hindu, ruộng bậc thang và bãi biển surfing.',
    description:
      'Bali là điểm nghỉ dưỡng nổi tiếng của Indonesia với văn hoá Hindu, ruộng bậc thang Tegalalang, đền Tanah Lot và sóng biển Uluwatu.',
    longDescription:
      'Bali mang đến trải nghiệm trọn vẹn: tắm biển tại Kuta, Seminyak, thiền yoga tại Ubud, check-in đền Pura Ulun Danu Bratan, ngắm hoàng hôn Tanah Lot và thưởng thức nasi goreng. Tháng 4 – tháng 10 là mùa khô đẹp nhất.',
    bestTimeToVisit: 'Tháng 4 – tháng 10',
    budgetMin: 3500000,
    budgetMax: 12000000,
    latitude: -8.3405,
    longitude: 115.092,
    safetyLevel: 'high',
    travelStyles: ['beach', 'luxury', 'wellness'],
    cultureNotes: [
      'Mặc sarong khi vào đền Hindu.',
      'Tránh đi vào ngày Nyepi — ngày yên lặng toàn đảo.',
    ],
    foodHighlights: ['Nasi goreng', 'Babi guling', 'Satay lilit'],
    category: 'beach',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 724,
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    countryKey: 'JP',
    cityName: 'Tokyo',
    shortDescription: 'Siêu đô thị giao thoa truyền thống và công nghệ cao.',
    description:
      'Tokyo là thành phố lớn nhất Nhật Bản, nơi bạn có thể trải nghiệm cả Shibuya hiện đại lẫn đền Senso-ji cổ kính.',
    longDescription:
      'Thăm Shibuya Crossing, tháp Skytree, Akihabara anime, Harajuku thời trang, đền Meiji, cung điện Hoàng gia và thưởng thức sushi tại chợ Toyosu. Mùa hoa anh đào tháng 3 – tháng 4 là thời điểm đáng mơ ước.',
    bestTimeToVisit: 'Tháng 3 – tháng 5',
    budgetMin: 4500000,
    budgetMax: 15000000,
    latitude: 35.6762,
    longitude: 139.6503,
    safetyLevel: 'high',
    travelStyles: ['city', 'culture', 'food'],
    cultureNotes: [
      'Không ăn uống khi đi bộ trên đường.',
      'Xếp hàng trật tự khi lên tàu, không nói điện thoại to.',
    ],
    foodHighlights: ['Sushi Toyosu', 'Ramen', 'Wagyu'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.9,
    reviewCount: 895,
  },
  {
    slug: 'paris',
    name: 'Paris',
    countryKey: 'FR',
    cityName: 'Paris',
    shortDescription: 'Kinh đô ánh sáng với tháp Eiffel, Louvre và sông Seine lãng mạn.',
    description:
      'Paris là biểu tượng lãng mạn với tháp Eiffel, bảo tàng Louvre, nhà thờ Đức Bà và đại lộ Champs-Élysées.',
    longDescription:
      'Ngắm hoàng hôn trên sông Seine, thăm Louvre với Mona Lisa, khám phá Montmartre, leo tháp Eiffel về đêm, thưởng thức croissant tại các tiệm bánh Rue Cler. Tháng 4 – tháng 6 và tháng 9 – tháng 10 là mùa đẹp nhất.',
    bestTimeToVisit: 'Tháng 4 – tháng 6 và Tháng 9 – tháng 10',
    budgetMin: 5000000,
    budgetMax: 18000000,
    latitude: 48.8566,
    longitude: 2.3522,
    safetyLevel: 'medium',
    travelStyles: ['city', 'couple', 'culture'],
    cultureNotes: [
      'Nhớ nói "Bonjour" khi vào cửa hàng.',
      'Cảnh giác móc túi tại khu vực du lịch đông người.',
    ],
    foodHighlights: ['Croissant', 'Macaron Ladurée', 'Steak frites'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 1024,
  },
  {
    slug: 'bangkok',
    name: 'Bangkok',
    countryKey: 'TH',
    cityName: 'Bangkok',
    shortDescription: 'Thủ đô Thái Lan với chùa vàng, chợ đêm và ẩm thực đường phố.',
    description:
      'Bangkok là trung tâm văn hoá Thái Lan với Wat Arun, Cung điện Hoàng gia và các chợ nổi sôi động.',
    longDescription:
      'Tham quan Cung điện Hoàng gia, Wat Pho với tượng Phật nằm, thưởng thức tom yum tại Khao San, đi chợ nổi Damnoen Saduak và massage Thái truyền thống. Tháng 11 – tháng 2 là mùa khô mát.',
    bestTimeToVisit: 'Tháng 11 – tháng 2',
    budgetMin: 1200000,
    budgetMax: 3800000,
    latitude: 13.7563,
    longitude: 100.5018,
    safetyLevel: 'medium',
    travelStyles: ['city', 'food', 'culture'],
    cultureNotes: [
      'Mặc kín vai và đầu gối khi vào chùa.',
      'Không chạm đầu người khác — văn hoá cấm kỵ.',
    ],
    foodHighlights: ['Pad Thai', 'Tom Yum Goong', 'Mango Sticky Rice'],
    category: 'city',
    isFeatured: false,
    ratingAvg: 4.6,
    reviewCount: 678,
  },
  {
    slug: 'nha-trang',
    name: 'Nha Trang',
    countryKey: 'VN',
    cityName: 'Khánh Hòa',
    shortDescription: 'Thành phố biển với Vinpearl Land và lặn biển.',
    description:
      'Nha Trang là thành phố biển nổi tiếng với bãi biển dài, Vinpearl Land và các hoạt động lặn biển ngắm san hô.',
    longDescription:
      'Nha Trang sở hữu bãi biển cát trắng dài 7 km, hệ thống đảo nhỏ với san hô đa dạng, Vinpearl Land giải trí và tháp Bà Ponagar cổ kính. Thời điểm đẹp nhất là tháng 1 đến tháng 8 khi biển lặng, nắng đẹp.',
    bestTimeToVisit: 'Tháng 1 – tháng 8',
    budgetMin: 900000,
    budgetMax: 3500000,
    latitude: 12.2388,
    longitude: 109.1967,
    safetyLevel: 'high',
    travelStyles: ['beach', 'family', 'adventure'],
    cultureNotes: [
      'Tháp Bà Ponagar là di tích Chăm — mặc trang phục kín đáo khi vào.',
      'Không chạm vào san hô khi lặn biển.',
    ],
    foodHighlights: ['Bún chả cá Nha Trang', 'Bánh căn', 'Nem nướng Ninh Hòa'],
    category: 'beach',
    isFeatured: true,
    ratingAvg: 4.6,
    reviewCount: 380,
  },
  {
    slug: 'hue',
    name: 'Huế',
    countryKey: 'VN',
    cityName: 'Thừa Thiên Huế',
    shortDescription: 'Cố đô với Đại Nội, lăng tẩm và ẩm thực cung đình.',
    description:
      'Huế là cố đô triều Nguyễn với Đại Nội, hệ thống lăng tẩm và nền ẩm thực cung đình tinh tế.',
    longDescription:
      'Huế mang vẻ đẹp trầm mặc với Đại Nội, lăng Tự Đức, lăng Khải Định, chùa Thiên Mụ bên sông Hương và ẩm thực cung đình nổi tiếng. Tháng 2 – tháng 4 là thời điểm đẹp nhất với khí hậu khô ráo.',
    bestTimeToVisit: 'Tháng 2 – tháng 4',
    budgetMin: 600000,
    budgetMax: 2200000,
    latitude: 16.4637,
    longitude: 107.5909,
    safetyLevel: 'high',
    travelStyles: ['culture', 'food', 'couple'],
    cultureNotes: [
      'Mặc trang phục kín đáo khi vào Đại Nội và các lăng tẩm.',
      'Thưởng thức ca Huế trên sông Hương vào buổi tối.',
    ],
    foodHighlights: ['Bún bò Huế', 'Bánh bèo', 'Cơm hến'],
    category: 'culture',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 356,
  },
  {
    slug: 'ha-noi',
    name: 'Hà Nội',
    countryKey: 'VN',
    cityName: 'Hà Nội',
    shortDescription: 'Thủ đô ngàn năm văn hiến với phố cổ và hồ Gươm.',
    description:
      'Hà Nội là thủ đô ngàn năm văn hiến với phố cổ 36 phố phường, hồ Gươm và nền ẩm thực đường phố phong phú.',
    longDescription:
      'Hà Nội mang vẻ đẹp cổ kính với phố cổ 36 phố phường, hồ Hoàn Kiếm, Văn Miếu Quốc Tử Giám, lăng Bác và ẩm thực đường phố nổi tiếng thế giới. Mùa thu tháng 9 – tháng 11 là thời điểm đẹp nhất.',
    bestTimeToVisit: 'Tháng 9 – tháng 11',
    budgetMin: 700000,
    budgetMax: 2800000,
    latitude: 21.0285,
    longitude: 105.8542,
    safetyLevel: 'high',
    travelStyles: ['city', 'culture', 'food'],
    cultureNotes: [
      'Phố cổ đông đúc — cẩn thận khi qua đường.',
      'Thử cà phê trứng và phở sáng tại các quán lâu đời.',
    ],
    foodHighlights: ['Phở Hà Nội', 'Bún chả', 'Cà phê trứng'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 890,
  },
  {
    slug: 'can-tho',
    name: 'Cần Thơ',
    countryKey: 'VN',
    cityName: 'Cần Thơ',
    shortDescription: 'Thủ phủ miền Tây với chợ nổi Cái Răng.',
    description:
      'Cần Thơ là thủ phủ miền Tây Nam Bộ với chợ nổi Cái Răng, vườn trái cây và sông nước hữu tình.',
    longDescription:
      'Cần Thơ mang đậm nét văn hóa sông nước miền Tây với chợ nổi Cái Răng nhộn nhịp từ sáng sớm, vườn trái cây bốn mùa, bến Ninh Kiều và ẩm thực đồng quê. Tháng 11 – tháng 4 là mùa khô đẹp nhất.',
    bestTimeToVisit: 'Tháng 11 – tháng 4',
    budgetMin: 500000,
    budgetMax: 1800000,
    latitude: 10.0452,
    longitude: 105.7469,
    safetyLevel: 'high',
    travelStyles: ['culture', 'food', 'family'],
    cultureNotes: [
      'Đi chợ nổi Cái Răng cần dậy sớm 5h sáng.',
      'Mang tiền mặt — nhiều nơi chưa có thanh toán điện tử.',
    ],
    foodHighlights: ['Bánh xèo miền Tây', 'Lẩu mắm', 'Hủ tiếu Nam Vang'],
    category: 'culture',
    isFeatured: false,
    ratingAvg: 4.5,
    reviewCount: 245,
  },
  {
    slug: 'seoul',
    name: 'Seoul',
    countryKey: 'KR',
    cityName: 'Seoul',
    shortDescription: 'Thủ đô K-culture với Gyeongbokgung và Myeongdong.',
    description:
      'Seoul là thủ đô Hàn Quốc, trung tâm K-culture với cung điện Gyeongbokgung, phố mua sắm Myeongdong và ẩm thực đa dạng.',
    longDescription:
      'Seoul kết hợp hoàn hảo giữa truyền thống và hiện đại: cung điện Gyeongbokgung, làng Bukchon Hanok, tháp Namsan, phố Myeongdong sôi động và Gangnam thời thượng. Mùa xuân tháng 3 – tháng 5 và mùa thu tháng 9 – tháng 11 là đẹp nhất.',
    bestTimeToVisit: 'Tháng 3 – tháng 5 và Tháng 9 – tháng 11',
    budgetMin: 3500000,
    budgetMax: 12000000,
    latitude: 37.5665,
    longitude: 126.978,
    safetyLevel: 'high',
    travelStyles: ['city', 'culture', 'food'],
    cultureNotes: [
      'Cúi đầu chào khi gặp người lớn tuổi.',
      'Không tip tại nhà hàng — văn hóa Hàn Quốc không có tip.',
    ],
    foodHighlights: ['Kimchi jjigae', 'Korean BBQ', 'Tteokbokki'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 756,
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    countryKey: 'SG',
    cityName: 'Singapore',
    shortDescription: 'Đảo quốc sư tử với Marina Bay và Gardens by the Bay.',
    description:
      'Singapore là đảo quốc sư tử với Marina Bay Sands, Gardens by the Bay và ẩm thực đa văn hóa.',
    longDescription:
      'Singapore nhỏ gọn nhưng đầy ấn tượng với Marina Bay Sands, Gardens by the Bay, Sentosa Island, khu phố Chinatown và Little India. Thời tiết nóng ẩm quanh năm, tháng 2 – tháng 4 ít mưa nhất.',
    bestTimeToVisit: 'Tháng 2 – tháng 4',
    budgetMin: 4000000,
    budgetMax: 15000000,
    latitude: 1.3521,
    longitude: 103.8198,
    safetyLevel: 'high',
    travelStyles: ['city', 'family', 'food'],
    cultureNotes: [
      'Không ăn kẹo cao su — bị phạt nặng tại Singapore.',
      'Giữ sạch sẽ nơi công cộng — phạt tiền nếu xả rác.',
    ],
    foodHighlights: ['Hainanese Chicken Rice', 'Chili Crab', 'Laksa'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 623,
  },
  {
    slug: 'london',
    name: 'London',
    countryKey: 'GB',
    cityName: 'London',
    shortDescription: 'Thủ đô nước Anh với Big Ben và Tower Bridge.',
    description:
      'London là thủ đô nước Anh với Big Ben, Tower Bridge, Buckingham Palace và các bảo tàng đẳng cấp thế giới.',
    longDescription:
      'London mang đến trải nghiệm phong phú: Big Ben, Tower Bridge, Buckingham Palace, British Museum, Hyde Park và West End theatre. Tháng 5 – tháng 9 là mùa hè ấm áp, lý tưởng để khám phá.',
    bestTimeToVisit: 'Tháng 5 – tháng 9',
    budgetMin: 5000000,
    budgetMax: 20000000,
    latitude: 51.5074,
    longitude: -0.1278,
    safetyLevel: 'medium',
    travelStyles: ['city', 'culture', 'luxury'],
    cultureNotes: [
      'Đi bên trái trên thang cuốn — bên phải dành cho người vội.',
      'Tip 10-15% tại nhà hàng nếu chưa tính service charge.',
    ],
    foodHighlights: ['Fish and Chips', 'Sunday Roast', 'Afternoon Tea'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 945,
  },
  {
    slug: 'sydney',
    name: 'Sydney',
    countryKey: 'AU',
    cityName: 'Sydney',
    shortDescription: 'Thành phố cảng với Opera House và Harbour Bridge.',
    description:
      'Sydney là thành phố cảng nổi tiếng của Úc với Opera House, Harbour Bridge và bãi biển Bondi.',
    longDescription:
      'Sydney sở hữu biểu tượng Opera House, Harbour Bridge, bãi biển Bondi, vườn bách thảo Royal Botanic Gardens và khu phố The Rocks lịch sử. Tháng 9 – tháng 11 (mùa xuân Úc) là thời điểm lý tưởng.',
    bestTimeToVisit: 'Tháng 9 – tháng 11',
    budgetMin: 5000000,
    budgetMax: 18000000,
    latitude: -33.8688,
    longitude: 151.2093,
    safetyLevel: 'high',
    travelStyles: ['city', 'beach', 'nature'],
    cultureNotes: [
      'Kem chống nắng là bắt buộc — tia UV rất mạnh tại Úc.',
      'Tôn trọng văn hóa Aboriginal khi tham quan các di tích.',
    ],
    foodHighlights: ['Meat Pie', 'Barramundi', 'Flat White'],
    category: 'city',
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 534,
  },
];

// ---------------------------------------------------------------------------
// Tours (8)
// ---------------------------------------------------------------------------

interface TourItinerarySeed {
  dayNumber: number;
  title: string;
  description: string;
  meals: string;
  accommodation: string;
  activities: string;
}

interface TourSeed {
  slug: string;
  title: string;
  destinationSlug: string;
  shortDescription: string;
  description: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  salePrice?: number;
  maxGuests: number;
  minGuests: number;
  availableSlots: number;
  featured: boolean;
  category: string;
  itinerary: TourItinerarySeed[];
  /// If true, seed 3 future departures for this tour
  seedDepartures: boolean;
}

const TOURS: TourSeed[] = [
  {
    slug: 'northern-vietnam-adventure',
    title: 'Northern Vietnam Adventure',
    destinationSlug: 'sapa',
    shortDescription: 'Hành trình 6 ngày khám phá Hà Nội – Hạ Long – Sapa với trekking và cruise.',
    description:
      'Tour 6 ngày 5 đêm khám phá miền Bắc Việt Nam: phố cổ Hà Nội, cruise Vịnh Hạ Long và trekking bản làng Sapa.',
    durationDays: 6,
    durationNights: 5,
    basePrice: 12500000,
    salePrice: 10900000,
    maxGuests: 16,
    minGuests: 2,
    availableSlots: 12,
    featured: true,
    category: 'adventure',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Hà Nội — City welcome',
        description: 'Đón sân bay Nội Bài, nhận phòng khách sạn, tự do khám phá phố cổ.',
        meals: 'Dinner',
        accommodation: 'Hanoi Old Quarter 4*',
        activities: 'Walking tour phố cổ, hồ Gươm, nhà thờ Lớn',
      },
      {
        dayNumber: 2,
        title: 'Hà Nội — Highlights',
        description: 'Tham quan lăng Bác, Văn Miếu, Hoàng thành Thăng Long.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Hanoi Old Quarter 4*',
        activities: 'Văn Miếu, chùa Trấn Quốc, cyclo tour',
      },
      {
        dayNumber: 3,
        title: 'Hạ Long Bay — Cruise',
        description: 'Di chuyển Hạ Long, check-in du thuyền 4*.',
        meals: 'Lunch, Dinner',
        accommodation: 'Overnight cruise',
        activities: 'Hang Sửng Sốt, kayak, thả câu mực đêm',
      },
      {
        dayNumber: 4,
        title: 'Hạ Long — Sapa',
        description: 'Sáng Tai Chi, về Hà Nội, chuyển xe lên Sapa.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Sapa boutique hotel',
        activities: 'Tai Chi cruise, xe giường nằm Sapa',
      },
      {
        dayNumber: 5,
        title: 'Sapa trekking',
        description: 'Trekking Cát Cát – Tả Van – Lao Chải.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Sapa boutique hotel',
        activities: 'Trekking 12 km, homestay lunch',
      },
      {
        dayNumber: 6,
        title: 'Fansipan — Farewell',
        description: 'Cáp treo Fansipan, về Hà Nội, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Fansipan cable car, trở về',
      },
    ],
  },
  {
    slug: 'central-vietnam-heritage-tour',
    title: 'Central Vietnam Heritage Tour',
    destinationSlug: 'hoi-an',
    shortDescription: '5 ngày di sản miền Trung: Huế – Đà Nẵng – Hội An – Mỹ Sơn.',
    description:
      'Khám phá 3 di sản UNESCO miền Trung trong 5 ngày: cố đô Huế, phố cổ Hội An và thánh địa Mỹ Sơn.',
    durationDays: 5,
    durationNights: 4,
    basePrice: 8900000,
    salePrice: 7900000,
    maxGuests: 20,
    minGuests: 2,
    availableSlots: 18,
    featured: true,
    category: 'culture',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive Huế',
        description: 'Đón sân bay Phú Bài, check-in và thăm chùa Thiên Mụ.',
        meals: 'Dinner',
        accommodation: 'Huế 4* hotel',
        activities: 'Chùa Thiên Mụ, sông Hương',
      },
      {
        dayNumber: 2,
        title: 'Huế Imperial City',
        description: 'Tham quan Đại Nội, lăng Tự Đức, lăng Khải Định.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Huế 4* hotel',
        activities: 'Đại Nội, lăng tẩm',
      },
      {
        dayNumber: 3,
        title: 'Huế → Đà Nẵng → Hội An',
        description: 'Đèo Hải Vân, Ngũ Hành Sơn, đến Hội An.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Hội An riverside 4*',
        activities: 'Đèo Hải Vân, Non Nước, phố cổ đêm',
      },
      {
        dayNumber: 4,
        title: 'Mỹ Sơn & Hội An',
        description: 'Sáng tham quan thánh địa Mỹ Sơn, chiều may áo dài.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Hội An riverside 4*',
        activities: 'Mỹ Sơn tour, may áo dài, thả đèn hoa đăng',
      },
      {
        dayNumber: 5,
        title: 'Departure',
        description: 'Tự do shopping, tiễn sân bay Đà Nẵng.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Shopping, tiễn sân bay',
      },
    ],
  },
  {
    slug: 'phu-quoc-beach-escape',
    title: 'Phu Quoc Beach Escape',
    destinationSlug: 'phu-quoc',
    shortDescription: '4 ngày nghỉ dưỡng Phú Quốc với resort 5* và cáp treo Hòn Thơm.',
    description:
      'Gói nghỉ dưỡng 4N3Đ tại resort 5* bãi biển, bao gồm cáp treo sang Hòn Thơm và tour 4 đảo.',
    durationDays: 4,
    durationNights: 3,
    basePrice: 7500000,
    salePrice: 6500000,
    maxGuests: 24,
    minGuests: 2,
    availableSlots: 20,
    featured: true,
    category: 'beach',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival Phú Quốc',
        description: 'Đón sân bay, check-in resort 5* bãi Dài.',
        meals: 'Dinner',
        accommodation: 'Phú Quốc 5* beach resort',
        activities: 'Tự do tắm biển',
      },
      {
        dayNumber: 2,
        title: 'Hòn Thơm cable car',
        description: 'Đi cáp treo dài nhất thế giới, công viên nước Aquatopia.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Phú Quốc 5* beach resort',
        activities: 'Cáp treo Hòn Thơm, Aquatopia',
      },
      {
        dayNumber: 3,
        title: '4 Islands tour',
        description: 'Tour 4 đảo phía Nam, lặn san hô, câu cá.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Phú Quốc 5* beach resort',
        activities: 'Lặn ngắm san hô, câu cá đảo nhỏ',
      },
      {
        dayNumber: 4,
        title: 'Departure',
        description: 'Check-out, thăm nhà thùng nước mắm, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Nhà thùng nước mắm, shopping',
      },
    ],
  },
  {
    slug: 'ha-giang-motorbike-adventure',
    title: 'Ha Giang Motorbike Adventure',
    destinationSlug: 'ha-giang',
    shortDescription: '3 ngày phượt Hà Giang cao nguyên đá với easy rider chuyên nghiệp.',
    description:
      'Tour phượt Hà Giang 3N2Đ bằng xe máy với easy rider kinh nghiệm, homestay bản làng.',
    durationDays: 3,
    durationNights: 2,
    basePrice: 4200000,
    salePrice: 3700000,
    maxGuests: 12,
    minGuests: 2,
    availableSlots: 10,
    featured: false,
    category: 'adventure',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Hà Giang → Yên Minh → Đồng Văn',
        description: 'Khởi hành từ TP Hà Giang, qua cổng trời Quản Bạ, đèo Mã Pí Lèng.',
        meals: 'Lunch, Dinner',
        accommodation: 'Đồng Văn homestay',
        activities: 'Cổng trời Quản Bạ, dinh vua Mèo, đèo Mã Pí Lèng',
      },
      {
        dayNumber: 2,
        title: 'Cao nguyên đá & Lũng Cú',
        description: 'Chinh phục cột cờ Lũng Cú, thăm phố cổ Đồng Văn.',
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Đồng Văn homestay',
        activities: 'Cột cờ Lũng Cú, phố cổ, chợ phiên (nếu vào chủ nhật)',
      },
      {
        dayNumber: 3,
        title: 'Mèo Vạc → Hà Giang',
        description: 'Về Hà Giang qua đường khác, kết thúc tour.',
        meals: 'Breakfast, Lunch',
        accommodation: '—',
        activities: 'Sông Nho Quế, hẻm Tu Sản',
      },
    ],
  },
  {
    slug: 'bali-luxury-retreat',
    title: 'Bali Luxury Retreat',
    destinationSlug: 'bali',
    shortDescription: '7 ngày nghỉ dưỡng cao cấp Bali với villa riêng, yoga và spa.',
    description:
      'Trải nghiệm Bali sang trọng trong 7 ngày với villa riêng, yoga sunrise, spa Balinese và tour Ubud.',
    durationDays: 7,
    durationNights: 6,
    basePrice: 28500000,
    salePrice: 24900000,
    maxGuests: 12,
    minGuests: 2,
    availableSlots: 8,
    featured: true,
    category: 'luxury',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival Denpasar',
        description: 'Đón sân bay Ngurah Rai, check-in villa riêng Seminyak.',
        meals: 'Dinner',
        accommodation: 'Seminyak private villa',
        activities: 'Welcome dinner Jimbaran bay',
      },
      {
        dayNumber: 2,
        title: 'Seminyak relaxation',
        description: 'Spa Balinese, sunset Kuta, tự do.',
        meals: 'Breakfast',
        accommodation: 'Seminyak private villa',
        activities: 'Spa, biển Kuta',
      },
      {
        dayNumber: 3,
        title: 'Ubud — yoga & culture',
        description: 'Chuyển đến Ubud, yoga sunrise, thăm chợ Ubud.',
        meals: 'Breakfast, Dinner',
        accommodation: 'Ubud jungle villa',
        activities: 'Yoga, Ubud market, Monkey Forest',
      },
      {
        dayNumber: 4,
        title: 'Tegalalang rice terrace',
        description: 'Thăm ruộng bậc thang, đền Tirta Empul tắm thánh.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Ubud jungle villa',
        activities: 'Tegalalang, Tirta Empul',
      },
      {
        dayNumber: 5,
        title: 'Temples & volcanoes',
        description: 'Núi lửa Batur sunrise trek, đền Ulun Danu Bratan.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Ubud jungle villa',
        activities: 'Mt Batur, Ulun Danu Bratan',
      },
      {
        dayNumber: 6,
        title: 'Tanah Lot & Uluwatu',
        description: 'Thăm Tanah Lot, Uluwatu với điệu múa Kecak.',
        meals: 'Breakfast, Dinner',
        accommodation: 'Seminyak private villa',
        activities: 'Tanah Lot, Uluwatu Kecak dance',
      },
      {
        dayNumber: 7,
        title: 'Departure',
        description: 'Tự do shopping, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Shopping, airport transfer',
      },
    ],
  },
  {
    slug: 'japan-spring-discovery',
    title: 'Japan Spring Discovery',
    destinationSlug: 'tokyo',
    shortDescription: '6 ngày mùa hoa anh đào Nhật Bản: Tokyo – Hakone – Kyoto.',
    description:
      'Ngắm hoa anh đào nở rộ trong 6 ngày khám phá Tokyo hiện đại, suối nước nóng Hakone và Kyoto cổ kính.',
    durationDays: 6,
    durationNights: 5,
    basePrice: 35900000,
    maxGuests: 18,
    minGuests: 4,
    availableSlots: 14,
    featured: true,
    category: 'culture',
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Tokyo arrival',
        description: 'Đón sân bay Narita, chuyển khách sạn Shinjuku.',
        meals: 'Dinner',
        accommodation: 'Tokyo Shinjuku 4*',
        activities: 'Shinjuku dạo đêm',
      },
      {
        dayNumber: 2,
        title: 'Tokyo classic',
        description: 'Asakusa Senso-ji, Skytree, Akihabara, Shibuya.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Tokyo Shinjuku 4*',
        activities: 'Senso-ji, Skytree, Shibuya crossing',
      },
      {
        dayNumber: 3,
        title: 'Mt Fuji & Hakone',
        description: 'Lake Ashi cruise, Hakone ropeway, onsen.',
        meals: 'Breakfast, Kaiseki Dinner',
        accommodation: 'Hakone ryokan',
        activities: 'Owakudani, Hakone ropeway, onsen',
      },
      {
        dayNumber: 4,
        title: 'Kyoto shinkansen',
        description: 'Tàu cao tốc đến Kyoto, Kinkaku-ji, Fushimi Inari.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Kyoto 4* hotel',
        activities: 'Kinkaku-ji, Fushimi Inari shrine',
      },
      {
        dayNumber: 5,
        title: 'Arashiyama & Gion',
        description: 'Rừng trúc Arashiyama, phố Gion geisha.',
        meals: 'Breakfast',
        accommodation: 'Kyoto 4* hotel',
        activities: 'Arashiyama bamboo, Gion walk',
      },
      {
        dayNumber: 6,
        title: 'Return Tokyo departure',
        description: 'Về Tokyo, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Shinkansen, airport transfer',
      },
    ],
  },
  {
    slug: 'thailand-city-island-tour',
    title: 'Thailand City & Island Tour',
    destinationSlug: 'bangkok',
    shortDescription: '5 ngày combo Bangkok – Phuket với chùa vàng và đảo Phi Phi.',
    description: 'Combo 5N4Đ khám phá Bangkok sôi động và nghỉ dưỡng đảo Phuket với tour Phi Phi.',
    durationDays: 5,
    durationNights: 4,
    basePrice: 9900000,
    salePrice: 8500000,
    maxGuests: 22,
    minGuests: 2,
    availableSlots: 16,
    featured: false,
    category: 'beach',
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Bangkok arrival',
        description: 'Đón sân bay Suvarnabhumi, check-in, chợ đêm Asiatique.',
        meals: 'Dinner',
        accommodation: 'Bangkok 4* riverside',
        activities: 'Asiatique Riverfront',
      },
      {
        dayNumber: 2,
        title: 'Bangkok temples',
        description: 'Cung điện Hoàng gia, Wat Pho, Wat Arun.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Bangkok 4* riverside',
        activities: 'Grand Palace, Wat Pho, Wat Arun',
      },
      {
        dayNumber: 3,
        title: 'Bangkok → Phuket',
        description: 'Bay sang Phuket, nhận phòng beach resort.',
        meals: 'Breakfast',
        accommodation: 'Phuket 4* beach resort',
        activities: 'Patong beach, Bangla Road',
      },
      {
        dayNumber: 4,
        title: 'Phi Phi islands',
        description: 'Speedboat Phi Phi, vịnh Maya, lặn ngắm san hô.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Phuket 4* beach resort',
        activities: 'Maya Bay, Phi Phi Don, snorkeling',
      },
      {
        dayNumber: 5,
        title: 'Departure',
        description: 'Tự do, tiễn sân bay Phuket.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Shopping, sân bay',
      },
    ],
  },
  {
    slug: 'europe-romantic-journey',
    title: 'Europe Romantic Journey',
    destinationSlug: 'paris',
    shortDescription: '7 ngày Pháp – Ý – Thụy Sĩ lãng mạn dành cho cặp đôi.',
    description:
      'Hành trình 7 ngày Châu Âu lãng mạn: Paris kinh đô ánh sáng, Lucerne thơ mộng và Venice trên mặt nước.',
    durationDays: 7,
    durationNights: 6,
    basePrice: 58900000,
    maxGuests: 16,
    minGuests: 4,
    availableSlots: 10,
    featured: true,
    category: 'luxury',
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Paris arrival',
        description: 'Đón Charles de Gaulle, nhận phòng, Seine cruise.',
        meals: 'Dinner',
        accommodation: 'Paris 4* boutique',
        activities: 'Seine cruise, Eiffel đêm',
      },
      {
        dayNumber: 2,
        title: 'Paris classic',
        description: 'Louvre, Notre Dame, Champs-Élysées.',
        meals: 'Breakfast',
        accommodation: 'Paris 4* boutique',
        activities: 'Louvre, Arc de Triomphe, Champs-Élysées',
      },
      {
        dayNumber: 3,
        title: 'Paris → Lucerne',
        description: 'Tàu cao tốc TGV sang Thụy Sĩ, nhận phòng Lucerne.',
        meals: 'Breakfast',
        accommodation: 'Lucerne 4*',
        activities: 'Chapel Bridge, Lake Lucerne',
      },
      {
        dayNumber: 4,
        title: 'Mt Titlis',
        description: 'Cáp treo Mt Titlis, snow experience.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Lucerne 4*',
        activities: 'Mt Titlis rotating cable car',
      },
      {
        dayNumber: 5,
        title: 'Lucerne → Venice',
        description: 'Di chuyển tàu qua Alps, đến Venice tối.',
        meals: 'Breakfast',
        accommodation: 'Venice 4* canal view',
        activities: 'Dinner tại khu Cannaregio',
      },
      {
        dayNumber: 6,
        title: 'Venice gondola',
        description: "St Mark's Square, gondola ride, đảo Murano.",
        meals: 'Breakfast, Lunch',
        accommodation: 'Venice 4* canal view',
        activities: "St Mark's, gondola, Murano glass",
      },
      {
        dayNumber: 7,
        title: 'Departure',
        description: 'Tiễn sân bay Marco Polo.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Airport transfer',
      },
    ],
  },
  {
    slug: 'nha-trang-diving-adventure',
    title: 'Nha Trang Diving Adventure',
    destinationSlug: 'nha-trang',
    shortDescription: '4 ngày khám phá biển Nha Trang với lặn biển và Vinpearl Land.',
    description:
      'Tour 4 ngày 3 đêm lặn biển Nha Trang, khám phá san hô và trải nghiệm Vinpearl Land.',
    durationDays: 4,
    durationNights: 3,
    basePrice: 6500000,
    salePrice: 5900000,
    maxGuests: 16,
    minGuests: 2,
    availableSlots: 12,
    featured: true,
    category: 'beach',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival Nha Trang',
        description: 'Đón sân bay Cam Ranh, check-in resort, tự do tắm biển.',
        meals: 'Dinner',
        accommodation: 'Nha Trang 4* beach resort',
        activities: 'Tắm biển, dạo phố đêm',
      },
      {
        dayNumber: 2,
        title: 'Diving & Snorkeling',
        description: 'Lặn biển tại Hòn Mun, ngắm san hô và cá nhiệt đới.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Nha Trang 4* beach resort',
        activities: 'Lặn biển Hòn Mun, snorkeling',
      },
      {
        dayNumber: 3,
        title: 'Vinpearl Land',
        description: 'Trọn ngày tại Vinpearl Land với cáp treo và công viên nước.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Nha Trang 4* beach resort',
        activities: 'Vinpearl Land, cáp treo, aquarium',
      },
      {
        dayNumber: 4,
        title: 'Departure',
        description: 'Tham quan tháp Bà Ponagar, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Tháp Bà Ponagar, sân bay',
      },
    ],
  },
  {
    slug: 'hue-imperial-heritage',
    title: 'Huế Imperial Heritage Tour',
    destinationSlug: 'hue',
    shortDescription: '3 ngày khám phá cố đô Huế với Đại Nội và lăng tẩm.',
    description:
      'Tour 3 ngày 2 đêm khám phá di sản cố đô Huế: Đại Nội, lăng tẩm và ẩm thực cung đình.',
    durationDays: 3,
    durationNights: 2,
    basePrice: 5200000,
    maxGuests: 20,
    minGuests: 2,
    availableSlots: 16,
    featured: false,
    category: 'culture',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive Huế',
        description: 'Đón sân bay Phú Bài, check-in, thăm chùa Thiên Mụ.',
        meals: 'Dinner',
        accommodation: 'Huế 4* hotel',
        activities: 'Chùa Thiên Mụ, sông Hương',
      },
      {
        dayNumber: 2,
        title: 'Đại Nội & Lăng tẩm',
        description: 'Tham quan Đại Nội, lăng Tự Đức, lăng Khải Định.',
        meals: 'Breakfast, Lunch, Dinner',
        accommodation: 'Huế 4* hotel',
        activities: 'Đại Nội, lăng tẩm, ẩm thực cung đình',
      },
      {
        dayNumber: 3,
        title: 'Departure',
        description: 'Chợ Đông Ba, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Chợ Đông Ba, shopping',
      },
    ],
  },
  {
    slug: 'mekong-delta-discovery',
    title: 'Mekong Delta Discovery',
    destinationSlug: 'can-tho',
    shortDescription: '2 ngày khám phá miền Tây sông nước với chợ nổi Cái Răng.',
    description: 'Tour 2 ngày 1 đêm khám phá Cần Thơ và chợ nổi Cái Răng, vườn trái cây miền Tây.',
    durationDays: 2,
    durationNights: 1,
    basePrice: 3200000,
    salePrice: 2800000,
    maxGuests: 20,
    minGuests: 2,
    availableSlots: 16,
    featured: true,
    category: 'culture',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Cần Thơ arrival',
        description: 'Di chuyển từ Sài Gòn, thăm bến Ninh Kiều, chợ đêm.',
        meals: 'Lunch, Dinner',
        accommodation: 'Cần Thơ 3* hotel',
        activities: 'Bến Ninh Kiều, chợ đêm, xe đạp ven sông',
      },
      {
        dayNumber: 2,
        title: 'Chợ nổi Cái Răng',
        description: 'Sáng sớm đi chợ nổi, thăm vườn trái cây, về Sài Gòn.',
        meals: 'Breakfast, Lunch',
        accommodation: '—',
        activities: 'Chợ nổi Cái Răng, vườn trái cây, làng nghề',
      },
    ],
  },
  {
    slug: 'seoul-k-culture-tour',
    title: 'Seoul K-Culture Experience',
    destinationSlug: 'seoul',
    shortDescription: '5 ngày trải nghiệm K-culture tại Seoul với cung điện và Myeongdong.',
    description:
      'Tour 5 ngày 4 đêm khám phá Seoul: Gyeongbokgung, Bukchon Hanok, Myeongdong và K-pop.',
    durationDays: 5,
    durationNights: 4,
    basePrice: 25000000,
    maxGuests: 18,
    minGuests: 4,
    availableSlots: 14,
    featured: true,
    category: 'city',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Seoul arrival',
        description: 'Đón sân bay Incheon, check-in Myeongdong, dạo phố đêm.',
        meals: 'Dinner',
        accommodation: 'Seoul Myeongdong 4*',
        activities: 'Myeongdong shopping, street food',
      },
      {
        dayNumber: 2,
        title: 'Gyeongbokgung & Bukchon',
        description: 'Mặc Hanbok tham quan cung điện, làng Bukchon Hanok.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Seoul Myeongdong 4*',
        activities: 'Gyeongbokgung, Bukchon Hanok, Insadong',
      },
      {
        dayNumber: 3,
        title: 'Namsan & Gangnam',
        description: 'Tháp Namsan, khu Gangnam, COEX Mall.',
        meals: 'Breakfast',
        accommodation: 'Seoul Myeongdong 4*',
        activities: 'Namsan Tower, Gangnam, K-star Road',
      },
      {
        dayNumber: 4,
        title: 'DMZ & Nami Island',
        description: 'Tour DMZ biên giới, chiều thăm đảo Nami.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Seoul Myeongdong 4*',
        activities: 'DMZ tour, Nami Island',
      },
      {
        dayNumber: 5,
        title: 'Departure',
        description: 'Tự do shopping Hongdae, tiễn sân bay Incheon.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Hongdae, airport transfer',
      },
    ],
  },
  {
    slug: 'singapore-city-explorer',
    title: 'Singapore City Explorer',
    destinationSlug: 'singapore',
    shortDescription: '4 ngày khám phá Singapore với Marina Bay và Sentosa.',
    description:
      'Tour 4 ngày 3 đêm khám phá Singapore: Marina Bay Sands, Gardens by the Bay, Sentosa và ẩm thực đa văn hóa.',
    durationDays: 4,
    durationNights: 3,
    basePrice: 22000000,
    salePrice: 19500000,
    maxGuests: 20,
    minGuests: 2,
    availableSlots: 16,
    featured: false,
    category: 'city',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'Singapore arrival',
        description: 'Đón sân bay Changi, check-in, Marina Bay Sands đêm.',
        meals: 'Dinner',
        accommodation: 'Singapore 4* hotel',
        activities: 'Marina Bay Sands, Spectra light show',
      },
      {
        dayNumber: 2,
        title: 'Gardens & Chinatown',
        description: 'Gardens by the Bay, Chinatown, Little India.',
        meals: 'Breakfast, Lunch',
        accommodation: 'Singapore 4* hotel',
        activities: 'Gardens by the Bay, Cloud Forest, Chinatown',
      },
      {
        dayNumber: 3,
        title: 'Sentosa Island',
        description: 'Trọn ngày Sentosa: Universal Studios, bãi biển.',
        meals: 'Breakfast',
        accommodation: 'Singapore 4* hotel',
        activities: 'Universal Studios, Sentosa beach',
      },
      {
        dayNumber: 4,
        title: 'Departure',
        description: 'Orchard Road shopping, tiễn sân bay Changi.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Orchard Road, Jewel Changi',
      },
    ],
  },
  {
    slug: 'london-classic-tour',
    title: 'London Classic Tour',
    destinationSlug: 'london',
    shortDescription: '7 ngày khám phá London với Big Ben, Tower Bridge và bảo tàng.',
    description:
      'Tour 7 ngày 6 đêm khám phá London: Big Ben, Tower Bridge, British Museum, Buckingham Palace và West End.',
    durationDays: 7,
    durationNights: 6,
    basePrice: 45000000,
    maxGuests: 16,
    minGuests: 4,
    availableSlots: 10,
    featured: true,
    category: 'city',
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: 'London arrival',
        description: 'Đón sân bay Heathrow, check-in, dạo South Bank.',
        meals: 'Dinner',
        accommodation: 'London 4* hotel',
        activities: 'South Bank, London Eye',
      },
      {
        dayNumber: 2,
        title: 'Westminster & Big Ben',
        description: 'Westminster Abbey, Big Ben, Houses of Parliament.',
        meals: 'Breakfast, Lunch',
        accommodation: 'London 4* hotel',
        activities: 'Westminster, Big Ben, St James Park',
      },
      {
        dayNumber: 3,
        title: 'Tower of London & Bridge',
        description: 'Tower of London, Tower Bridge, Borough Market.',
        meals: 'Breakfast, Lunch',
        accommodation: 'London 4* hotel',
        activities: 'Tower of London, Tower Bridge, Borough Market',
      },
      {
        dayNumber: 4,
        title: 'British Museum & West End',
        description: 'British Museum, Covent Garden, West End show.',
        meals: 'Breakfast',
        accommodation: 'London 4* hotel',
        activities: 'British Museum, Covent Garden, musical',
      },
      {
        dayNumber: 5,
        title: 'Buckingham & Hyde Park',
        description: 'Đổi gác Buckingham Palace, Hyde Park, Harrods.',
        meals: 'Breakfast, Afternoon Tea',
        accommodation: 'London 4* hotel',
        activities: 'Buckingham Palace, Hyde Park, Harrods',
      },
      {
        dayNumber: 6,
        title: 'Day trip — Stonehenge',
        description: 'Day trip Stonehenge và Bath.',
        meals: 'Breakfast, Lunch',
        accommodation: 'London 4* hotel',
        activities: 'Stonehenge, Bath Roman Baths',
      },
      {
        dayNumber: 7,
        title: 'Departure',
        description: 'Tự do shopping Oxford Street, tiễn sân bay.',
        meals: 'Breakfast',
        accommodation: '—',
        activities: 'Oxford Street, airport transfer',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Blog posts (8) — 6 PUBLISHED + 2 DRAFT
// ---------------------------------------------------------------------------

interface BlogPostSeed {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT';
  /// Days in the past (for PUBLISHED posts only)
  publishedDaysAgo?: number;
}

const BLOG_POSTS: BlogPostSeed[] = [
  {
    slug: 'top-10-diem-den-viet-nam-2025',
    title: 'Top 10 điểm đến Việt Nam nhất định phải ghé năm 2025',
    excerpt:
      'Khám phá những điểm đến đỉnh cao của Việt Nam, từ vịnh Hạ Long kỳ vĩ đến đảo ngọc Phú Quốc.',
    content:
      '# Top 10 điểm đến Việt Nam 2025\n\nNăm 2025 là thời điểm lý tưởng để khám phá Việt Nam. Bài viết này điểm qua 10 địa điểm hot nhất: Hạ Long, Đà Nẵng, Hội An, Sapa, Ninh Bình, Phú Quốc, Đà Lạt, Hà Giang, Huế và Nha Trang.\n\n## 1. Hạ Long Bay\nDi sản UNESCO với hàng nghìn đảo đá vôi...',
    category: 'guide',
    status: 'PUBLISHED',
    publishedDaysAgo: 45,
  },
  {
    slug: 'huong-dan-phuot-ha-giang-mua-hoa-tam-giac-mach',
    title: 'Hướng dẫn phượt Hà Giang mùa hoa tam giác mạch',
    excerpt:
      'Cẩm nang chi tiết phượt Hà Giang 3 ngày 2 đêm mùa hoa tam giác mạch tháng 10 – tháng 11.',
    content:
      '# Phượt Hà Giang mùa hoa tam giác mạch\n\nTháng 10 – tháng 11 là thời điểm hoa tam giác mạch nở rộ trên cao nguyên đá Đồng Văn...',
    category: 'adventure',
    status: 'PUBLISHED',
    publishedDaysAgo: 30,
  },
  {
    slug: 'bi-quyet-checkin-hoi-an-phim-truong',
    title: 'Bí quyết check-in Hội An đẹp như phim',
    excerpt: '5 góc chụp ảnh đỉnh cao tại phố cổ Hội An và gợi ý áo dài màu sắc phù hợp.',
    content:
      '# Check-in Hội An đẹp như phim\n\nHội An với đèn lồng rực rỡ và tường vàng cổ kính là thiên đường sống ảo...',
    category: 'tips',
    status: 'PUBLISHED',
    publishedDaysAgo: 20,
  },
  {
    slug: 'am-thuc-da-nang-must-try',
    title: '10 món ăn đường phố phải thử khi đến Đà Nẵng',
    excerpt: 'Từ mì Quảng đến bánh tráng cuốn thịt heo, hướng dẫn ẩm thực Đà Nẵng trọn vẹn.',
    content:
      '# Ẩm thực Đà Nẵng\n\nMì Quảng, bún chả cá, bánh tráng cuốn thịt heo, chè xoa xoa hạt lựu...',
    category: 'food',
    status: 'PUBLISHED',
    publishedDaysAgo: 14,
  },
  {
    slug: 'cam-nang-du-lich-bali-7-ngay',
    title: 'Cẩm nang du lịch Bali 7 ngày cho người mới',
    excerpt: 'Lịch trình 7 ngày khám phá Bali trọn vẹn với giá hợp lý và trải nghiệm chất lượng.',
    content:
      '# Du lịch Bali 7 ngày\n\nBali là thiên đường nghỉ dưỡng với đền Hindu, yoga Ubud, biển Uluwatu và nasi goreng...',
    category: 'guide',
    status: 'PUBLISHED',
    publishedDaysAgo: 7,
  },
  {
    slug: 'di-tokyo-mua-hoa-anh-dao-can-biet-gi',
    title: 'Đi Tokyo mùa hoa anh đào cần biết gì?',
    excerpt: 'Những điều cần chuẩn bị và lưu ý khi du lịch Tokyo mùa Sakura tháng 3 – 4.',
    content:
      '# Tokyo mùa Sakura\n\nMùa hoa anh đào tháng 3 – 4 là thời điểm đẹp nhất để đến Tokyo. Bài viết chia sẻ visa, chỗ ở, địa điểm ngắm hoa và lịch trình 5 ngày...',
    category: 'guide',
    status: 'PUBLISHED',
    publishedDaysAgo: 3,
  },
  {
    slug: 'kinh-nghiem-di-paris-lan-dau',
    title: 'Kinh nghiệm đi Paris lần đầu',
    excerpt:
      'Tất cả những điều bạn cần biết trước chuyến đi Paris đầu tiên: visa, chi phí, an ninh.',
    content:
      '# Paris lần đầu — cần biết gì?\n\nParis lãng mạn nhưng cũng có những điều cần lưu ý về visa Schengen, ngân sách, các điểm tránh vào ban đêm...',
    category: 'guide',
    status: 'DRAFT',
  },
  {
    slug: 'review-tour-sapa-mua-lua-chin-2025',
    title: 'Review tour Sapa mùa lúa chín 2025',
    excerpt:
      'Trải nghiệm thực tế tour Sapa 3 ngày 2 đêm với WanderViet, đánh giá chất lượng dịch vụ.',
    content:
      '# Review tour Sapa — mùa lúa chín\n\nChuyến đi Sapa 3N2Đ với WanderViet mang lại trải nghiệm tuyệt vời. Đây là review chi tiết dịch vụ, ăn uống và lịch trình...',
    category: 'review',
    status: 'DRAFT',
  },
];

// ---------------------------------------------------------------------------
// Contact requests (5) — mix NEW / IN_PROGRESS / RESOLVED
// ---------------------------------------------------------------------------

interface ContactSeed {
  name: string;
  email: string;
  phone: string;
  destinationInterested: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignToStaff: boolean;
  adminNote?: string;
}

const CONTACT_REQUESTS: ContactSeed[] = [
  {
    name: 'Nguyễn Thu Hà',
    email: 'thuha@example.com',
    phone: '0901234567',
    destinationInterested: 'phu-quoc',
    message:
      'Chào shop, gia đình 4 người muốn đi Phú Quốc 4N3Đ dịp tháng 12, cho tôi gợi ý tour và giá.',
    status: 'NEW',
    assignToStaff: false,
  },
  {
    name: 'Trần Minh Anh',
    email: 'minhanh.tran@example.com',
    phone: '0912345678',
    destinationInterested: 'sapa',
    message:
      'Tôi muốn đặt tour Sapa 3 ngày cho nhóm 6 người vào cuối tháng 10. Có combo nào không?',
    status: 'NEW',
    assignToStaff: false,
  },
  {
    name: 'Lê Hoàng Nam',
    email: 'hoangnam.le@example.com',
    phone: '0923456789',
    destinationInterested: 'bali',
    message: 'Cặp đôi cần báo giá tour Bali Luxury Retreat khởi hành tháng 3/2026.',
    status: 'IN_PROGRESS',
    assignToStaff: true,
    adminNote: 'Đã gửi báo giá qua email, đang chờ khách xác nhận ngày khởi hành.',
  },
  {
    name: 'Phạm Thuỷ Tiên',
    email: 'thuytien.pham@example.com',
    phone: '0934567890',
    destinationInterested: 'ha-giang',
    message: 'Em muốn đi Hà Giang phượt nhưng chưa biết cần chuẩn bị gì, tư vấn giúp em với.',
    status: 'IN_PROGRESS',
    assignToStaff: true,
    adminNote: 'Đang gửi checklist đồ cần mang và giới thiệu easy rider.',
  },
  {
    name: 'Võ Quốc Tuấn',
    email: 'quoctuan.vo@example.com',
    phone: '0945678901',
    destinationInterested: 'paris',
    message: 'Đã đặt tour Europe Romantic Journey, cảm ơn đội ngũ WanderViet hỗ trợ visa nhanh.',
    status: 'RESOLVED',
    assignToStaff: true,
    adminNote: 'Tour đã khởi hành thành công, khách hài lòng — đã xin feedback qua email.',
  },
  {
    name: 'Đặng Hải Yến',
    email: 'haiyen.dang@example.com',
    phone: '0956789012',
    destinationInterested: 'tokyo',
    message: 'Mình đã đặt tour Nhật Bản qua đơn vị khác, cảm ơn đã tư vấn.',
    status: 'CLOSED',
    assignToStaff: true,
    adminNote: 'Khách đã chọn nhà cung cấp khác — đóng yêu cầu.',
  },
];

// ---------------------------------------------------------------------------
// Traveloka-style seed functions: Airlines, Flights, Promotions, Hotels
// ---------------------------------------------------------------------------

async function seedAirlines() {
  const airlines = [
    {
      code: 'VN',
      nameVi: 'Vietnam Airlines',
      nameEn: 'Vietnam Airlines',
      nameJa: 'ベトナム航空',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Vietnam_Airlines_logo.svg/200px-Vietnam_Airlines_logo.svg.png',
    },
    {
      code: 'VJ',
      nameVi: 'VietJet Air',
      nameEn: 'VietJet Air',
      nameJa: 'ベトジェットエア',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/VietJet_Air_logo.svg/200px-VietJet_Air_logo.svg.png',
    },
    {
      code: 'QH',
      nameVi: 'Bamboo Airways',
      nameEn: 'Bamboo Airways',
      nameJa: 'バンブー・エアウェイズ',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bamboo_Airways_logo.svg/200px-Bamboo_Airways_logo.svg.png',
    },
  ];

  for (const a of airlines) {
    await prisma.airlineMock.upsert({
      where: { code: a.code },
      update: { nameVi: a.nameVi, nameEn: a.nameEn, nameJa: a.nameJa, logoUrl: a.logoUrl },
      create: a,
    });
  }

  console.log(`✓ Airlines seeded (${airlines.length})`);
}

async function seedFlights() {
  // Get airline IDs
  const vn = await prisma.airlineMock.findUnique({ where: { code: 'VN' } });
  const vj = await prisma.airlineMock.findUnique({ where: { code: 'VJ' } });
  const qh = await prisma.airlineMock.findUnique({ where: { code: 'QH' } });
  if (!vn || !vj || !qh) throw new Error('Airlines must be seeded before flights');

  // Base date: 7 days from now for departure times
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 7);
  baseDate.setSeconds(0, 0);

  function flightTime(dayOffset: number, hour: number, minute: number): Date {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  const flights = [
    // SGN-HAN routes
    {
      flightNumber: 'VN200',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 6, 0),
      arrivalTime: flightTime(0, 8, 10),
      durationMin: 130,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1850000,
      taxAmount: 350000,
      seatsAvailable: 180,
    },
    {
      flightNumber: 'VN202',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 14, 30),
      arrivalTime: flightTime(0, 16, 40),
      durationMin: 130,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 2100000,
      taxAmount: 380000,
      seatsAvailable: 150,
    },
    {
      flightNumber: 'VJ101',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 7, 30),
      arrivalTime: flightTime(0, 9, 40),
      durationMin: 130,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1450000,
      taxAmount: 320000,
      seatsAvailable: 200,
    },
    {
      flightNumber: 'VJ103',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 19, 0),
      arrivalTime: flightTime(0, 21, 10),
      durationMin: 130,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1650000,
      taxAmount: 320000,
      seatsAvailable: 165,
    },
    {
      flightNumber: 'QH301',
      airlineId: qh.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 10, 0),
      arrivalTime: flightTime(0, 12, 10),
      durationMin: 130,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1750000,
      taxAmount: 340000,
      seatsAvailable: 170,
    },
    // SGN-DAD routes
    {
      flightNumber: 'VN310',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'DAD',
      departureTime: flightTime(1, 8, 0),
      arrivalTime: flightTime(1, 9, 20),
      durationMin: 80,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1350000,
      taxAmount: 280000,
      seatsAvailable: 180,
    },
    {
      flightNumber: 'VJ205',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'DAD',
      departureTime: flightTime(1, 11, 30),
      arrivalTime: flightTime(1, 12, 50),
      durationMin: 80,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 990000,
      taxAmount: 250000,
      seatsAvailable: 200,
    },
    {
      flightNumber: 'QH401',
      airlineId: qh.id,
      origin: 'SGN',
      destination: 'DAD',
      departureTime: flightTime(1, 15, 0),
      arrivalTime: flightTime(1, 16, 20),
      durationMin: 80,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1150000,
      taxAmount: 260000,
      seatsAvailable: 160,
    },
    // HAN-DAD routes
    {
      flightNumber: 'VN320',
      airlineId: vn.id,
      origin: 'HAN',
      destination: 'DAD',
      departureTime: flightTime(2, 7, 0),
      arrivalTime: flightTime(2, 8, 20),
      durationMin: 80,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1250000,
      taxAmount: 270000,
      seatsAvailable: 175,
    },
    {
      flightNumber: 'VJ207',
      airlineId: vj.id,
      origin: 'HAN',
      destination: 'DAD',
      departureTime: flightTime(2, 13, 0),
      arrivalTime: flightTime(2, 14, 20),
      durationMin: 80,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 950000,
      taxAmount: 240000,
      seatsAvailable: 190,
    },
    // SGN-PQC routes
    {
      flightNumber: 'VN400',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'PQC',
      departureTime: flightTime(3, 9, 0),
      arrivalTime: flightTime(3, 10, 0),
      durationMin: 60,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1100000,
      taxAmount: 250000,
      seatsAvailable: 160,
    },
    {
      flightNumber: 'VJ301',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'PQC',
      departureTime: flightTime(3, 16, 0),
      arrivalTime: flightTime(3, 17, 0),
      durationMin: 60,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 850000,
      taxAmount: 220000,
      seatsAvailable: 180,
    },
    // HAN-CXR (Cam Ranh / Nha Trang) routes
    {
      flightNumber: 'VN500',
      airlineId: vn.id,
      origin: 'HAN',
      destination: 'CXR',
      departureTime: flightTime(4, 6, 30),
      arrivalTime: flightTime(4, 8, 30),
      durationMin: 120,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1650000,
      taxAmount: 320000,
      seatsAvailable: 170,
    },
    {
      flightNumber: 'QH501',
      airlineId: qh.id,
      origin: 'HAN',
      destination: 'CXR',
      departureTime: flightTime(4, 12, 0),
      arrivalTime: flightTime(4, 14, 0),
      durationMin: 120,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1450000,
      taxAmount: 300000,
      seatsAvailable: 155,
    },
    // SGN-DLI (Da Lat) routes
    {
      flightNumber: 'VJ401',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'DLI',
      departureTime: flightTime(5, 8, 0),
      arrivalTime: flightTime(5, 8, 55),
      durationMin: 55,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 780000,
      taxAmount: 200000,
      seatsAvailable: 180,
    },
    {
      flightNumber: 'VN600',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'DLI',
      departureTime: flightTime(5, 17, 0),
      arrivalTime: flightTime(5, 17, 55),
      durationMin: 55,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1050000,
      taxAmount: 240000,
      seatsAvailable: 160,
    },
    // Business class flights
    {
      flightNumber: 'VN210',
      airlineId: vn.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(0, 9, 0),
      arrivalTime: flightTime(0, 11, 10),
      durationMin: 130,
      stops: 0,
      cabinClass: 'business',
      basePrice: 4500000,
      taxAmount: 650000,
      seatsAvailable: 24,
    },
    {
      flightNumber: 'QH310',
      airlineId: qh.id,
      origin: 'SGN',
      destination: 'DAD',
      departureTime: flightTime(1, 9, 0),
      arrivalTime: flightTime(1, 10, 20),
      durationMin: 80,
      stops: 0,
      cabinClass: 'business',
      basePrice: 3200000,
      taxAmount: 480000,
      seatsAvailable: 16,
    },
    // Flights with stops
    {
      flightNumber: 'VJ501',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'HAN',
      departureTime: flightTime(6, 6, 0),
      arrivalTime: flightTime(6, 9, 30),
      durationMin: 210,
      stops: 1,
      layoverCity: 'DAD',
      layoverMin: 45,
      cabinClass: 'economy',
      basePrice: 1250000,
      taxAmount: 300000,
      seatsAvailable: 195,
    },
    {
      flightNumber: 'QH601',
      airlineId: qh.id,
      origin: 'HAN',
      destination: 'PQC',
      departureTime: flightTime(6, 7, 0),
      arrivalTime: flightTime(6, 11, 0),
      durationMin: 240,
      stops: 1,
      layoverCity: 'SGN',
      layoverMin: 60,
      cabinClass: 'economy',
      basePrice: 1550000,
      taxAmount: 310000,
      seatsAvailable: 140,
    },
    // HAN-HUI (Hue) route
    {
      flightNumber: 'VN700',
      airlineId: vn.id,
      origin: 'HAN',
      destination: 'HUI',
      departureTime: flightTime(7, 10, 0),
      arrivalTime: flightTime(7, 11, 10),
      durationMin: 70,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1100000,
      taxAmount: 250000,
      seatsAvailable: 165,
    },
    // SGN-VII (Vinh) route
    {
      flightNumber: 'VJ601',
      airlineId: vj.id,
      origin: 'SGN',
      destination: 'VII',
      departureTime: flightTime(7, 14, 0),
      arrivalTime: flightTime(7, 15, 45),
      durationMin: 105,
      stops: 0,
      cabinClass: 'economy',
      basePrice: 1350000,
      taxAmount: 280000,
      seatsAvailable: 175,
    },
  ];

  for (const f of flights) {
    await prisma.flightMock.upsert({
      where: { flightNumber: f.flightNumber },
      update: {
        airlineId: f.airlineId,
        origin: f.origin,
        destination: f.destination,
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        durationMin: f.durationMin,
        stops: f.stops,
        layoverCity: f.layoverCity ?? null,
        layoverMin: f.layoverMin ?? null,
        cabinClass: f.cabinClass,
        basePrice: f.basePrice,
        taxAmount: f.taxAmount,
        seatsAvailable: f.seatsAvailable,
      },
      create: f,
    });
  }

  console.log(`✓ Flights seeded (${flights.length})`);
}

async function seedPromoBanners() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 3);
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 30);

  const banners = [
    {
      titleVi: 'Giảm 30% khách sạn Đà Nẵng',
      titleEn: '30% Off Da Nang Hotels',
      titleJa: 'ダナンホテル30%オフ',
      imageUrl:
        'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/hotels?city=da-nang',
      sortOrder: 1,
    },
    {
      titleVi: 'Bay Phú Quốc chỉ từ 850K',
      titleEn: 'Fly to Phu Quoc from 850K',
      titleJa: 'フーコック行き850Kから',
      imageUrl:
        'https://images.unsplash.com/photo-1540202404-a2f29564651f?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/flights?destination=PQC',
      sortOrder: 2,
    },
    {
      titleVi: 'Combo Hội An 3N2Đ siêu tiết kiệm',
      titleEn: 'Hoi An 3D2N Super Saver Combo',
      titleJa: 'ホイアン3泊2日お得コンボ',
      imageUrl:
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/tours/central-vietnam-heritage-tour',
      sortOrder: 3,
    },
    {
      titleVi: 'Mùa hè Nha Trang - Giảm đến 40%',
      titleEn: 'Nha Trang Summer - Up to 40% Off',
      titleJa: 'ニャチャンの夏 - 最大40%オフ',
      imageUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/hotels?city=nha-trang',
      sortOrder: 4,
    },
    {
      titleVi: 'Khám phá Sapa mùa lúa chín',
      titleEn: 'Discover Sapa Rice Season',
      titleJa: 'サパの稲刈りシーズンを発見',
      imageUrl:
        'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/tours/northern-vietnam-adventure',
      sortOrder: 5,
    },
    {
      titleVi: 'Flash Sale cuối tuần - Đặt ngay!',
      titleEn: 'Weekend Flash Sale - Book Now!',
      titleJa: '週末フラッシュセール - 今すぐ予約！',
      imageUrl:
        'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/promotions',
      sortOrder: 6,
    },
  ];

  for (const b of banners) {
    // Use titleVi + sortOrder as de-dupe key
    const existing = await prisma.promoBanner.findFirst({
      where: { titleVi: b.titleVi },
    });
    if (existing) {
      await prisma.promoBanner.update({
        where: { id: existing.id },
        data: { ...b, startDate, endDate, isActive: true },
      });
    } else {
      await prisma.promoBanner.create({
        data: { ...b, startDate, endDate, isActive: true },
      });
    }
  }

  console.log(`✓ Promo banners seeded (${banners.length})`);
}

async function seedFlashSaleItems() {
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(startTime.getHours() - 2);
  const endTime = new Date(now);
  endTime.setHours(endTime.getHours() + 22);

  const items = [
    {
      itemType: 'hotel',
      itemId: 'da-nang-boutique',
      originalPrice: 2500000,
      salePrice: 1500000,
      discountPercent: 40,
      maxQuantity: 15,
      soldCount: 7,
    },
    {
      itemType: 'hotel',
      itemId: 'phu-quoc-resort',
      originalPrice: 4200000,
      salePrice: 2940000,
      discountPercent: 30,
      maxQuantity: 10,
      soldCount: 4,
    },
    {
      itemType: 'flight',
      itemId: 'VJ101',
      originalPrice: 1770000,
      salePrice: 1150000,
      discountPercent: 35,
      maxQuantity: 20,
      soldCount: 12,
    },
    {
      itemType: 'flight',
      itemId: 'QH301',
      originalPrice: 2090000,
      salePrice: 1460000,
      discountPercent: 30,
      maxQuantity: 15,
      soldCount: 8,
    },
    {
      itemType: 'tour',
      itemId: 'phu-quoc-beach-escape',
      originalPrice: 8500000,
      salePrice: 5950000,
      discountPercent: 30,
      maxQuantity: 8,
      soldCount: 3,
    },
    {
      itemType: 'tour',
      itemId: 'central-vietnam-heritage-tour',
      originalPrice: 6800000,
      salePrice: 4760000,
      discountPercent: 30,
      maxQuantity: 12,
      soldCount: 5,
    },
    {
      itemType: 'hotel',
      itemId: 'nha-trang-luxury',
      originalPrice: 3500000,
      salePrice: 2100000,
      discountPercent: 40,
      maxQuantity: 8,
      soldCount: 6,
    },
    {
      itemType: 'flight',
      itemId: 'VN400',
      originalPrice: 1350000,
      salePrice: 945000,
      discountPercent: 30,
      maxQuantity: 25,
      soldCount: 15,
    },
  ];

  for (const item of items) {
    // De-dupe on itemType + itemId
    const existing = await prisma.flashSaleItem.findFirst({
      where: { itemType: item.itemType, itemId: item.itemId },
    });
    if (existing) {
      await prisma.flashSaleItem.update({
        where: { id: existing.id },
        data: { ...item, startTime, endTime, isActive: true },
      });
    } else {
      await prisma.flashSaleItem.create({
        data: { ...item, startTime, endTime, isActive: true },
      });
    }
  }

  console.log(`✓ Flash sale items seeded (${items.length})`);
}

async function seedHotelMultilingual() {
  // Update existing hotels with multilingual content, amenities, and listing data
  const hotelUpdates: Array<{
    namePattern: string;
    nameEn: string;
    nameJa: string;
    descriptionVi: string;
    descriptionEn: string;
    descriptionJa: string;
    address: string;
    starRating: number;
    reviewScore: number;
    reviewCount: number;
    amenities: string[];
    propertyType: string;
    distanceFromCenter: number;
    imageUrls: string[];
    latitude: number;
    longitude: number;
  }> = [
    {
      namePattern: 'Hà Nội Boutique Stay',
      nameEn: 'Hanoi Boutique Stay',
      nameJa: 'ハノイ ブティック ステイ',
      descriptionVi: 'Khách sạn boutique sang trọng giữa lòng phố cổ Hà Nội, gần Hồ Hoàn Kiếm.',
      descriptionEn:
        'Luxury boutique hotel in the heart of Hanoi Old Quarter, near Hoan Kiem Lake.',
      descriptionJa: 'ハノイ旧市街の中心にあるラグジュアリーブティックホテル、ホアンキエム湖近く。',
      address: '25 Hàng Bạc, Hoàn Kiếm, Hà Nội',
      starRating: 4,
      reviewScore: 8.5,
      reviewCount: 234,
      amenities: ['wifi', 'breakfast', 'spa', 'airport-shuttle', 'restaurant'],
      propertyType: 'hotel',
      distanceFromCenter: 0.5,
      imageUrls: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 21.0335,
      longitude: 105.853,
    },
    {
      namePattern: 'Đà Nẵng Boutique Stay',
      nameEn: 'Da Nang Boutique Stay',
      nameJa: 'ダナン ブティック ステイ',
      descriptionVi: 'Resort biển cao cấp với view trực diện bãi biển Mỹ Khê.',
      descriptionEn: 'Premium beachfront resort with direct views of My Khe Beach.',
      descriptionJa: 'ミーケービーチを一望できるプレミアムビーチフロントリゾート。',
      address: 'Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
      starRating: 5,
      reviewScore: 9.1,
      reviewCount: 456,
      amenities: ['wifi', 'pool', 'spa', 'gym', 'beach-access', 'restaurant', 'bar'],
      propertyType: 'resort',
      distanceFromCenter: 3.2,
      imageUrls: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 16.0544,
      longitude: 108.245,
    },
    {
      namePattern: 'Hội An Boutique Stay',
      nameEn: 'Hoi An Boutique Stay',
      nameJa: 'ホイアン ブティック ステイ',
      descriptionVi: 'Khách sạn phong cách cổ điển trong phố cổ Hội An, gần Chùa Cầu.',
      descriptionEn: 'Classic-style hotel in Hoi An Ancient Town, near the Japanese Bridge.',
      descriptionJa: 'ホイアン旧市街にあるクラシックスタイルのホテル、来遠橋近く。',
      address: '10 Trần Phú, Minh An, Hội An',
      starRating: 4,
      reviewScore: 8.8,
      reviewCount: 312,
      amenities: ['wifi', 'breakfast', 'pool', 'bicycle-rental', 'laundry'],
      propertyType: 'hotel',
      distanceFromCenter: 0.3,
      imageUrls: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 15.8794,
      longitude: 108.338,
    },
    {
      namePattern: 'Phú Quốc Boutique Stay',
      nameEn: 'Phu Quoc Boutique Stay',
      nameJa: 'フーコック ブティック ステイ',
      descriptionVi: 'Villa biển riêng tư trên bãi Sao, Phú Quốc với hồ bơi vô cực.',
      descriptionEn: 'Private beach villa on Sao Beach, Phu Quoc with infinity pool.',
      descriptionJa: 'フーコック島サオビーチのプライベートビーチヴィラ、インフィニティプール付き。',
      address: 'Bãi Sao, An Thới, Phú Quốc',
      starRating: 5,
      reviewScore: 9.3,
      reviewCount: 189,
      amenities: ['wifi', 'pool', 'spa', 'beach-access', 'restaurant', 'bar', 'water-sports'],
      propertyType: 'villa',
      distanceFromCenter: 12.5,
      imageUrls: [
        'https://images.unsplash.com/photo-1540202404-a2f29564651f?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 10.0167,
      longitude: 104.0333,
    },
    {
      namePattern: 'Nha Trang Boutique Stay',
      nameEn: 'Nha Trang Boutique Stay',
      nameJa: 'ニャチャン ブティック ステイ',
      descriptionVi: 'Khách sạn 4 sao view biển trung tâm Nha Trang, gần Tháp Bà Ponagar.',
      descriptionEn: '4-star sea-view hotel in central Nha Trang, near Po Nagar Towers.',
      descriptionJa: 'ニャチャン中心部のオーシャンビュー4つ星ホテル、ポーナガル塔近く。',
      address: 'Trần Phú, Lộc Thọ, Nha Trang',
      starRating: 4,
      reviewScore: 8.2,
      reviewCount: 278,
      amenities: ['wifi', 'pool', 'gym', 'restaurant', 'bar', 'parking'],
      propertyType: 'hotel',
      distanceFromCenter: 1.5,
      imageUrls: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 12.2488,
      longitude: 109.1967,
    },
    {
      namePattern: 'Sapa Boutique Stay',
      nameEn: 'Sapa Boutique Stay',
      nameJa: 'サパ ブティック ステイ',
      descriptionVi: 'Homestay view ruộng bậc thang tuyệt đẹp tại Tả Van, Sapa.',
      descriptionEn: 'Homestay with stunning terraced rice field views in Ta Van, Sapa.',
      descriptionJa: 'サパ・ターヴァンの美しい棚田ビューのホームステイ。',
      address: 'Tả Van, Sa Pa, Lào Cai',
      starRating: 3,
      reviewScore: 8.7,
      reviewCount: 156,
      amenities: ['wifi', 'breakfast', 'trekking-guide', 'fireplace', 'mountain-view'],
      propertyType: 'hostel',
      distanceFromCenter: 5.0,
      imageUrls: [
        'https://images.unsplash.com/photo-1573408301185-9519f94f4e8e?auto=format&fit=crop&w=800&q=80',
      ],
      latitude: 22.32,
      longitude: 103.85,
    },
  ];

  let updatedCount = 0;
  for (const h of hotelUpdates) {
    const hotel = await prisma.hotelMock.findFirst({
      where: { name: h.namePattern },
    });
    if (hotel) {
      await prisma.hotelMock.update({
        where: { id: hotel.id },
        data: {
          nameEn: h.nameEn,
          nameJa: h.nameJa,
          descriptionVi: h.descriptionVi,
          descriptionEn: h.descriptionEn,
          descriptionJa: h.descriptionJa,
          address: h.address,
          starRating: h.starRating,
          reviewScore: h.reviewScore,
          reviewCount: h.reviewCount,
          amenities: h.amenities,
          propertyType: h.propertyType,
          distanceFromCenter: h.distanceFromCenter,
          imageUrls: h.imageUrls,
          latitude: h.latitude,
          longitude: h.longitude,
        },
      });
      updatedCount++;
    }
  }

  console.log(`✓ Hotels updated with multilingual data (${updatedCount}/${hotelUpdates.length})`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      '✗ DATABASE_URL is not set. Point it at a reachable PostgreSQL instance before seeding.\n' +
        '  Example: export DATABASE_URL=postgresql://vietwander:vietwander@localhost:5432/vietwander',
    );
    process.exit(1);
  }

  // ---------------- Users ----------------
  const adminPassword = await hash('Admin@123456');
  const userPassword = await hash('User@123456');
  const staffPassword = await hash('Staff@123456');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wanderviet.com' },
    update: {
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'WanderViet Admin',
    },
    create: {
      email: 'admin@wanderviet.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'WanderViet Admin',
      phone: '+84 90 000 0001',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      profile: {
        create: {
          displayName: 'Admin',
          language: 'vi',
          travelStyle: 'World Wanderer',
        },
      },
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@wanderviet.com' },
    update: {
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'Demo Traveler',
    },
    create: {
      email: 'user@wanderviet.com',
      password: userPassword,
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'Demo Traveler',
      phone: '+84 90 000 0002',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      profile: {
        create: {
          displayName: 'Traveler',
          language: 'vi',
          travelStyle: 'Culture Seeker',
        },
      },
    },
  });

  // `staff@wanderviet.com` uses the canonical WanderViet STAFF role
  // (see schema.prisma RoleName — STAFF was added alongside legacy HOST/GUIDE).
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@wanderviet.com' },
    update: {
      password: staffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'WanderViet Staff',
    },
    create: {
      email: 'staff@wanderviet.com',
      password: staffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      emailVerified: true,
      fullName: 'WanderViet Staff',
      phone: '+84 90 000 0003',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      profile: {
        create: {
          displayName: 'Staff',
          language: 'vi',
          travelStyle: 'Family Planner',
        },
      },
    },
  });

  console.log('✓ Users seeded (admin + user + staff)');

  // ---------------- Countries ----------------
  const countryIdByKey = new Map<CountryKey, string>();
  for (const c of COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name },
    });
    countryIdByKey.set(c.key, country.id);
  }

  // ---------------- Cities ----------------
  const cityIdByName = new Map<string, string>();
  for (const c of CITIES) {
    const countryId = countryIdByKey.get(c.countryKey)!;
    const city = await prisma.city.upsert({
      where: { name_countryId: { name: c.name, countryId } },
      update: {},
      create: { name: c.name, countryId },
    });
    cityIdByName.set(`${c.countryKey}:${c.name}`, city.id);
  }

  console.log(`✓ Geography seeded (${COUNTRIES.length} countries, ${CITIES.length} cities)`);

  // ---------------- Destinations ----------------
  const destinationIdBySlug = new Map<string, string>();
  for (const d of DESTINATIONS) {
    const countryId = countryIdByKey.get(d.countryKey)!;
    const cityId = cityIdByName.get(`${d.countryKey}:${d.cityName}`) ?? null;
    const baseImage = DESTINATION_IMAGES[d.slug] ?? FALLBACK_IMAGE;

    const destination = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        countryId,
        cityId,
        description: d.description,
        longDescription: d.longDescription,
        shortDescription: d.shortDescription,
        bestTimeToVisit: d.bestTimeToVisit,
        budgetMin: d.budgetMin,
        budgetMax: d.budgetMax,
        currency: 'VND',
        travelStyles: d.travelStyles,
        latitude: d.latitude,
        longitude: d.longitude,
        safetyLevel: d.safetyLevel,
        cultureNotes: d.cultureNotes,
        foodHighlights: d.foodHighlights,
        isFeatured: d.isFeatured,
        ratingAvg: d.ratingAvg,
        reviewCount: d.reviewCount,
        category: d.category,
        imageUrl: baseImage,
        status: 'ACTIVE',
      },
      create: {
        slug: d.slug,
        name: d.name,
        countryId,
        cityId,
        description: d.description,
        longDescription: d.longDescription,
        shortDescription: d.shortDescription,
        bestTimeToVisit: d.bestTimeToVisit,
        budgetMin: d.budgetMin,
        budgetMax: d.budgetMax,
        currency: 'VND',
        travelStyles: d.travelStyles,
        latitude: d.latitude,
        longitude: d.longitude,
        safetyLevel: d.safetyLevel,
        cultureNotes: d.cultureNotes,
        foodHighlights: d.foodHighlights,
        isFeatured: d.isFeatured,
        ratingAvg: d.ratingAvg,
        reviewCount: d.reviewCount,
        category: d.category,
        imageUrl: baseImage,
        status: 'ACTIVE',
      },
    });

    destinationIdBySlug.set(d.slug, destination.id);
  }

  console.log(`✓ Destinations seeded (${DESTINATIONS.length})`);

  // ---------------- Tours ----------------
  const tourIdBySlug = new Map<string, string>();
  const tourDepartureIds = new Map<string, string[]>();

  for (const t of TOURS) {
    const destinationId = destinationIdBySlug.get(t.destinationSlug);
    if (!destinationId) {
      throw new Error(`Tour ${t.slug}: destination ${t.destinationSlug} not seeded`);
    }
    const tourImage =
      TOUR_IMAGES[t.slug]?.[0] ?? DESTINATION_IMAGES[t.destinationSlug] ?? FALLBACK_IMAGE;

    const tour = await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        destinationId,
        description: t.description,
        shortDescription: t.shortDescription,
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        basePrice: t.basePrice,
        salePrice: t.salePrice ?? null,
        maxGuests: t.maxGuests,
        minGuests: t.minGuests,
        availableSlots: t.availableSlots,
        status: 'ACTIVE',
        featured: t.featured,
        imageUrl: tourImage,
        category: t.category,
      },
      create: {
        slug: t.slug,
        title: t.title,
        destinationId,
        description: t.description,
        shortDescription: t.shortDescription,
        durationDays: t.durationDays,
        durationNights: t.durationNights,
        basePrice: t.basePrice,
        salePrice: t.salePrice ?? null,
        maxGuests: t.maxGuests,
        minGuests: t.minGuests,
        availableSlots: t.availableSlots,
        status: 'ACTIVE',
        featured: t.featured,
        imageUrl: tourImage,
        category: t.category,
      },
    });

    tourIdBySlug.set(t.slug, tour.id);

    // Itinerary — idempotent via composite unique (tourId, dayNumber)
    for (const day of t.itinerary) {
      await prisma.tourItinerary.upsert({
        where: { tourId_dayNumber: { tourId: tour.id, dayNumber: day.dayNumber } },
        update: {
          title: day.title,
          description: day.description,
          meals: day.meals,
          accommodation: day.accommodation,
          activities: day.activities,
        },
        create: {
          tourId: tour.id,
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          meals: day.meals,
          accommodation: day.accommodation,
          activities: day.activities,
        },
      });
    }

    // Tour images (2 per tour — use real Unsplash photos)
    const tourGalleryImages = TOUR_IMAGES[t.slug] ?? [
      DESTINATION_IMAGES[t.destinationSlug] ?? FALLBACK_IMAGE,
      FALLBACK_IMAGE,
    ];
    for (let i = 0; i < tourGalleryImages.length; i++) {
      const imgUrl = tourGalleryImages[i];
      const existing = await prisma.tourImage.findFirst({
        where: { tourId: tour.id, sortOrder: i },
      });
      if (!existing) {
        await prisma.tourImage.create({
          data: {
            tourId: tour.id,
            url: imgUrl,
            altText: `${t.title} — image ${i + 1}`,
            sortOrder: i,
          },
        });
      }
    }

    // Departures — only for selected tours (min 4 per spec)
    if (t.seedDepartures) {
      const ids: string[] = [];
      const offsets = [30, 60, 90];
      for (const offset of offsets) {
        const departureDate = daysFromNow(offset);
        const returnDate = daysFromNow(offset + t.durationDays - 1);
        // No unique constraint on (tourId, departureDate), so look up first
        const existing = await prisma.tourDeparture.findFirst({
          where: { tourId: tour.id, departureDate },
        });
        let dep;
        if (existing) {
          dep = await prisma.tourDeparture.update({
            where: { id: existing.id },
            data: {
              returnDate,
              availableSlots: t.availableSlots,
              status: 'OPEN',
            },
          });
        } else {
          dep = await prisma.tourDeparture.create({
            data: {
              tourId: tour.id,
              departureDate,
              returnDate,
              availableSlots: t.availableSlots,
              status: 'OPEN',
            },
          });
        }
        ids.push(dep.id);
      }
      tourDepartureIds.set(t.slug, ids);
    }
  }

  console.log(
    `✓ Tours seeded (${TOURS.length} tours, ` +
      `${TOURS.filter((t) => t.seedDepartures).length} with departures)`,
  );

  // ---------------- Coupons ----------------
  const now = new Date();
  const validFromPast = new Date(now);
  validFromPast.setDate(validFromPast.getDate() - 10);
  const validToFuture = new Date(now);
  validToFuture.setDate(validToFuture.getDate() + 90);
  const expiredValidTo = new Date(now);
  expiredValidTo.setDate(expiredValidTo.getDate() - 30);

  const couponSummer = await prisma.coupon.upsert({
    where: { code: 'WVWELCOME10' },
    update: {
      description: 'Ưu đãi chào mừng — giảm 10% cho khách hàng mới',
      discountType: 'PERCENT',
      discountValue: 10,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 100,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true,
    },
    create: {
      code: 'WVWELCOME10',
      description: 'Ưu đãi chào mừng — giảm 10% cho khách hàng mới',
      discountType: 'PERCENT',
      discountValue: 10,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 100,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true,
    },
  });

  const couponWelcome = await prisma.coupon.upsert({
    where: { code: 'WV500K' },
    update: {
      description: 'Giảm 500.000đ cho mọi đơn từ 3 triệu',
      discountType: 'FIXED',
      discountValue: 500000,
      minBookingAmount: 3000000,
      usageLimit: null,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true,
    },
    create: {
      code: 'WV500K',
      description: 'Giảm 500.000đ cho mọi đơn từ 3 triệu',
      discountType: 'FIXED',
      discountValue: 500000,
      minBookingAmount: 3000000,
      usageLimit: null,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true,
    },
  });

  const couponExpired = await prisma.coupon.upsert({
    where: { code: 'WVEXPIRED' },
    update: {
      description: 'Mã khuyến mãi đã hết hạn — giữ lại để demo lỗi validation',
      discountType: 'PERCENT',
      discountValue: 20,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 1000,
      validFrom: new Date('2024-01-01T00:00:00.000Z'),
      validTo: expiredValidTo,
      isActive: false,
    },
    create: {
      code: 'WVEXPIRED',
      description: 'Mã khuyến mãi đã hết hạn — giữ lại để demo lỗi validation',
      discountType: 'PERCENT',
      discountValue: 20,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 1000,
      validFrom: new Date('2024-01-01T00:00:00.000Z'),
      validTo: expiredValidTo,
      isActive: false,
    },
  });

  console.log('✓ Coupons seeded (WVWELCOME10, WV500K, WVEXPIRED)');

  // ---------------- Bookings (7 total: 2 PENDING, 3 CONFIRMED, 2 COMPLETED) ----
  interface BookingSeed {
    codeSuffix: string;
    dateStr: string; // YYYYMMDD portion of bookingCode
    tourSlug: string;
    numberOfGuests: number;
    totalAmount: number;
    discountAmount: number;
    paymentMethod: string;
    status: 'pending' | 'confirmed' | 'completed';
    paymentStatus: 'pending' | 'confirmed_mock';
    couponId?: string | null;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    specialRequest?: string;
    userId: string;
    paidDaysAgo?: number;
  }

  const bookings: BookingSeed[] = [
    // 2 PENDING + UNPAID
    {
      codeSuffix: 'AAAAA1',
      dateStr: '20251001',
      tourSlug: 'phu-quoc-beach-escape',
      numberOfGuests: 2,
      totalAmount: 13000000,
      discountAmount: 0,
      paymentMethod: 'MOCK_VNPAY',
      status: 'pending',
      paymentStatus: 'pending',
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      specialRequest: 'Phòng tầng cao, view biển nếu có thể.',
      userId: regularUser.id,
    },
    {
      codeSuffix: 'AAAAA2',
      dateStr: '20251002',
      tourSlug: 'central-vietnam-heritage-tour',
      numberOfGuests: 3,
      totalAmount: 23700000,
      discountAmount: 2000000,
      paymentMethod: 'MOCK_MOMO',
      status: 'pending',
      paymentStatus: 'pending',
      couponId: couponSummer.id,
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      specialRequest: 'Ăn chay cho 1 khách.',
      userId: regularUser.id,
    },
    // 3 CONFIRMED + PAID
    {
      codeSuffix: 'BBBBB1',
      dateStr: '20250920',
      tourSlug: 'northern-vietnam-adventure',
      numberOfGuests: 2,
      totalAmount: 21800000,
      discountAmount: 0,
      paymentMethod: 'MOCK_CARD',
      status: 'confirmed',
      paymentStatus: 'confirmed_mock',
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      userId: regularUser.id,
      paidDaysAgo: 18,
    },
    {
      codeSuffix: 'BBBBB2',
      dateStr: '20250922',
      tourSlug: 'ha-giang-motorbike-adventure',
      numberOfGuests: 4,
      totalAmount: 14800000,
      discountAmount: 500000,
      paymentMethod: 'MOCK_CARD',
      status: 'confirmed',
      paymentStatus: 'confirmed_mock',
      couponId: couponWelcome.id,
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      userId: regularUser.id,
      paidDaysAgo: 15,
    },
    {
      codeSuffix: 'BBBBB3',
      dateStr: '20250925',
      tourSlug: 'bali-luxury-retreat',
      numberOfGuests: 2,
      totalAmount: 49800000,
      discountAmount: 0,
      paymentMethod: 'MOCK_ZALOPAY',
      status: 'confirmed',
      paymentStatus: 'confirmed_mock',
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      specialRequest: 'Kỷ niệm cưới — trang trí phòng lãng mạn.',
      userId: regularUser.id,
      paidDaysAgo: 10,
    },
    // 2 COMPLETED + PAID
    {
      codeSuffix: 'CCCCC1',
      dateStr: '20250801',
      tourSlug: 'thailand-city-island-tour',
      numberOfGuests: 4,
      totalAmount: 34000000,
      discountAmount: 0,
      paymentMethod: 'MOCK_CARD',
      status: 'completed',
      paymentStatus: 'confirmed_mock',
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      userId: regularUser.id,
      paidDaysAgo: 65,
    },
    {
      codeSuffix: 'CCCCC2',
      dateStr: '20250705',
      tourSlug: 'japan-spring-discovery',
      numberOfGuests: 2,
      totalAmount: 71800000,
      discountAmount: 0,
      paymentMethod: 'MOCK_BANK_TRANSFER',
      status: 'completed',
      paymentStatus: 'confirmed_mock',
      contactName: 'Demo Traveler',
      contactEmail: 'user@wanderviet.com',
      contactPhone: '+84 90 000 0002',
      userId: regularUser.id,
      paidDaysAgo: 95,
    },
  ];

  for (const b of bookings) {
    const tourId = tourIdBySlug.get(b.tourSlug);
    if (!tourId) throw new Error(`Booking ${b.codeSuffix}: tour ${b.tourSlug} not seeded`);

    // Pick first departure of that tour (if any); not all tours have departures
    // which is fine — Booking.departureId is nullable.
    const departureIds = tourDepartureIds.get(b.tourSlug) ?? [];
    const departureId = departureIds[0] ?? null;

    const code = bookingCode(b.dateStr, b.codeSuffix);

    const booking = await prisma.booking.upsert({
      where: { bookingCode: code },
      update: {
        userId: b.userId,
        tourId,
        departureId,
        couponId: b.couponId ?? null,
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        discountAmount: b.discountAmount,
        paymentMethod: b.paymentMethod,
        contactName: b.contactName,
        contactEmail: b.contactEmail,
        contactPhone: b.contactPhone,
        numberOfGuests: b.numberOfGuests,
        specialRequest: b.specialRequest ?? null,
        isDemo: true,
      },
      create: {
        bookingCode: code,
        userId: b.userId,
        tourId,
        departureId,
        couponId: b.couponId ?? null,
        status: b.status,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        discountAmount: b.discountAmount,
        paymentMethod: b.paymentMethod,
        contactName: b.contactName,
        contactEmail: b.contactEmail,
        contactPhone: b.contactPhone,
        numberOfGuests: b.numberOfGuests,
        specialRequest: b.specialRequest ?? null,
        isDemo: true,
      },
    });

    // Payment row for CONFIRMED / COMPLETED bookings
    if (b.paymentStatus === 'confirmed_mock') {
      const paidAt = daysFromNow(-(b.paidDaysAgo ?? 1));
      const txnCode = `MOCK-TXN-${b.codeSuffix}`;
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: {
          amount: b.totalAmount - b.discountAmount,
          status: 'confirmed_mock',
          transactionCode: txnCode,
          paidAt,
          provider: b.paymentMethod,
        },
        create: {
          bookingId: booking.id,
          amount: b.totalAmount - b.discountAmount,
          currency: 'VND',
          status: 'confirmed_mock',
          transactionCode: txnCode,
          paidAt,
          provider: b.paymentMethod,
        },
      });
    }
  }

  console.log(`✓ Bookings seeded (${bookings.length} with payments where applicable)`);

  // ---------------- Reviews (5 total — per spec, tied to COMPLETED bookings) ----
  // Note: Review has no unique natural key. Treat "one review per
  // (userId, tourId, title)" as the de-dupe key to stay idempotent.
  interface ReviewSeed {
    userId: string;
    tourSlug: string;
    rating: number;
    title: string;
    content: string;
    status: 'APPROVED' | 'PENDING';
  }

  // The 2 COMPLETED bookings are for:
  //   • thailand-city-island-tour  (regularUser)
  //   • japan-spring-discovery     (regularUser)
  // Per Req 13, only users with a COMPLETED booking may review the tour,
  // so all review seeds below are by regularUser on those two tours.
  const reviews: ReviewSeed[] = [
    {
      userId: regularUser.id,
      tourSlug: 'thailand-city-island-tour',
      rating: 5,
      title: 'Phuket thư giãn, Bangkok sôi động',
      content:
        'Phi Phi Island đẹp như tranh, Bangkok kẹt xe nhưng ẩm thực đường phố bù đắp. Tour WanderViet lo trọn gói, rất yên tâm.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'thailand-city-island-tour',
      rating: 4,
      title: 'Combo Bangkok – Phuket đáng tiền',
      content:
        'Khách sạn ven sông Bangkok rất đẹp, resort Phuket sát biển. Lịch trình hơi gấp ngày 3 di chuyển.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'japan-spring-discovery',
      rating: 5,
      title: 'Sakura đúng mùa — quá tuyệt vời',
      content:
        'Tokyo – Hakone – Kyoto lịch trình hợp lý, ryokan Hakone có onsen riêng, Kinkaku-ji trong nắng xuân thực sự xúc động.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'japan-spring-discovery',
      rating: 4,
      title: 'Chờ duyệt — bài chi tiết hơn',
      content:
        'Mình muốn viết thêm về đồ ăn Kaiseki ở Hakone và chi phí phát sinh tại Akihabara. Bài này sẽ cập nhật thêm ảnh.',
      status: 'PENDING',
    },
    {
      userId: regularUser.id,
      tourSlug: 'thailand-city-island-tour',
      rating: 4,
      title: 'Có vài ý kiến nhỏ',
      content:
        'Tour tốt, nhưng mong WanderViet bố trí thêm thời gian shopping tại Bangkok. Đang cân nhắc sửa bài trước khi công khai.',
      status: 'PENDING',
    },
    // ── Additional reviews (mixed tours, ratings 3-5) ──
    {
      userId: regularUser.id,
      tourSlug: 'nha-trang-diving-adventure',
      rating: 5,
      title: 'Lặn biển Nha Trang tuyệt vời',
      content:
        'San hô đẹp, nước trong vắt, hướng dẫn viên chuyên nghiệp. Vinpearl Land cũng rất vui cho cả gia đình.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'nha-trang-diving-adventure',
      rating: 4,
      title: 'Biển đẹp nhưng hơi đông',
      content:
        'Hòn Mun san hô đẹp nhưng cuối tuần khá đông du khách. Nên đi ngày thường để trải nghiệm tốt hơn.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'hue-imperial-heritage',
      rating: 5,
      title: 'Huế cổ kính và thanh bình',
      content:
        'Đại Nội rộng lớn, lăng Khải Định kiến trúc độc đáo. Ẩm thực cung đình buổi tối rất ấn tượng.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'hue-imperial-heritage',
      rating: 3,
      title: 'Tour hơi ngắn',
      content:
        '3 ngày không đủ để khám phá hết Huế. Mong WanderViet có thêm option 4-5 ngày bao gồm Lăng Cô.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'mekong-delta-discovery',
      rating: 5,
      title: 'Chợ nổi Cái Răng authentic',
      content:
        'Dậy sớm 5h đi chợ nổi, trải nghiệm rất authentic. Vườn trái cây miền Tây trái chín mọng, ăn thoải mái.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'mekong-delta-discovery',
      rating: 4,
      title: 'Miền Tây sông nước đẹp',
      content:
        'Cảnh sông nước rất đẹp, người dân thân thiện. Chỉ tiếc là 2 ngày hơi ngắn, muốn ở thêm.',
      status: 'PENDING',
    },
    {
      userId: regularUser.id,
      tourSlug: 'seoul-k-culture-tour',
      rating: 5,
      title: 'Seoul hiện đại và truyền thống',
      content:
        'Mặc Hanbok chụp ảnh tại Gyeongbokgung rất đẹp. Myeongdong mua sắm mỹ phẩm giá tốt. Korean BBQ ngon tuyệt.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'seoul-k-culture-tour',
      rating: 4,
      title: 'K-culture trải nghiệm thú vị',
      content: 'DMZ tour rất ấn tượng, đảo Nami lãng mạn. Chỉ tiếc không kịp đi Lotte World.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'london-classic-tour',
      rating: 5,
      title: 'London xứng đáng 7 ngày',
      content:
        'British Museum miễn phí mà đồ sộ, West End musical tuyệt vời. Stonehenge day trip rất đáng đi.',
      status: 'APPROVED',
    },
    {
      userId: regularUser.id,
      tourSlug: 'london-classic-tour',
      rating: 3,
      title: 'Đắt nhưng xứng đáng',
      content:
        'Chi phí cao nhưng trải nghiệm tốt. Thời tiết London khó đoán, nên mang áo mưa. Afternoon tea rất thú vị.',
      status: 'PENDING',
    },
  ];

  for (const r of reviews) {
    const tourId = tourIdBySlug.get(r.tourSlug);
    if (!tourId) throw new Error(`Review: tour ${r.tourSlug} not seeded`);

    // Use (userId, tourId, title) composite as de-dupe key since the same
    // user can legitimately review the same tour twice with different titles.
    const existing = await prisma.review.findFirst({
      where: { userId: r.userId, tourId, title: r.title },
    });
    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: r.rating,
          content: r.content,
          status: r.status,
        },
      });
    } else {
      await prisma.review.create({
        data: {
          userId: r.userId,
          tourId,
          title: r.title,
          rating: r.rating,
          content: r.content,
          status: r.status,
        },
      });
    }
  }

  console.log(`✓ Reviews seeded (${reviews.length})`);

  // ---------------- Blog posts ----------------
  for (const p of BLOG_POSTS) {
    const publishedAt =
      p.status === 'PUBLISHED' && p.publishedDaysAgo !== undefined
        ? daysFromNow(-p.publishedDaysAgo)
        : null;
    const coverImageUrl = FALLBACK_IMAGE;

    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImageUrl,
        category: p.category,
        status: p.status,
        authorId: admin.id,
        publishedAt,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImageUrl,
        category: p.category,
        status: p.status,
        authorId: admin.id,
        publishedAt,
      },
    });
  }

  console.log(
    `✓ Blog posts seeded (${BLOG_POSTS.filter((p) => p.status === 'PUBLISHED').length} published, ${
      BLOG_POSTS.filter((p) => p.status === 'DRAFT').length
    } draft)`,
  );

  // ---------------- Contact requests ----------------
  // No natural unique key — de-dupe on (email, message).
  for (const c of CONTACT_REQUESTS) {
    const existing = await prisma.contactRequest.findFirst({
      where: { email: c.email, message: c.message },
    });
    const assigneeId = c.assignToStaff ? staffUser.id : null;
    if (existing) {
      await prisma.contactRequest.update({
        where: { id: existing.id },
        data: {
          name: c.name,
          phone: c.phone,
          destinationInterested: c.destinationInterested,
          status: c.status,
          assignedTo: assigneeId,
          adminNote: c.adminNote ?? null,
        },
      });
    } else {
      await prisma.contactRequest.create({
        data: {
          name: c.name,
          email: c.email,
          phone: c.phone,
          destinationInterested: c.destinationInterested,
          message: c.message,
          status: c.status,
          assignedTo: assigneeId,
          adminNote: c.adminNote ?? null,
        },
      });
    }
  }

  console.log(`✓ Contact requests seeded (${CONTACT_REQUESTS.length})`);

  // =========================================================================
  // TRAVELOKA-STYLE SEED DATA: Airlines, Flights, Promotions, Hotels
  // Implements: Requirements 9.1, 10.1, 10.3, 8.1
  // =========================================================================

  await seedAirlines();
  await seedFlights();
  await seedPromoBanners();
  await seedFlashSaleItems();
  await seedHotelMultilingual();

  // ---------------- Summary ----------------
  const counts = {
    users: await prisma.user.count(),
    countries: await prisma.country.count(),
    cities: await prisma.city.count(),
    destinations: await prisma.destination.count(),
    tours: await prisma.tour.count(),
    tourItineraries: await prisma.tourItinerary.count(),
    tourDepartures: await prisma.tourDeparture.count(),
    tourImages: await prisma.tourImage.count(),
    coupons: await prisma.coupon.count(),
    bookings: await prisma.booking.count(),
    payments: await prisma.payment.count(),
    reviews: await prisma.review.count(),
    blogPosts: await prisma.blogPost.count(),
    contactRequests: await prisma.contactRequest.count(),
    airlines: await prisma.airlineMock.count(),
    flights: await prisma.flightMock.count(),
    promoBanners: await prisma.promoBanner.count(),
    flashSaleItems: await prisma.flashSaleItem.count(),
  };

  console.log('\n=== WanderViet seed summary ===');
  console.table(counts);
  console.log('\nDemo accounts:');
  console.log('  admin@wanderviet.com / Admin@123456 (ADMIN)');
  console.log('  user@wanderviet.com  / User@123456  (USER)');
  console.log('  staff@wanderviet.com / Staff@123456 (STAFF)');
  console.log(
    '\nCoupons: WVWELCOME10 (PERCENT 10%), WV500K (FIXED 500k, unlimited), WVEXPIRED (expired)\n',
  );

  // Reference `Prisma` so it stays in the compiled bundle for downstream
  // consumers that might inspect the namespace. Safe no-op.
  void Prisma;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error('Seed failed:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
