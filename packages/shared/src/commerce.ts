export interface FlightOffer {
  id: string;
  airline: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: string;
  baggage: string;
  price: number;
  currency: 'VND';
  badges: string[];
  isMock: true;
}

export interface RoomOffer {
  id: string;
  name: string;
  bedType: string;
  guests: number;
  nightlyPrice: number;
  refundable: boolean;
  breakfastIncluded: boolean;
  badges: string[];
}

export interface HotelProperty {
  id: string;
  slug: string;
  name: string;
  destinationSlug: string;
  city: string;
  district: string;
  rating: number;
  reviewCount: number;
  address: string;
  summary: string;
  amenities: string[];
  policies: string[];
  rooms: RoomOffer[];
  imageTone: 'beach' | 'city' | 'heritage' | 'mountain';
}

export interface SupportArticle {
  id: string;
  category: 'booking' | 'payment' | 'account' | 'assistant' | 'mobile';
  title: string;
  summary: string;
  steps: string[];
}

export interface UserBookingSummary {
  id: string;
  code: string;
  title: string;
  dateRange: string;
  status: 'confirmed_demo' | 'pending_demo' | 'cancelled_demo';
  totalAmount: number;
  currency: 'VND';
  paymentWarning: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  points: number;
  nextTierPoints: number;
  benefits: string[];
  demoRewards: string[];
}

export const demoPaymentWarning = 'Thanh toán demo — không phát sinh giao dịch thật';

export const flightOffers: FlightOffer[] = [
  {
    id: 'flight-han-dad-morning',
    airline: 'Chill Airways mô phỏng',
    from: 'Hà Nội',
    to: 'Đà Nẵng',
    departTime: '07:45',
    arriveTime: '09:10',
    duration: '1 giờ 25 phút',
    stops: 'Bay thẳng',
    baggage: '7kg xách tay + 20kg ký gửi mẫu',
    price: 1680000,
    currency: 'VND',
    badges: ['Giá mẫu', 'Bay thẳng', 'Tết demo'],
    isMock: true,
  },
  {
    id: 'flight-sgn-dad-evening',
    airline: 'Lotus Local demo',
    from: 'TP. Hồ Chí Minh',
    to: 'Đà Nẵng',
    departTime: '18:20',
    arriveTime: '19:45',
    duration: '1 giờ 25 phút',
    stops: 'Bay thẳng',
    baggage: '7kg xách tay',
    price: 1420000,
    currency: 'VND',
    badges: ['Lịch tối', 'Tiết kiệm', 'Mock fare'],
    isMock: true,
  },
  {
    id: 'flight-dad-bkk-family',
    airline: 'Mekong Connect demo',
    from: 'Đà Nẵng',
    to: 'Bangkok',
    departTime: '10:15',
    arriveTime: '12:05',
    duration: '1 giờ 50 phút',
    stops: 'Bay thẳng',
    baggage: '7kg + 23kg mẫu',
    price: 2890000,
    currency: 'VND',
    badges: ['Gia đình', 'Quốc tế mẫu', 'Không real-time'],
    isMock: true,
  },
];

export const hotelProperties: HotelProperty[] = [
  {
    id: 'hotel-da-nang-boutique',
    slug: 'da-nang-boutique-stay',
    name: 'Đà Nẵng Boutique Stay',
    destinationSlug: 'da-nang',
    city: 'Đà Nẵng',
    district: 'Mỹ Khê',
    rating: 4.8,
    reviewCount: 428,
    address: 'Gần biển Mỹ Khê, Đà Nẵng',
    summary:
      'Khách sạn mẫu theo phong cách boutique, thuận tiện cho lịch biển, ẩm thực và Hội An trong ngày.',
    amenities: [
      'Hồ bơi',
      'Ăn sáng mẫu',
      'Gần biển',
      'Gói offline',
      'Hỗ trợ gia đình',
      'Không lưu thẻ thật',
    ],
    policies: [
      'Hủy demo miễn phí trước ngày đi',
      demoPaymentWarning,
      'Giá và phòng là dữ liệu mẫu local',
    ],
    imageTone: 'beach',
    rooms: [
      {
        id: 'room-dad-deluxe',
        name: 'Deluxe hướng phố',
        bedType: '1 giường đôi',
        guests: 2,
        nightlyPrice: 1380000,
        refundable: true,
        breakfastIncluded: true,
        badges: ['Bán chạy mẫu', 'Ăn sáng', 'Hủy demo'],
      },
      {
        id: 'room-dad-family',
        name: 'Family Studio',
        bedType: '2 giường lớn',
        guests: 4,
        nightlyPrice: 2180000,
        refundable: true,
        breakfastIncluded: true,
        badges: ['Gia đình', 'Gần biển', 'Gói offline'],
      },
    ],
  },
  {
    id: 'hotel-hoi-an-heritage',
    slug: 'hoi-an-heritage-house',
    name: 'Hội An Heritage House',
    destinationSlug: 'hoi-an',
    city: 'Hội An',
    district: 'Phố cổ',
    rating: 4.7,
    reviewCount: 316,
    address: 'Rìa phố cổ Hội An',
    summary: 'Homestay mẫu cho người thích đèn lồng, ẩm thực địa phương và lịch trình đi bộ nhẹ.',
    amenities: [
      'Xe đạp mẫu',
      'Gần phố cổ',
      'Bữa sáng địa phương',
      'Culture guard',
      'Hỗ trợ offline',
    ],
    policies: [
      'Không phát sinh giao dịch thật',
      'Không yêu cầu thẻ thật',
      'Thông tin phòng là dữ liệu demo',
    ],
    imageTone: 'heritage',
    rooms: [
      {
        id: 'room-han-river',
        name: 'Heritage Garden',
        bedType: '1 giường queen',
        guests: 2,
        nightlyPrice: 1120000,
        refundable: true,
        breakfastIncluded: true,
        badges: ['Phố cổ', 'Đi bộ', 'Demo'],
      },
    ],
  },
];

export const supportArticles: SupportArticle[] = [
  {
    id: 'support-demo-payment',
    category: 'payment',
    title: 'Thanh toán demo hoạt động như thế nào?',
    summary: 'ChillTravel chỉ mô phỏng giữ chỗ để demo portfolio, không xử lý tiền thật.',
    steps: [
      'Chọn phương thức demo',
      'Xác nhận giữ chỗ mẫu',
      'Nhận mã QR demo',
      'Không nhập hoặc lưu thẻ thật',
    ],
  },
  {
    id: 'support-local-assistant',
    category: 'assistant',
    title: 'Trợ lý local-first có dữ liệu real-time không?',
    summary:
      'Trợ lý dùng dữ liệu mẫu/local và phải nói rõ khi không có giá vé bay, visa hoặc thời tiết hiện tại.',
    steps: [
      'Hỏi lịch trình hoặc ngân sách',
      'Nhận câu trả lời có citation local',
      'Kiểm tra nguồn chính thức cho dữ liệu live',
    ],
  },
  {
    id: 'support-offline-pack',
    category: 'mobile',
    title: 'Gói offline lưu những gì?',
    summary:
      'Mobile lưu lịch trình, yêu thích, booking demo và checklist an toàn trong cache local.',
    steps: ['Lưu chuyến đi', 'Mở gói offline', 'Xem checklist và QR demo khi mất mạng'],
  },
];

export const userBookingSummaries: UserBookingSummary[] = [
  {
    id: 'booking-da-nang-demo',
    code: 'CT-QR-DA-NANG',
    title: 'Đà Nẵng Boutique Stay · 4 ngày',
    dateRange: '12/08/2026 - 16/08/2026',
    status: 'confirmed_demo',
    totalAmount: 5520000,
    currency: 'VND',
    paymentWarning: demoPaymentWarning,
  },
  {
    id: 'booking-hoi-an-demo',
    code: 'CT-QR-HOI-AN',
    title: 'Hội An Heritage House · 2 đêm',
    dateRange: '18/08/2026 - 20/08/2026',
    status: 'pending_demo',
    totalAmount: 2240000,
    currency: 'VND',
    paymentWarning: demoPaymentWarning,
  },
];

export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'tier-blue',
    name: 'Chill Blue',
    points: 1280,
    nextTierPoints: 2500,
    benefits: ['Ưu tiên gợi ý phù hợp ngân sách', 'Lưu 5 gói offline', 'Huy hiệu Food Hunter'],
    demoRewards: ['Voucher mẫu 120K', 'Nâng hạng phòng demo', 'QR fast check-in mẫu'],
  },
  {
    id: 'tier-teal',
    name: 'Chill Teal',
    points: 2500,
    nextTierPoints: 6000,
    benefits: ['Trip dashboard nâng cao', 'Hỗ trợ family/couple templates', 'So sánh 4 điểm đến'],
    demoRewards: ['Voucher mẫu 250K', 'Gói hành lý mock', 'Ưu tiên chat local'],
  },
];

export function getHotelPropertyBySlug(slug: string) {
  return hotelProperties.find((hotel) => hotel.slug === slug);
}
