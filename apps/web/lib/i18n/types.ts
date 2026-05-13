/**
 * i18n Type Definitions
 *
 * Provides compile-time type safety for the multilingual system.
 * Each locale file must implement TranslationNamespace exactly.
 */

/** Supported locales: Vietnamese, English, Japanese */
export type Locale = 'vi' | 'en' | 'ja';

/** All valid locale values for runtime validation */
export const SUPPORTED_LOCALES: readonly Locale[] = ['vi', 'en', 'ja'] as const;

/** Default locale used when no valid preference is found */
export const DEFAULT_LOCALE: Locale = 'vi';

// ─── Namespace Interfaces ────────────────────────────────────────────────────

export interface NavTranslations {
  home: string;
  explore: string;
  tours: string;
  destinations: string;
  blog: string;
  login: string;
  register: string;
  profile: string;
  myBookings: string;
  wishlist: string;
  logout: string;
  admin: string;
  hotels: string;
  flights: string;
  experiences: string;
  support: string;
  account: string;
}

export interface CommonTranslations {
  search: string;
  loading: string;
  error: string;
  retry: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  confirm: string;
  back: string;
  viewAll: string;
  viewDetail: string;
  noResults: string;
  resetFilters: string;
  close: string;
  open: string;
  more: string;
  less: string;
}

export interface BookingTranslations {
  book: string;
  guests: string;
  departure: string;
  coupon: string;
  total: string;
  paymentWarning: string;
  selectRoom: string;
  bookHotelDemo: string;
  bookFlightDemo: string;
  stepSelect: string;
  stepDetails: string;
  stepPayment: string;
  stepConfirmation: string;
  orderSummary: string;
  priceBreakdown: string;
  baseFare: string;
  taxes: string;
  confirmPayment: string;
  bookingReference: string;
  backToHome: string;
  paymentFailed: string;
  retryPayment: string;
  demoPaymentNote: string;
  creditCard: string;
  bankTransfer: string;
  eWallet: string;
}

export interface SearchTranslations {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  guestsCount: string;
  origin: string;
  departureDate: string;
  returnDate: string;
  oneWay: string;
  roundTrip: string;
  passengers: string;
  cabinClass: string;
  economy: string;
  business: string;
  firstClass: string;
  searchHotels: string;
  searchFlights: string;
  recentSearches: string;
  noDestinationsFound: string;
  minNightStay: string;
}

export interface HotelTranslations {
  perNight: string;
  starRating: string;
  reviewScore: string;
  reviews: string;
  amenities: string;
  propertyType: string;
  distanceFromCenter: string;
  priceRange: string;
  sortByPrice: string;
  sortByRating: string;
  sortByPopularity: string;
  sortByDistance: string;
  priceLowHigh: string;
  priceHighLow: string;
  ratingDesc: string;
  popularityDesc: string;
  distanceAsc: string;
  noHotelsFound: string;
  adjustFilters: string;
  photoGallery: string;
  roomTypes: string;
  guestReviews: string;
  startingFrom: string;
  selectRoomFirst: string;
}

export interface FlightTranslations {
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  direct: string;
  oneStop: string;
  twoOrMoreStops: string;
  airline: string;
  departureTime: string;
  layover: string;
  pricePerPassenger: string;
  selectFlight: string;
  fareSummary: string;
  passengerInfo: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  noFlightsFound: string;
  resetAllFilters: string;
}

export interface MapTranslations {
  hoangSa: string;
  truongSa: string;
  hoangSaFull: string;
  truongSaFull: string;
  sovereignty: string;
  sovereigntyStatement: string;
  legendTitle: string;
  boundaryLabel: string;
  infoPanel: string;
  historicalContext: string;
  expand: string;
  collapse: string;
}

export interface PromoTranslations {
  flashSale: string;
  ended: string;
  useNow: string;
  validUntil: string;
  discountCode: string;
  couponInvalid: string;
  couponExpired: string;
  discountApplied: string;
  recommendations: string;
  topDeals: string;
  timeRemaining: string;
  soldOut: string;
  percentOff: string;
}

export interface StatusTranslations {
  pending: string;
  confirmed: string;
  cancelled: string;
  completed: string;
  active: string;
  inactive: string;
  processing: string;
  failed: string;
}

export interface ErrorTranslations {
  generic: string;
  network: string;
  notFound: string;
  unauthorized: string;
  forbidden: string;
  validation: string;
  timeout: string;
  serverError: string;
  paymentFailed: string;
  invalidCoupon: string;
  expiredCoupon: string;
  sessionExpired: string;
}

export interface HomeTranslations {
  heroTitle: string;
  searchPlaceholder: string;
  quickSearch: string;
  todayDeals: string;
  viewAll: string;
  featuredTours: string;
  featuredToursSubtitle: string;
  vietnamDestinations: string;
  vietnamDestinationsSubtitle: string;
  worldDestinations: string;
  worldDestinationsSubtitle: string;
  allTours: string;
  allToursSubtitle: string;
  coupons: string;
  demoPaymentNotice: string;
  demoPaymentDesc: string;
  loadError: string;
  retry: string;
  // Service tabs
  hotels: string;
  flights: string;
  tours: string;
  train: string;
  shuttle: string;
  carRental: string;
  activities: string;
  aiPlanner: string;
  // Hero search
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  search: string;
  // Footer
  services: string;
  support: string;
  account: string;
  downloadApp: string;
  // Trust band
  safePayment: string;
  safePaymentDesc: string;
  realData: string;
  realDataDesc: string;
  support247: string;
  support247Desc: string;
  bestPrice: string;
  bestPriceDesc: string;
}

// ─── Main Translation Namespace ──────────────────────────────────────────────

/**
 * Complete translation namespace interface.
 * Each locale file (vi.ts, en.ts, ja.ts) must implement this interface exactly.
 * TypeScript will produce compile-time errors if any key is missing or extra.
 */
export interface TranslationNamespace {
  nav: NavTranslations;
  common: CommonTranslations;
  booking: BookingTranslations;
  search: SearchTranslations;
  hotel: HotelTranslations;
  flight: FlightTranslations;
  map: MapTranslations;
  promo: PromoTranslations;
  status: StatusTranslations;
  errors: ErrorTranslations;
  home: HomeTranslations;
}
