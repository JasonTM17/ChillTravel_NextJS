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

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/client/client";

const SALT_ROUNDS = 12;

function createPrisma(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://vietwander:vietwander@localhost:5432/vietwander";
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrisma();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function image(seed: string, w = 1200, h = 800): string {
  // Stable deterministic demo images — never hits a real CDN in CI, works fine
  // for local frontend preview.
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

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
  { key: "VN", name: "Việt Nam" },
  { key: "ID", name: "Indonesia" },
  { key: "JP", name: "Nhật Bản" },
  { key: "FR", name: "Pháp" },
  { key: "TH", name: "Thái Lan" }
] as const;
type CountryKey = (typeof COUNTRIES)[number]["key"];

const CITIES: Array<{ name: string; countryKey: CountryKey }> = [
  { name: "Quảng Ninh", countryKey: "VN" },
  { name: "Đà Nẵng", countryKey: "VN" },
  { name: "Quảng Nam", countryKey: "VN" },
  { name: "Lào Cai", countryKey: "VN" },
  { name: "Ninh Bình", countryKey: "VN" },
  { name: "Kiên Giang", countryKey: "VN" },
  { name: "Lâm Đồng", countryKey: "VN" },
  { name: "Hà Giang", countryKey: "VN" },
  { name: "Bali", countryKey: "ID" },
  { name: "Tokyo", countryKey: "JP" },
  { name: "Paris", countryKey: "FR" },
  { name: "Bangkok", countryKey: "TH" }
];

// ---------------------------------------------------------------------------
// Destinations (12)
// Content reuses the ChillTravel `@vietwander/shared` seed where possible and
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
    slug: "ha-long-bay",
    name: "Hạ Long Bay",
    countryKey: "VN",
    cityName: "Quảng Ninh",
    shortDescription: "Kỳ quan thiên nhiên với hàng nghìn đảo đá vôi trên mặt nước ngọc bích.",
    description:
      "Hạ Long Bay (Vịnh Hạ Long) là di sản thế giới UNESCO nổi tiếng với hơn 1.600 đảo đá vôi và hang động huyền ảo, phù hợp cho cruise 2N1Đ hoặc 3N2Đ.",
    longDescription:
      "Với mặt nước xanh ngọc, hàng nghìn đảo đá vôi và các hang động kỳ vĩ, Hạ Long Bay mang đến trải nghiệm cruise du thuyền, kayak, lặn ngắm san hô và làng chài cổ. Thời điểm đẹp nhất là từ tháng 10 đến tháng 4 khi trời khô ráo, biển lặng.",
    bestTimeToVisit: "Tháng 10 – tháng 4",
    budgetMin: 1500000,
    budgetMax: 6500000,
    latitude: 20.9101,
    longitude: 107.1839,
    safetyLevel: "high",
    travelStyles: ["beach", "luxury", "culture"],
    cultureNotes: [
      "Tôn trọng nghi thức lên du thuyền — giữ trật tự khi tàu khởi hành.",
      "Không xả rác xuống biển, bảo vệ hệ sinh thái vịnh."
    ],
    foodHighlights: ["Chả mực Hạ Long", "Hàu nướng mỡ hành", "Sá sùng"],
    category: "beach",
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 520
  },
  {
    slug: "da-nang",
    name: "Đà Nẵng",
    countryKey: "VN",
    cityName: "Đà Nẵng",
    shortDescription: "Thành phố biển sôi động với Cầu Vàng, Ngũ Hành Sơn và bãi biển Mỹ Khê.",
    description:
      "Đà Nẵng kết hợp hoàn hảo giữa biển xanh, núi Sơn Trà và kiến trúc đương đại như Cầu Rồng, Cầu Vàng Bà Nà Hills.",
    longDescription:
      "Đà Nẵng là cửa ngõ du lịch miền Trung với bãi biển Mỹ Khê dài 20 km, Ngũ Hành Sơn huyền bí, Bà Nà Hills lãng mạn và ẩm thực đường phố phong phú. Thời điểm lý tưởng là tháng 2 đến tháng 8.",
    bestTimeToVisit: "Tháng 2 – tháng 8",
    budgetMin: 800000,
    budgetMax: 3000000,
    latitude: 16.0544,
    longitude: 108.2022,
    safetyLevel: "high",
    travelStyles: ["beach", "food", "family"],
    cultureNotes: [
      "Cầu Rồng phun lửa tối thứ 7, chủ nhật — đến sớm để có chỗ đẹp.",
      "Tại Ngũ Hành Sơn nên mặc trang phục kín đáo khi vào chùa."
    ],
    foodHighlights: ["Mì Quảng", "Bánh tráng cuốn thịt heo", "Bún chả cá"],
    category: "beach",
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 430
  },
  {
    slug: "hoi-an",
    name: "Hội An",
    countryKey: "VN",
    cityName: "Quảng Nam",
    shortDescription: "Phố cổ đèn lồng với kiến trúc giao thoa Việt – Hoa – Nhật – Pháp.",
    description:
      "Hội An là di sản UNESCO nổi tiếng với phố cổ đèn lồng, sông Hoài lung linh và may đo áo dài truyền thống.",
    longDescription:
      "Dạo phố cổ Hội An về đêm khi hàng nghìn đèn lồng lung linh, thả đèn hoa đăng trên sông Hoài, thử may áo dài và thưởng thức cao lầu, mì Quảng. Tháng 2 – tháng 4 là mùa đẹp nhất với khí hậu khô ráo.",
    bestTimeToVisit: "Tháng 2 – tháng 4",
    budgetMin: 750000,
    budgetMax: 2800000,
    latitude: 15.8801,
    longitude: 108.338,
    safetyLevel: "high",
    travelStyles: ["culture", "food", "couple"],
    cultureNotes: [
      "Mua vé tham quan phố cổ để vào các di tích chính.",
      "Không chụp ảnh trong nhà cổ khi chủ chưa cho phép."
    ],
    foodHighlights: ["Cao lầu", "Bánh mì Phượng", "Hoành thánh chiên"],
    category: "culture",
    isFeatured: true,
    ratingAvg: 4.9,
    reviewCount: 612
  },
  {
    slug: "sapa",
    name: "Sapa",
    countryKey: "VN",
    cityName: "Lào Cai",
    shortDescription: "Ruộng bậc thang mây phủ, trekking bản làng và đỉnh Fansipan.",
    description:
      "Sapa mang vẻ đẹp hùng vĩ của núi rừng Tây Bắc với ruộng bậc thang mùa lúa chín, bản làng dân tộc và đỉnh Fansipan — nóc nhà Đông Dương.",
    longDescription:
      "Trekking qua các bản Cát Cát, Tả Van, Tả Phìn để khám phá văn hoá Mông, Dao. Mùa lúa chín tháng 9 – tháng 10 là thời điểm ruộng bậc thang đẹp nhất. Mùa tuyết (tháng 12 – tháng 2) hấp dẫn với cảnh băng tuyết hiếm có tại Việt Nam.",
    bestTimeToVisit: "Tháng 9 – tháng 11",
    budgetMin: 700000,
    budgetMax: 2600000,
    latitude: 22.3364,
    longitude: 103.8438,
    safetyLevel: "high",
    travelStyles: ["mountain", "culture", "adventure"],
    cultureNotes: [
      "Hỏi trước khi chụp ảnh người dân tộc bản địa.",
      "Chuẩn bị áo ấm đủ — Sapa có thể xuống dưới 5°C vào mùa đông."
    ],
    foodHighlights: ["Thắng cố", "Cá hồi Sapa", "Rau cải mèo"],
    category: "mountain",
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 398
  },
  {
    slug: "ninh-binh",
    name: "Ninh Bình",
    countryKey: "VN",
    cityName: "Ninh Bình",
    shortDescription: "\"Hạ Long trên cạn\" với Tràng An, Tam Cốc và Hang Múa.",
    description:
      "Ninh Bình là điểm đến của dãy núi đá vôi hùng vĩ, sông Ngô Đồng uốn lượn và quần thể di tích Tràng An — di sản thế giới hỗn hợp.",
    longDescription:
      "Chèo thuyền qua Tam Cốc, Tràng An, leo 500 bậc lên Hang Múa ngắm toàn cảnh sông núi, ghé cố đô Hoa Lư và chùa Bái Đính — ngôi chùa lớn nhất Đông Nam Á. Tháng 2 – tháng 5 là mùa đẹp với tiết trời khô mát.",
    bestTimeToVisit: "Tháng 2 – tháng 5",
    budgetMin: 550000,
    budgetMax: 1800000,
    latitude: 20.2506,
    longitude: 105.9745,
    safetyLevel: "high",
    travelStyles: ["nature", "culture", "family"],
    cultureNotes: [
      "Mặc trang phục kín đáo khi vào đền chùa.",
      "Cho thuê xe máy có sẵn tại trung tâm Tam Cốc."
    ],
    foodHighlights: ["Cơm cháy Ninh Bình", "Dê núi tái chanh", "Gỏi cá nhệch"],
    category: "nature",
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 340
  },
  {
    slug: "phu-quoc",
    name: "Phú Quốc",
    countryKey: "VN",
    cityName: "Kiên Giang",
    shortDescription: "Đảo ngọc với bãi Sao, bãi Kem cát trắng và hoàng hôn Dinh Cậu.",
    description:
      "Phú Quốc là hòn đảo lớn nhất Việt Nam với bãi biển cát trắng, làng chài Hàm Ninh và cáp treo dài nhất thế giới đến Hòn Thơm.",
    longDescription:
      "Thả mình trên bãi Sao, bãi Kem cát trắng mịn, lặn biển ngắm san hô tại Hòn Mây Rút, đi cáp treo 7,9 km sang Hòn Thơm, tham quan nhà thùng nước mắm, chợ đêm Dinh Cậu. Mùa khô (tháng 11 – tháng 4) là thời điểm lý tưởng.",
    bestTimeToVisit: "Tháng 11 – tháng 4",
    budgetMin: 1100000,
    budgetMax: 4200000,
    latitude: 10.2899,
    longitude: 103.984,
    safetyLevel: "high",
    travelStyles: ["beach", "luxury", "family"],
    cultureNotes: [
      "Mua nước mắm Phú Quốc chính gốc tại các nhà thùng địa phương.",
      "Không chạm vào san hô khi lặn — hệ sinh thái dễ tổn thương."
    ],
    foodHighlights: ["Gỏi cá trích", "Nhum biển nướng", "Tiêu Phú Quốc"],
    category: "beach",
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 485
  },
  {
    slug: "da-lat",
    name: "Đà Lạt",
    countryKey: "VN",
    cityName: "Lâm Đồng",
    shortDescription: "Thành phố ngàn hoa se lạnh quanh năm với rừng thông và hồ Xuân Hương.",
    description:
      "Đà Lạt mang khí hậu ôn đới, nổi tiếng với rừng thông, thác nước và các trang trại dâu, cà phê. Lý tưởng cho cặp đôi và gia đình.",
    longDescription:
      "Dạo hồ Xuân Hương, check-in Quảng Trường Lâm Viên, thăm Thiền Viện Trúc Lâm, thác Datanla, ga Đà Lạt cổ kính và thưởng thức cà phê tại cà phê trên mây. Tháng 11 – tháng 3 có tiết trời khô, hoa dã quỳ nở vàng.",
    bestTimeToVisit: "Tháng 11 – tháng 3",
    budgetMin: 650000,
    budgetMax: 2400000,
    latitude: 11.9404,
    longitude: 108.4583,
    safetyLevel: "high",
    travelStyles: ["mountain", "couple", "culture"],
    cultureNotes: [
      "Mang áo khoác — nhiệt độ đêm có thể xuống dưới 10°C.",
      "Nhiều quán cà phê view đẹp cần đặt chỗ trước qua mạng xã hội."
    ],
    foodHighlights: ["Lẩu gà lá é", "Bánh căn", "Sữa đậu nành nóng"],
    category: "mountain",
    isFeatured: false,
    ratingAvg: 4.6,
    reviewCount: 412
  },
  {
    slug: "ha-giang",
    name: "Hà Giang",
    countryKey: "VN",
    cityName: "Hà Giang",
    shortDescription: "Cao nguyên đá Đồng Văn, đèo Mã Pí Lèng và mùa tam giác mạch.",
    description:
      "Hà Giang là điểm đến của những cung đường đèo hiểm trở, bản làng dân tộc và cao nguyên đá UNESCO.",
    longDescription:
      "Phượt Hà Giang là hành trình 3 – 4 ngày qua cao nguyên đá Đồng Văn, cột cờ Lũng Cú, đèo Mã Pí Lèng hùng vĩ và dinh vua Mèo. Mùa hoa tam giác mạch tháng 10 – tháng 11 cùng mùa lúa chín tháng 9 là cao điểm đẹp nhất.",
    bestTimeToVisit: "Tháng 9 – tháng 11",
    budgetMin: 700000,
    budgetMax: 2500000,
    latitude: 23.0035,
    longitude: 105.0146,
    safetyLevel: "medium",
    travelStyles: ["adventure", "culture", "mountain"],
    cultureNotes: [
      "Thuê xe máy phải có bằng lái A1 và mũ bảo hiểm chất lượng.",
      "Mang tiền mặt — nhiều bản chưa có ATM."
    ],
    foodHighlights: ["Cháo ấu tẩu", "Thắng dền", "Bánh tam giác mạch"],
    category: "adventure",
    isFeatured: true,
    ratingAvg: 4.7,
    reviewCount: 287
  },
  {
    slug: "bali",
    name: "Bali",
    countryKey: "ID",
    cityName: "Bali",
    shortDescription: "Hòn đảo thiên đường với đền Hindu, ruộng bậc thang và bãi biển surfing.",
    description:
      "Bali là điểm nghỉ dưỡng nổi tiếng của Indonesia với văn hoá Hindu, ruộng bậc thang Tegalalang, đền Tanah Lot và sóng biển Uluwatu.",
    longDescription:
      "Bali mang đến trải nghiệm trọn vẹn: tắm biển tại Kuta, Seminyak, thiền yoga tại Ubud, check-in đền Pura Ulun Danu Bratan, ngắm hoàng hôn Tanah Lot và thưởng thức nasi goreng. Tháng 4 – tháng 10 là mùa khô đẹp nhất.",
    bestTimeToVisit: "Tháng 4 – tháng 10",
    budgetMin: 3500000,
    budgetMax: 12000000,
    latitude: -8.3405,
    longitude: 115.092,
    safetyLevel: "high",
    travelStyles: ["beach", "luxury", "wellness"],
    cultureNotes: [
      "Mặc sarong khi vào đền Hindu.",
      "Tránh đi vào ngày Nyepi — ngày yên lặng toàn đảo."
    ],
    foodHighlights: ["Nasi goreng", "Babi guling", "Satay lilit"],
    category: "beach",
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 724
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    countryKey: "JP",
    cityName: "Tokyo",
    shortDescription: "Siêu đô thị giao thoa truyền thống và công nghệ cao.",
    description:
      "Tokyo là thành phố lớn nhất Nhật Bản, nơi bạn có thể trải nghiệm cả Shibuya hiện đại lẫn đền Senso-ji cổ kính.",
    longDescription:
      "Thăm Shibuya Crossing, tháp Skytree, Akihabara anime, Harajuku thời trang, đền Meiji, cung điện Hoàng gia và thưởng thức sushi tại chợ Toyosu. Mùa hoa anh đào tháng 3 – tháng 4 là thời điểm đáng mơ ước.",
    bestTimeToVisit: "Tháng 3 – tháng 5",
    budgetMin: 4500000,
    budgetMax: 15000000,
    latitude: 35.6762,
    longitude: 139.6503,
    safetyLevel: "high",
    travelStyles: ["city", "culture", "food"],
    cultureNotes: [
      "Không ăn uống khi đi bộ trên đường.",
      "Xếp hàng trật tự khi lên tàu, không nói điện thoại to."
    ],
    foodHighlights: ["Sushi Toyosu", "Ramen", "Wagyu"],
    category: "city",
    isFeatured: true,
    ratingAvg: 4.9,
    reviewCount: 895
  },
  {
    slug: "paris",
    name: "Paris",
    countryKey: "FR",
    cityName: "Paris",
    shortDescription: "Kinh đô ánh sáng với tháp Eiffel, Louvre và sông Seine lãng mạn.",
    description:
      "Paris là biểu tượng lãng mạn với tháp Eiffel, bảo tàng Louvre, nhà thờ Đức Bà và đại lộ Champs-Élysées.",
    longDescription:
      "Ngắm hoàng hôn trên sông Seine, thăm Louvre với Mona Lisa, khám phá Montmartre, leo tháp Eiffel về đêm, thưởng thức croissant tại các tiệm bánh Rue Cler. Tháng 4 – tháng 6 và tháng 9 – tháng 10 là mùa đẹp nhất.",
    bestTimeToVisit: "Tháng 4 – tháng 6 và Tháng 9 – tháng 10",
    budgetMin: 5000000,
    budgetMax: 18000000,
    latitude: 48.8566,
    longitude: 2.3522,
    safetyLevel: "medium",
    travelStyles: ["city", "couple", "culture"],
    cultureNotes: [
      "Nhớ nói \"Bonjour\" khi vào cửa hàng.",
      "Cảnh giác móc túi tại khu vực du lịch đông người."
    ],
    foodHighlights: ["Croissant", "Macaron Ladurée", "Steak frites"],
    category: "city",
    isFeatured: true,
    ratingAvg: 4.8,
    reviewCount: 1024
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    countryKey: "TH",
    cityName: "Bangkok",
    shortDescription: "Thủ đô Thái Lan với chùa vàng, chợ đêm và ẩm thực đường phố.",
    description:
      "Bangkok là trung tâm văn hoá Thái Lan với Wat Arun, Cung điện Hoàng gia và các chợ nổi sôi động.",
    longDescription:
      "Tham quan Cung điện Hoàng gia, Wat Pho với tượng Phật nằm, thưởng thức tom yum tại Khao San, đi chợ nổi Damnoen Saduak và massage Thái truyền thống. Tháng 11 – tháng 2 là mùa khô mát.",
    bestTimeToVisit: "Tháng 11 – tháng 2",
    budgetMin: 1200000,
    budgetMax: 3800000,
    latitude: 13.7563,
    longitude: 100.5018,
    safetyLevel: "medium",
    travelStyles: ["city", "food", "culture"],
    cultureNotes: [
      "Mặc kín vai và đầu gối khi vào chùa.",
      "Không chạm đầu người khác — văn hoá cấm kỵ."
    ],
    foodHighlights: ["Pad Thai", "Tom Yum Goong", "Mango Sticky Rice"],
    category: "city",
    isFeatured: false,
    ratingAvg: 4.6,
    reviewCount: 678
  }
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
    slug: "northern-vietnam-adventure",
    title: "Northern Vietnam Adventure",
    destinationSlug: "sapa",
    shortDescription: "Hành trình 6 ngày khám phá Hà Nội – Hạ Long – Sapa với trekking và cruise.",
    description:
      "Tour 6 ngày 5 đêm khám phá miền Bắc Việt Nam: phố cổ Hà Nội, cruise Vịnh Hạ Long và trekking bản làng Sapa.",
    durationDays: 6,
    durationNights: 5,
    basePrice: 12500000,
    salePrice: 10900000,
    maxGuests: 16,
    minGuests: 2,
    availableSlots: 12,
    featured: true,
    category: "adventure",
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: "Hà Nội — City welcome",
        description: "Đón sân bay Nội Bài, nhận phòng khách sạn, tự do khám phá phố cổ.",
        meals: "Dinner",
        accommodation: "Hanoi Old Quarter 4*",
        activities: "Walking tour phố cổ, hồ Gươm, nhà thờ Lớn"
      },
      {
        dayNumber: 2,
        title: "Hà Nội — Highlights",
        description: "Tham quan lăng Bác, Văn Miếu, Hoàng thành Thăng Long.",
        meals: "Breakfast, Lunch",
        accommodation: "Hanoi Old Quarter 4*",
        activities: "Văn Miếu, chùa Trấn Quốc, cyclo tour"
      },
      {
        dayNumber: 3,
        title: "Hạ Long Bay — Cruise",
        description: "Di chuyển Hạ Long, check-in du thuyền 4*.",
        meals: "Lunch, Dinner",
        accommodation: "Overnight cruise",
        activities: "Hang Sửng Sốt, kayak, thả câu mực đêm"
      },
      {
        dayNumber: 4,
        title: "Hạ Long — Sapa",
        description: "Sáng Tai Chi, về Hà Nội, chuyển xe lên Sapa.",
        meals: "Breakfast, Lunch",
        accommodation: "Sapa boutique hotel",
        activities: "Tai Chi cruise, xe giường nằm Sapa"
      },
      {
        dayNumber: 5,
        title: "Sapa trekking",
        description: "Trekking Cát Cát – Tả Van – Lao Chải.",
        meals: "Breakfast, Lunch",
        accommodation: "Sapa boutique hotel",
        activities: "Trekking 12 km, homestay lunch"
      },
      {
        dayNumber: 6,
        title: "Fansipan — Farewell",
        description: "Cáp treo Fansipan, về Hà Nội, tiễn sân bay.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Fansipan cable car, trở về"
      }
    ]
  },
  {
    slug: "central-vietnam-heritage-tour",
    title: "Central Vietnam Heritage Tour",
    destinationSlug: "hoi-an",
    shortDescription: "5 ngày di sản miền Trung: Huế – Đà Nẵng – Hội An – Mỹ Sơn.",
    description:
      "Khám phá 3 di sản UNESCO miền Trung trong 5 ngày: cố đô Huế, phố cổ Hội An và thánh địa Mỹ Sơn.",
    durationDays: 5,
    durationNights: 4,
    basePrice: 8900000,
    salePrice: 7900000,
    maxGuests: 20,
    minGuests: 2,
    availableSlots: 18,
    featured: true,
    category: "culture",
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrive Huế",
        description: "Đón sân bay Phú Bài, check-in và thăm chùa Thiên Mụ.",
        meals: "Dinner",
        accommodation: "Huế 4* hotel",
        activities: "Chùa Thiên Mụ, sông Hương"
      },
      {
        dayNumber: 2,
        title: "Huế Imperial City",
        description: "Tham quan Đại Nội, lăng Tự Đức, lăng Khải Định.",
        meals: "Breakfast, Lunch",
        accommodation: "Huế 4* hotel",
        activities: "Đại Nội, lăng tẩm"
      },
      {
        dayNumber: 3,
        title: "Huế → Đà Nẵng → Hội An",
        description: "Đèo Hải Vân, Ngũ Hành Sơn, đến Hội An.",
        meals: "Breakfast, Lunch",
        accommodation: "Hội An riverside 4*",
        activities: "Đèo Hải Vân, Non Nước, phố cổ đêm"
      },
      {
        dayNumber: 4,
        title: "Mỹ Sơn & Hội An",
        description: "Sáng tham quan thánh địa Mỹ Sơn, chiều may áo dài.",
        meals: "Breakfast, Lunch",
        accommodation: "Hội An riverside 4*",
        activities: "Mỹ Sơn tour, may áo dài, thả đèn hoa đăng"
      },
      {
        dayNumber: 5,
        title: "Departure",
        description: "Tự do shopping, tiễn sân bay Đà Nẵng.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Shopping, tiễn sân bay"
      }
    ]
  },
  {
    slug: "phu-quoc-beach-escape",
    title: "Phu Quoc Beach Escape",
    destinationSlug: "phu-quoc",
    shortDescription: "4 ngày nghỉ dưỡng Phú Quốc với resort 5* và cáp treo Hòn Thơm.",
    description:
      "Gói nghỉ dưỡng 4N3Đ tại resort 5* bãi biển, bao gồm cáp treo sang Hòn Thơm và tour 4 đảo.",
    durationDays: 4,
    durationNights: 3,
    basePrice: 7500000,
    salePrice: 6500000,
    maxGuests: 24,
    minGuests: 2,
    availableSlots: 20,
    featured: true,
    category: "beach",
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival Phú Quốc",
        description: "Đón sân bay, check-in resort 5* bãi Dài.",
        meals: "Dinner",
        accommodation: "Phú Quốc 5* beach resort",
        activities: "Tự do tắm biển"
      },
      {
        dayNumber: 2,
        title: "Hòn Thơm cable car",
        description: "Đi cáp treo dài nhất thế giới, công viên nước Aquatopia.",
        meals: "Breakfast, Lunch",
        accommodation: "Phú Quốc 5* beach resort",
        activities: "Cáp treo Hòn Thơm, Aquatopia"
      },
      {
        dayNumber: 3,
        title: "4 Islands tour",
        description: "Tour 4 đảo phía Nam, lặn san hô, câu cá.",
        meals: "Breakfast, Lunch",
        accommodation: "Phú Quốc 5* beach resort",
        activities: "Lặn ngắm san hô, câu cá đảo nhỏ"
      },
      {
        dayNumber: 4,
        title: "Departure",
        description: "Check-out, thăm nhà thùng nước mắm, tiễn sân bay.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Nhà thùng nước mắm, shopping"
      }
    ]
  },
  {
    slug: "ha-giang-motorbike-adventure",
    title: "Ha Giang Motorbike Adventure",
    destinationSlug: "ha-giang",
    shortDescription: "3 ngày phượt Hà Giang cao nguyên đá với easy rider chuyên nghiệp.",
    description:
      "Tour phượt Hà Giang 3N2Đ bằng xe máy với easy rider kinh nghiệm, homestay bản làng.",
    durationDays: 3,
    durationNights: 2,
    basePrice: 4200000,
    salePrice: 3700000,
    maxGuests: 12,
    minGuests: 2,
    availableSlots: 10,
    featured: false,
    category: "adventure",
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: "Hà Giang → Yên Minh → Đồng Văn",
        description: "Khởi hành từ TP Hà Giang, qua cổng trời Quản Bạ, đèo Mã Pí Lèng.",
        meals: "Lunch, Dinner",
        accommodation: "Đồng Văn homestay",
        activities: "Cổng trời Quản Bạ, dinh vua Mèo, đèo Mã Pí Lèng"
      },
      {
        dayNumber: 2,
        title: "Cao nguyên đá & Lũng Cú",
        description: "Chinh phục cột cờ Lũng Cú, thăm phố cổ Đồng Văn.",
        meals: "Breakfast, Lunch, Dinner",
        accommodation: "Đồng Văn homestay",
        activities: "Cột cờ Lũng Cú, phố cổ, chợ phiên (nếu vào chủ nhật)"
      },
      {
        dayNumber: 3,
        title: "Mèo Vạc → Hà Giang",
        description: "Về Hà Giang qua đường khác, kết thúc tour.",
        meals: "Breakfast, Lunch",
        accommodation: "—",
        activities: "Sông Nho Quế, hẻm Tu Sản"
      }
    ]
  },
  {
    slug: "bali-luxury-retreat",
    title: "Bali Luxury Retreat",
    destinationSlug: "bali",
    shortDescription: "7 ngày nghỉ dưỡng cao cấp Bali với villa riêng, yoga và spa.",
    description:
      "Trải nghiệm Bali sang trọng trong 7 ngày với villa riêng, yoga sunrise, spa Balinese và tour Ubud.",
    durationDays: 7,
    durationNights: 6,
    basePrice: 28500000,
    salePrice: 24900000,
    maxGuests: 12,
    minGuests: 2,
    availableSlots: 8,
    featured: true,
    category: "luxury",
    seedDepartures: true,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival Denpasar",
        description: "Đón sân bay Ngurah Rai, check-in villa riêng Seminyak.",
        meals: "Dinner",
        accommodation: "Seminyak private villa",
        activities: "Welcome dinner Jimbaran bay"
      },
      {
        dayNumber: 2,
        title: "Seminyak relaxation",
        description: "Spa Balinese, sunset Kuta, tự do.",
        meals: "Breakfast",
        accommodation: "Seminyak private villa",
        activities: "Spa, biển Kuta"
      },
      {
        dayNumber: 3,
        title: "Ubud — yoga & culture",
        description: "Chuyển đến Ubud, yoga sunrise, thăm chợ Ubud.",
        meals: "Breakfast, Dinner",
        accommodation: "Ubud jungle villa",
        activities: "Yoga, Ubud market, Monkey Forest"
      },
      {
        dayNumber: 4,
        title: "Tegalalang rice terrace",
        description: "Thăm ruộng bậc thang, đền Tirta Empul tắm thánh.",
        meals: "Breakfast, Lunch",
        accommodation: "Ubud jungle villa",
        activities: "Tegalalang, Tirta Empul"
      },
      {
        dayNumber: 5,
        title: "Temples & volcanoes",
        description: "Núi lửa Batur sunrise trek, đền Ulun Danu Bratan.",
        meals: "Breakfast, Lunch",
        accommodation: "Ubud jungle villa",
        activities: "Mt Batur, Ulun Danu Bratan"
      },
      {
        dayNumber: 6,
        title: "Tanah Lot & Uluwatu",
        description: "Thăm Tanah Lot, Uluwatu với điệu múa Kecak.",
        meals: "Breakfast, Dinner",
        accommodation: "Seminyak private villa",
        activities: "Tanah Lot, Uluwatu Kecak dance"
      },
      {
        dayNumber: 7,
        title: "Departure",
        description: "Tự do shopping, tiễn sân bay.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Shopping, airport transfer"
      }
    ]
  },
  {
    slug: "japan-spring-discovery",
    title: "Japan Spring Discovery",
    destinationSlug: "tokyo",
    shortDescription: "6 ngày mùa hoa anh đào Nhật Bản: Tokyo – Hakone – Kyoto.",
    description:
      "Ngắm hoa anh đào nở rộ trong 6 ngày khám phá Tokyo hiện đại, suối nước nóng Hakone và Kyoto cổ kính.",
    durationDays: 6,
    durationNights: 5,
    basePrice: 35900000,
    maxGuests: 18,
    minGuests: 4,
    availableSlots: 14,
    featured: true,
    category: "culture",
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: "Tokyo arrival",
        description: "Đón sân bay Narita, chuyển khách sạn Shinjuku.",
        meals: "Dinner",
        accommodation: "Tokyo Shinjuku 4*",
        activities: "Shinjuku dạo đêm"
      },
      {
        dayNumber: 2,
        title: "Tokyo classic",
        description: "Asakusa Senso-ji, Skytree, Akihabara, Shibuya.",
        meals: "Breakfast, Lunch",
        accommodation: "Tokyo Shinjuku 4*",
        activities: "Senso-ji, Skytree, Shibuya crossing"
      },
      {
        dayNumber: 3,
        title: "Mt Fuji & Hakone",
        description: "Lake Ashi cruise, Hakone ropeway, onsen.",
        meals: "Breakfast, Kaiseki Dinner",
        accommodation: "Hakone ryokan",
        activities: "Owakudani, Hakone ropeway, onsen"
      },
      {
        dayNumber: 4,
        title: "Kyoto shinkansen",
        description: "Tàu cao tốc đến Kyoto, Kinkaku-ji, Fushimi Inari.",
        meals: "Breakfast, Lunch",
        accommodation: "Kyoto 4* hotel",
        activities: "Kinkaku-ji, Fushimi Inari shrine"
      },
      {
        dayNumber: 5,
        title: "Arashiyama & Gion",
        description: "Rừng trúc Arashiyama, phố Gion geisha.",
        meals: "Breakfast",
        accommodation: "Kyoto 4* hotel",
        activities: "Arashiyama bamboo, Gion walk"
      },
      {
        dayNumber: 6,
        title: "Return Tokyo departure",
        description: "Về Tokyo, tiễn sân bay.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Shinkansen, airport transfer"
      }
    ]
  },
  {
    slug: "thailand-city-island-tour",
    title: "Thailand City & Island Tour",
    destinationSlug: "bangkok",
    shortDescription: "5 ngày combo Bangkok – Phuket với chùa vàng và đảo Phi Phi.",
    description:
      "Combo 5N4Đ khám phá Bangkok sôi động và nghỉ dưỡng đảo Phuket với tour Phi Phi.",
    durationDays: 5,
    durationNights: 4,
    basePrice: 9900000,
    salePrice: 8500000,
    maxGuests: 22,
    minGuests: 2,
    availableSlots: 16,
    featured: false,
    category: "beach",
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: "Bangkok arrival",
        description: "Đón sân bay Suvarnabhumi, check-in, chợ đêm Asiatique.",
        meals: "Dinner",
        accommodation: "Bangkok 4* riverside",
        activities: "Asiatique Riverfront"
      },
      {
        dayNumber: 2,
        title: "Bangkok temples",
        description: "Cung điện Hoàng gia, Wat Pho, Wat Arun.",
        meals: "Breakfast, Lunch",
        accommodation: "Bangkok 4* riverside",
        activities: "Grand Palace, Wat Pho, Wat Arun"
      },
      {
        dayNumber: 3,
        title: "Bangkok → Phuket",
        description: "Bay sang Phuket, nhận phòng beach resort.",
        meals: "Breakfast",
        accommodation: "Phuket 4* beach resort",
        activities: "Patong beach, Bangla Road"
      },
      {
        dayNumber: 4,
        title: "Phi Phi islands",
        description: "Speedboat Phi Phi, vịnh Maya, lặn ngắm san hô.",
        meals: "Breakfast, Lunch",
        accommodation: "Phuket 4* beach resort",
        activities: "Maya Bay, Phi Phi Don, snorkeling"
      },
      {
        dayNumber: 5,
        title: "Departure",
        description: "Tự do, tiễn sân bay Phuket.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Shopping, sân bay"
      }
    ]
  },
  {
    slug: "europe-romantic-journey",
    title: "Europe Romantic Journey",
    destinationSlug: "paris",
    shortDescription: "7 ngày Pháp – Ý – Thụy Sĩ lãng mạn dành cho cặp đôi.",
    description:
      "Hành trình 7 ngày Châu Âu lãng mạn: Paris kinh đô ánh sáng, Lucerne thơ mộng và Venice trên mặt nước.",
    durationDays: 7,
    durationNights: 6,
    basePrice: 58900000,
    maxGuests: 16,
    minGuests: 4,
    availableSlots: 10,
    featured: true,
    category: "luxury",
    seedDepartures: false,
    itinerary: [
      {
        dayNumber: 1,
        title: "Paris arrival",
        description: "Đón Charles de Gaulle, nhận phòng, Seine cruise.",
        meals: "Dinner",
        accommodation: "Paris 4* boutique",
        activities: "Seine cruise, Eiffel đêm"
      },
      {
        dayNumber: 2,
        title: "Paris classic",
        description: "Louvre, Notre Dame, Champs-Élysées.",
        meals: "Breakfast",
        accommodation: "Paris 4* boutique",
        activities: "Louvre, Arc de Triomphe, Champs-Élysées"
      },
      {
        dayNumber: 3,
        title: "Paris → Lucerne",
        description: "Tàu cao tốc TGV sang Thụy Sĩ, nhận phòng Lucerne.",
        meals: "Breakfast",
        accommodation: "Lucerne 4*",
        activities: "Chapel Bridge, Lake Lucerne"
      },
      {
        dayNumber: 4,
        title: "Mt Titlis",
        description: "Cáp treo Mt Titlis, snow experience.",
        meals: "Breakfast, Lunch",
        accommodation: "Lucerne 4*",
        activities: "Mt Titlis rotating cable car"
      },
      {
        dayNumber: 5,
        title: "Lucerne → Venice",
        description: "Di chuyển tàu qua Alps, đến Venice tối.",
        meals: "Breakfast",
        accommodation: "Venice 4* canal view",
        activities: "Dinner tại khu Cannaregio"
      },
      {
        dayNumber: 6,
        title: "Venice gondola",
        description: "St Mark's Square, gondola ride, đảo Murano.",
        meals: "Breakfast, Lunch",
        accommodation: "Venice 4* canal view",
        activities: "St Mark's, gondola, Murano glass"
      },
      {
        dayNumber: 7,
        title: "Departure",
        description: "Tiễn sân bay Marco Polo.",
        meals: "Breakfast",
        accommodation: "—",
        activities: "Airport transfer"
      }
    ]
  }
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
  status: "PUBLISHED" | "DRAFT";
  /// Days in the past (for PUBLISHED posts only)
  publishedDaysAgo?: number;
}

const BLOG_POSTS: BlogPostSeed[] = [
  {
    slug: "top-10-diem-den-viet-nam-2025",
    title: "Top 10 điểm đến Việt Nam nhất định phải ghé năm 2025",
    excerpt: "Khám phá những điểm đến đỉnh cao của Việt Nam, từ vịnh Hạ Long kỳ vĩ đến đảo ngọc Phú Quốc.",
    content:
      "# Top 10 điểm đến Việt Nam 2025\n\nNăm 2025 là thời điểm lý tưởng để khám phá Việt Nam. Bài viết này điểm qua 10 địa điểm hot nhất: Hạ Long, Đà Nẵng, Hội An, Sapa, Ninh Bình, Phú Quốc, Đà Lạt, Hà Giang, Huế và Nha Trang.\n\n## 1. Hạ Long Bay\nDi sản UNESCO với hàng nghìn đảo đá vôi...",
    category: "guide",
    status: "PUBLISHED",
    publishedDaysAgo: 45
  },
  {
    slug: "huong-dan-phuot-ha-giang-mua-hoa-tam-giac-mach",
    title: "Hướng dẫn phượt Hà Giang mùa hoa tam giác mạch",
    excerpt: "Cẩm nang chi tiết phượt Hà Giang 3 ngày 2 đêm mùa hoa tam giác mạch tháng 10 – tháng 11.",
    content:
      "# Phượt Hà Giang mùa hoa tam giác mạch\n\nTháng 10 – tháng 11 là thời điểm hoa tam giác mạch nở rộ trên cao nguyên đá Đồng Văn...",
    category: "adventure",
    status: "PUBLISHED",
    publishedDaysAgo: 30
  },
  {
    slug: "bi-quyet-checkin-hoi-an-phim-truong",
    title: "Bí quyết check-in Hội An đẹp như phim",
    excerpt: "5 góc chụp ảnh đỉnh cao tại phố cổ Hội An và gợi ý áo dài màu sắc phù hợp.",
    content:
      "# Check-in Hội An đẹp như phim\n\nHội An với đèn lồng rực rỡ và tường vàng cổ kính là thiên đường sống ảo...",
    category: "tips",
    status: "PUBLISHED",
    publishedDaysAgo: 20
  },
  {
    slug: "am-thuc-da-nang-must-try",
    title: "10 món ăn đường phố phải thử khi đến Đà Nẵng",
    excerpt: "Từ mì Quảng đến bánh tráng cuốn thịt heo, hướng dẫn ẩm thực Đà Nẵng trọn vẹn.",
    content:
      "# Ẩm thực Đà Nẵng\n\nMì Quảng, bún chả cá, bánh tráng cuốn thịt heo, chè xoa xoa hạt lựu...",
    category: "food",
    status: "PUBLISHED",
    publishedDaysAgo: 14
  },
  {
    slug: "cam-nang-du-lich-bali-7-ngay",
    title: "Cẩm nang du lịch Bali 7 ngày cho người mới",
    excerpt: "Lịch trình 7 ngày khám phá Bali trọn vẹn với giá hợp lý và trải nghiệm chất lượng.",
    content:
      "# Du lịch Bali 7 ngày\n\nBali là thiên đường nghỉ dưỡng với đền Hindu, yoga Ubud, biển Uluwatu và nasi goreng...",
    category: "guide",
    status: "PUBLISHED",
    publishedDaysAgo: 7
  },
  {
    slug: "di-tokyo-mua-hoa-anh-dao-can-biet-gi",
    title: "Đi Tokyo mùa hoa anh đào cần biết gì?",
    excerpt: "Những điều cần chuẩn bị và lưu ý khi du lịch Tokyo mùa Sakura tháng 3 – 4.",
    content:
      "# Tokyo mùa Sakura\n\nMùa hoa anh đào tháng 3 – 4 là thời điểm đẹp nhất để đến Tokyo. Bài viết chia sẻ visa, chỗ ở, địa điểm ngắm hoa và lịch trình 5 ngày...",
    category: "guide",
    status: "PUBLISHED",
    publishedDaysAgo: 3
  },
  {
    slug: "kinh-nghiem-di-paris-lan-dau",
    title: "Kinh nghiệm đi Paris lần đầu",
    excerpt: "Tất cả những điều bạn cần biết trước chuyến đi Paris đầu tiên: visa, chi phí, an ninh.",
    content:
      "# Paris lần đầu — cần biết gì?\n\nParis lãng mạn nhưng cũng có những điều cần lưu ý về visa Schengen, ngân sách, các điểm tránh vào ban đêm...",
    category: "guide",
    status: "DRAFT"
  },
  {
    slug: "review-tour-sapa-mua-lua-chin-2025",
    title: "Review tour Sapa mùa lúa chín 2025",
    excerpt: "Trải nghiệm thực tế tour Sapa 3 ngày 2 đêm với WanderViet, đánh giá chất lượng dịch vụ.",
    content:
      "# Review tour Sapa — mùa lúa chín\n\nChuyến đi Sapa 3N2Đ với WanderViet mang lại trải nghiệm tuyệt vời. Đây là review chi tiết dịch vụ, ăn uống và lịch trình...",
    category: "review",
    status: "DRAFT"
  }
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
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  assignToStaff: boolean;
  adminNote?: string;
}

const CONTACT_REQUESTS: ContactSeed[] = [
  {
    name: "Nguyễn Thu Hà",
    email: "thuha@example.com",
    phone: "0901234567",
    destinationInterested: "phu-quoc",
    message: "Chào shop, gia đình 4 người muốn đi Phú Quốc 4N3Đ dịp tháng 12, cho tôi gợi ý tour và giá.",
    status: "NEW",
    assignToStaff: false
  },
  {
    name: "Trần Minh Anh",
    email: "minhanh.tran@example.com",
    phone: "0912345678",
    destinationInterested: "sapa",
    message: "Tôi muốn đặt tour Sapa 3 ngày cho nhóm 6 người vào cuối tháng 10. Có combo nào không?",
    status: "NEW",
    assignToStaff: false
  },
  {
    name: "Lê Hoàng Nam",
    email: "hoangnam.le@example.com",
    phone: "0923456789",
    destinationInterested: "bali",
    message: "Cặp đôi cần báo giá tour Bali Luxury Retreat khởi hành tháng 3/2026.",
    status: "IN_PROGRESS",
    assignToStaff: true,
    adminNote: "Đã gửi báo giá qua email, đang chờ khách xác nhận ngày khởi hành."
  },
  {
    name: "Phạm Thuỷ Tiên",
    email: "thuytien.pham@example.com",
    phone: "0934567890",
    destinationInterested: "ha-giang",
    message: "Em muốn đi Hà Giang phượt nhưng chưa biết cần chuẩn bị gì, tư vấn giúp em với.",
    status: "IN_PROGRESS",
    assignToStaff: true,
    adminNote: "Đang gửi checklist đồ cần mang và giới thiệu easy rider."
  },
  {
    name: "Võ Quốc Tuấn",
    email: "quoctuan.vo@example.com",
    phone: "0945678901",
    destinationInterested: "paris",
    message: "Đã đặt tour Europe Romantic Journey, cảm ơn đội ngũ WanderViet hỗ trợ visa nhanh.",
    status: "RESOLVED",
    assignToStaff: true,
    adminNote: "Tour đã khởi hành thành công, khách hài lòng — đã xin feedback qua email."
  },
  {
    name: "Đặng Hải Yến",
    email: "haiyen.dang@example.com",
    phone: "0956789012",
    destinationInterested: "tokyo",
    message: "Mình đã đặt tour Nhật Bản qua đơn vị khác, cảm ơn đã tư vấn.",
    status: "CLOSED",
    assignToStaff: true,
    adminNote: "Khách đã chọn nhà cung cấp khác — đóng yêu cầu."
  }
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "✗ DATABASE_URL is not set. Point it at a reachable PostgreSQL instance before seeding.\n" +
        "  Example: export DATABASE_URL=postgresql://vietwander:vietwander@localhost:5432/vietwander"
    );
    process.exit(1);
  }

  // ---------------- Users ----------------
  const adminPassword = await hash("Admin@123456");
  const userPassword = await hash("User@123456");
  const staffPassword = await hash("Staff@123456");

  const admin = await prisma.user.upsert({
    where: { email: "admin@wanderviet.com" },
    update: {
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "WanderViet Admin"
    },
    create: {
      email: "admin@wanderviet.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "WanderViet Admin",
      phone: "+84 90 000 0001",
      avatarUrl: image("admin-avatar", 256, 256),
      profile: {
        create: {
          displayName: "Admin",
          language: "vi",
          travelStyle: "World Wanderer"
        }
      }
    }
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@wanderviet.com" },
    update: {
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "Demo Traveler"
    },
    create: {
      email: "user@wanderviet.com",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "Demo Traveler",
      phone: "+84 90 000 0002",
      avatarUrl: image("user-avatar", 256, 256),
      profile: {
        create: {
          displayName: "Traveler",
          language: "vi",
          travelStyle: "Culture Seeker"
        }
      }
    }
  });

  // `staff@wanderviet.com` uses the canonical WanderViet STAFF role
  // (see schema.prisma RoleName — STAFF was added alongside legacy HOST/GUIDE).
  const staffUser = await prisma.user.upsert({
    where: { email: "staff@wanderviet.com" },
    update: {
      password: staffPassword,
      role: "STAFF",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "WanderViet Staff"
    },
    create: {
      email: "staff@wanderviet.com",
      password: staffPassword,
      role: "STAFF",
      status: "ACTIVE",
      emailVerified: true,
      fullName: "WanderViet Staff",
      phone: "+84 90 000 0003",
      avatarUrl: image("staff-avatar", 256, 256),
      profile: {
        create: {
          displayName: "Staff",
          language: "vi",
          travelStyle: "Family Planner"
        }
      }
    }
  });

  console.log("✓ Users seeded (admin + user + staff)");

  // ---------------- Countries ----------------
  const countryIdByKey = new Map<CountryKey, string>();
  for (const c of COUNTRIES) {
    const country = await prisma.country.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name }
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
      create: { name: c.name, countryId }
    });
    cityIdByName.set(`${c.countryKey}:${c.name}`, city.id);
  }

  console.log(`✓ Geography seeded (${COUNTRIES.length} countries, ${CITIES.length} cities)`);

  // ---------------- Destinations ----------------
  const destinationIdBySlug = new Map<string, string>();
  for (const d of DESTINATIONS) {
    const countryId = countryIdByKey.get(d.countryKey)!;
    const cityId = cityIdByName.get(`${d.countryKey}:${d.cityName}`) ?? null;
    const baseImage = image(d.slug);

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
        currency: "VND",
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
        status: "ACTIVE"
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
        currency: "VND",
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
        status: "ACTIVE"
      }
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
    const tourImage = image(`tour-${t.slug}`);

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
        status: "ACTIVE",
        featured: t.featured,
        imageUrl: tourImage,
        category: t.category
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
        status: "ACTIVE",
        featured: t.featured,
        imageUrl: tourImage,
        category: t.category
      }
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
          activities: day.activities
        },
        create: {
          tourId: tour.id,
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          meals: day.meals,
          accommodation: day.accommodation,
          activities: day.activities
        }
      });
    }

    // Tour images (2 per tour)
    for (let i = 0; i < 2; i++) {
      const imgSlug = `tour-${t.slug}-${i}`;
      const imgUrl = image(imgSlug);
      // upsert-by-url-ish: TourImage has no unique constraint, so we wipe and
      // re-create deterministically.
      const existing = await prisma.tourImage.findFirst({
        where: { tourId: tour.id, url: imgUrl }
      });
      if (!existing) {
        await prisma.tourImage.create({
          data: {
            tourId: tour.id,
            url: imgUrl,
            altText: `${t.title} — image ${i + 1}`,
            sortOrder: i
          }
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
          where: { tourId: tour.id, departureDate }
        });
        let dep;
        if (existing) {
          dep = await prisma.tourDeparture.update({
            where: { id: existing.id },
            data: {
              returnDate,
              availableSlots: t.availableSlots,
              status: "OPEN"
            }
          });
        } else {
          dep = await prisma.tourDeparture.create({
            data: {
              tourId: tour.id,
              departureDate,
              returnDate,
              availableSlots: t.availableSlots,
              status: "OPEN"
            }
          });
        }
        ids.push(dep.id);
      }
      tourDepartureIds.set(t.slug, ids);
    }
  }

  console.log(
    `✓ Tours seeded (${TOURS.length} tours, ` +
      `${TOURS.filter((t) => t.seedDepartures).length} with departures)`
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
    where: { code: "WVWELCOME10" },
    update: {
      description: "Ưu đãi chào mừng — giảm 10% cho khách hàng mới",
      discountType: "PERCENT",
      discountValue: 10,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 100,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true
    },
    create: {
      code: "WVWELCOME10",
      description: "Ưu đãi chào mừng — giảm 10% cho khách hàng mới",
      discountType: "PERCENT",
      discountValue: 10,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 100,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true
    }
  });

  const couponWelcome = await prisma.coupon.upsert({
    where: { code: "WV500K" },
    update: {
      description: "Giảm 500.000đ cho mọi đơn từ 3 triệu",
      discountType: "FIXED",
      discountValue: 500000,
      minBookingAmount: 3000000,
      usageLimit: null,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true
    },
    create: {
      code: "WV500K",
      description: "Giảm 500.000đ cho mọi đơn từ 3 triệu",
      discountType: "FIXED",
      discountValue: 500000,
      minBookingAmount: 3000000,
      usageLimit: null,
      validFrom: validFromPast,
      validTo: validToFuture,
      isActive: true
    }
  });

  const couponExpired = await prisma.coupon.upsert({
    where: { code: "WVEXPIRED" },
    update: {
      description: "Mã khuyến mãi đã hết hạn — giữ lại để demo lỗi validation",
      discountType: "PERCENT",
      discountValue: 20,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 1000,
      validFrom: new Date("2024-01-01T00:00:00.000Z"),
      validTo: expiredValidTo,
      isActive: false
    },
    create: {
      code: "WVEXPIRED",
      description: "Mã khuyến mãi đã hết hạn — giữ lại để demo lỗi validation",
      discountType: "PERCENT",
      discountValue: 20,
      minBookingAmount: 1000000,
      maxDiscountAmount: 2000000,
      usageLimit: 1000,
      validFrom: new Date("2024-01-01T00:00:00.000Z"),
      validTo: expiredValidTo,
      isActive: false
    }
  });

  console.log("✓ Coupons seeded (WVWELCOME10, WV500K, WVEXPIRED)");

  // ---------------- Bookings (7 total: 2 PENDING, 3 CONFIRMED, 2 COMPLETED) ----
  interface BookingSeed {
    codeSuffix: string;
    dateStr: string; // YYYYMMDD portion of bookingCode
    tourSlug: string;
    numberOfGuests: number;
    totalAmount: number;
    discountAmount: number;
    paymentMethod: string;
    status: "pending" | "confirmed" | "completed";
    paymentStatus: "pending" | "confirmed_mock";
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
      codeSuffix: "AAAAA1",
      dateStr: "20251001",
      tourSlug: "phu-quoc-beach-escape",
      numberOfGuests: 2,
      totalAmount: 13000000,
      discountAmount: 0,
      paymentMethod: "MOCK_VNPAY",
      status: "pending",
      paymentStatus: "pending",
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      specialRequest: "Phòng tầng cao, view biển nếu có thể.",
      userId: regularUser.id
    },
    {
      codeSuffix: "AAAAA2",
      dateStr: "20251002",
      tourSlug: "central-vietnam-heritage-tour",
      numberOfGuests: 3,
      totalAmount: 23700000,
      discountAmount: 2000000,
      paymentMethod: "MOCK_MOMO",
      status: "pending",
      paymentStatus: "pending",
      couponId: couponSummer.id,
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      specialRequest: "Ăn chay cho 1 khách.",
      userId: regularUser.id
    },
    // 3 CONFIRMED + PAID
    {
      codeSuffix: "BBBBB1",
      dateStr: "20250920",
      tourSlug: "northern-vietnam-adventure",
      numberOfGuests: 2,
      totalAmount: 21800000,
      discountAmount: 0,
      paymentMethod: "MOCK_CARD",
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      userId: regularUser.id,
      paidDaysAgo: 18
    },
    {
      codeSuffix: "BBBBB2",
      dateStr: "20250922",
      tourSlug: "ha-giang-motorbike-adventure",
      numberOfGuests: 4,
      totalAmount: 14800000,
      discountAmount: 500000,
      paymentMethod: "MOCK_CARD",
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      couponId: couponWelcome.id,
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      userId: regularUser.id,
      paidDaysAgo: 15
    },
    {
      codeSuffix: "BBBBB3",
      dateStr: "20250925",
      tourSlug: "bali-luxury-retreat",
      numberOfGuests: 2,
      totalAmount: 49800000,
      discountAmount: 0,
      paymentMethod: "MOCK_ZALOPAY",
      status: "confirmed",
      paymentStatus: "confirmed_mock",
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      specialRequest: "Kỷ niệm cưới — trang trí phòng lãng mạn.",
      userId: regularUser.id,
      paidDaysAgo: 10
    },
    // 2 COMPLETED + PAID
    {
      codeSuffix: "CCCCC1",
      dateStr: "20250801",
      tourSlug: "thailand-city-island-tour",
      numberOfGuests: 4,
      totalAmount: 34000000,
      discountAmount: 0,
      paymentMethod: "MOCK_CARD",
      status: "completed",
      paymentStatus: "confirmed_mock",
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      userId: regularUser.id,
      paidDaysAgo: 65
    },
    {
      codeSuffix: "CCCCC2",
      dateStr: "20250705",
      tourSlug: "japan-spring-discovery",
      numberOfGuests: 2,
      totalAmount: 71800000,
      discountAmount: 0,
      paymentMethod: "MOCK_BANK_TRANSFER",
      status: "completed",
      paymentStatus: "confirmed_mock",
      contactName: "Demo Traveler",
      contactEmail: "user@wanderviet.com",
      contactPhone: "+84 90 000 0002",
      userId: regularUser.id,
      paidDaysAgo: 95
    }
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
        isDemo: true
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
        isDemo: true
      }
    });

    // Payment row for CONFIRMED / COMPLETED bookings
    if (b.paymentStatus === "confirmed_mock") {
      const paidAt = daysFromNow(-(b.paidDaysAgo ?? 1));
      const txnCode = `MOCK-TXN-${b.codeSuffix}`;
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: {
          amount: b.totalAmount - b.discountAmount,
          status: "confirmed_mock",
          transactionCode: txnCode,
          paidAt,
          provider: b.paymentMethod
        },
        create: {
          bookingId: booking.id,
          amount: b.totalAmount - b.discountAmount,
          currency: "VND",
          status: "confirmed_mock",
          transactionCode: txnCode,
          paidAt,
          provider: b.paymentMethod
        }
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
    status: "APPROVED" | "PENDING";
  }

  // The 2 COMPLETED bookings are for:
  //   • thailand-city-island-tour  (regularUser)
  //   • japan-spring-discovery     (regularUser)
  // Per Req 13, only users with a COMPLETED booking may review the tour,
  // so all review seeds below are by regularUser on those two tours.
  const reviews: ReviewSeed[] = [
    {
      userId: regularUser.id,
      tourSlug: "thailand-city-island-tour",
      rating: 5,
      title: "Phuket thư giãn, Bangkok sôi động",
      content:
        "Phi Phi Island đẹp như tranh, Bangkok kẹt xe nhưng ẩm thực đường phố bù đắp. Tour WanderViet lo trọn gói, rất yên tâm.",
      status: "APPROVED"
    },
    {
      userId: regularUser.id,
      tourSlug: "thailand-city-island-tour",
      rating: 4,
      title: "Combo Bangkok – Phuket đáng tiền",
      content:
        "Khách sạn ven sông Bangkok rất đẹp, resort Phuket sát biển. Lịch trình hơi gấp ngày 3 di chuyển.",
      status: "APPROVED"
    },
    {
      userId: regularUser.id,
      tourSlug: "japan-spring-discovery",
      rating: 5,
      title: "Sakura đúng mùa — quá tuyệt vời",
      content:
        "Tokyo – Hakone – Kyoto lịch trình hợp lý, ryokan Hakone có onsen riêng, Kinkaku-ji trong nắng xuân thực sự xúc động.",
      status: "APPROVED"
    },
    {
      userId: regularUser.id,
      tourSlug: "japan-spring-discovery",
      rating: 4,
      title: "Chờ duyệt — bài chi tiết hơn",
      content:
        "Mình muốn viết thêm về đồ ăn Kaiseki ở Hakone và chi phí phát sinh tại Akihabara. Bài này sẽ cập nhật thêm ảnh.",
      status: "PENDING"
    },
    {
      userId: regularUser.id,
      tourSlug: "thailand-city-island-tour",
      rating: 4,
      title: "Có vài ý kiến nhỏ",
      content:
        "Tour tốt, nhưng mong WanderViet bố trí thêm thời gian shopping tại Bangkok. Đang cân nhắc sửa bài trước khi công khai.",
      status: "PENDING"
    }
  ];

  for (const r of reviews) {
    const tourId = tourIdBySlug.get(r.tourSlug);
    if (!tourId) throw new Error(`Review: tour ${r.tourSlug} not seeded`);

    // Use (userId, tourId, title) composite as de-dupe key since the same
    // user can legitimately review the same tour twice with different titles.
    const existing = await prisma.review.findFirst({
      where: { userId: r.userId, tourId, title: r.title }
    });
    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: r.rating,
          content: r.content,
          status: r.status
        }
      });
    } else {
      await prisma.review.create({
        data: {
          userId: r.userId,
          tourId,
          title: r.title,
          rating: r.rating,
          content: r.content,
          status: r.status
        }
      });
    }
  }

  console.log(`✓ Reviews seeded (${reviews.length})`);

  // ---------------- Blog posts ----------------
  for (const p of BLOG_POSTS) {
    const publishedAt =
      p.status === "PUBLISHED" && p.publishedDaysAgo !== undefined
        ? daysFromNow(-p.publishedDaysAgo)
        : null;
    const coverImageUrl = image(`blog-${p.slug}`, 1200, 600);

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
        publishedAt
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
        publishedAt
      }
    });
  }

  console.log(
    `✓ Blog posts seeded (${BLOG_POSTS.filter((p) => p.status === "PUBLISHED").length} published, ${
      BLOG_POSTS.filter((p) => p.status === "DRAFT").length
    } draft)`
  );

  // ---------------- Contact requests ----------------
  // No natural unique key — de-dupe on (email, message).
  for (const c of CONTACT_REQUESTS) {
    const existing = await prisma.contactRequest.findFirst({
      where: { email: c.email, message: c.message }
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
          adminNote: c.adminNote ?? null
        }
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
          adminNote: c.adminNote ?? null
        }
      });
    }
  }

  console.log(`✓ Contact requests seeded (${CONTACT_REQUESTS.length})`);

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
    contactRequests: await prisma.contactRequest.count()
  };

  console.log("\n=== WanderViet seed summary ===");
  console.table(counts);
  console.log("\nDemo accounts:");
  console.log("  admin@wanderviet.com / Admin@123456 (ADMIN)");
  console.log("  user@wanderviet.com  / User@123456  (USER)");
  console.log("  staff@wanderviet.com / Staff@123456 (STAFF)");
  console.log(
    "\nCoupons: WVWELCOME10 (PERCENT 10%), WV500K (FIXED 500k, unlimited), WVEXPIRED (expired)\n"
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
    console.error("Seed failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
