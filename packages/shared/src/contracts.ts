import type {
  AiChatStructuredAnswer,
  BudgetSimulationInput,
  BudgetSimulationResult,
  Destination,
  DestinationComparison,
  MoodSearchResult,
  RagReindexResult,
  Role,
  TravelPersonalityResult,
  TravelQuizAnswer,
  TravelStyle,
  TripPlan,
} from './types';

export type PaymentMethod =
  | 'MOCK_CARD'
  | 'MOCK_MOMO'
  | 'MOCK_VNPAY'
  | 'MOCK_ZALOPAY'
  | 'MOCK_PAYPAL'
  | 'MOCK_BANK_TRANSFER'
  | 'CASH_ON_ARRIVAL';

export interface ApiErrorEnvelope {
  success: false;
  data: null;
  message: string;
  error: {
    code: string | number;
    statusCode: number;
    details?: string[];
  };
  meta: {
    path: string;
    timestamp: string;
  };
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest extends AuthLoginRequest {
  role?: Role;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

export interface DestinationListQuery {
  q?: string;
  style?: string;
  country?: string;
  sort?: 'cheapest' | 'popular';
}

export interface BookingCreateRequest {
  itemName: string;
  amount: number;
  method: PaymentMethod;
}

export interface BookingMock {
  id: string;
  bookingCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded_mock';
  totalAmount: number;
  currency: 'VND';
  paymentStatus: 'pending' | 'confirmed_mock' | 'failed_mock' | 'refunded_mock';
  paymentMethod: PaymentMethod | string;
  isDemo: true;
  warning: string;
  qrTicket?: string;
}

export interface PaymentConfirmRequest {
  bookingCode?: string;
}

export interface AiChatRequest {
  message: string;
  contextSlug?: string;
}

export interface AiItineraryRequest {
  destination?: string;
  durationDays?: number;
  style?: string;
}

export interface AiBudgetEstimateRequest {
  destinationSlug?: string;
  travelers?: number;
}

export interface AiCompareRequest {
  slugs: string[];
  style?: TravelStyle;
}

export interface AiPersonalityRequest {
  answers: TravelQuizAnswer[];
}

export interface AiMoodSearchRequest {
  query: string;
}

export interface AiReindexRequest {
  force?: boolean;
}

export interface ChillTravelApiContract {
  auth: {
    login: { request: AuthLoginRequest; response: AuthSession };
    register: { request: AuthRegisterRequest; response: AuthSession };
  };
  destinations: {
    list: { request: DestinationListQuery; response: Destination[] };
    detail: { request: { slug: string }; response: Destination };
  };
  booking: {
    create: { request: BookingCreateRequest; response: BookingMock };
    confirmPayment: {
      request: PaymentConfirmRequest;
      response: Pick<BookingMock, 'bookingCode' | 'paymentStatus' | 'warning'>;
    };
  };
  ai: {
    chat: { request: AiChatRequest; response: AiChatStructuredAnswer };
    itinerary: { request: AiItineraryRequest; response: TripPlan };
    budget: { request: AiBudgetEstimateRequest; response: BudgetSimulationResult };
    simulateBudget: { request: BudgetSimulationInput; response: BudgetSimulationResult };
    compare: { request: AiCompareRequest; response: DestinationComparison[] };
    personality: { request: AiPersonalityRequest; response: TravelPersonalityResult };
    moodSearch: { request: AiMoodSearchRequest; response: MoodSearchResult };
    reindex: { request: AiReindexRequest; response: RagReindexResult };
  };
}

export interface MobileOfflineSnapshot {
  itineraries: TripPlan[];
  wishlist: Destination[];
  bookings: BookingMock[];
  cachedAt: string;
}
