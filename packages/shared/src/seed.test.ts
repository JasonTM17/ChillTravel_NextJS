import { describe, expect, it } from 'vitest';
import {
  buildStructuredLocalAiAnswer,
  compareDestinations,
  detectTravelStyle,
  localAiAnswer,
  moodSearch,
  simulateBudget,
} from './ai-tools';
import {
  demoPaymentWarning,
  flightOffers,
  getHotelPropertyBySlug,
  loyaltyTiers,
  supportArticles,
  userBookingSummaries,
} from './commerce';
import type {
  AiChatRequest,
  BookingCreateRequest,
  DestinationListQuery,
  MobileOfflineSnapshot,
  WanderVietApiContract,
} from './contracts';
import { destinations } from './seed';

describe('seed data and travel intelligence', () => {
  it('contains rich Vietnam and world destinations', () => {
    expect(destinations.length).toBeGreaterThanOrEqual(26);
    expect(
      destinations.find((item) => item.slug === 'da-nang')?.foodHighlights.length,
    ).toBeGreaterThan(1);
  });

  it('guards real-time travel questions', () => {
    const answer = localAiAnswer('gia ve bay real-time di Paris va visa hom nay');
    expect(answer.answer).toContain('do not have live');
    expect(answer.safety.confidence).toBe('medium');
  });

  it('detects travel personality and recommends destinations', () => {
    const result = detectTravelStyle('I want street food, markets, cafes and local meals');
    expect(result.style).toBe('Food Hunter');
    expect(result.recommendedDestinationSlugs.length).toBeGreaterThan(0);
  });

  it('simulates budget by travel choices', () => {
    const budget = simulateBudget({
      destinationSlug: 'da-nang',
      travelers: 2,
      days: 4,
      hotelLevel: 'boutique',
      foodLevel: 'balanced',
      transportLevel: 'mixed',
      activityLevel: 'packed',
    });
    expect(budget.total).toBeGreaterThan(budget.perPerson);
    expect(budget.breakdown.hotel).toBeGreaterThan(0);
  });

  it('compares destinations and converts mood search to filters', () => {
    const comparison = compareDestinations(['da-nang', 'bali', 'paris'], 'Food Hunter');
    expect(comparison).toHaveLength(3);
    expect(comparison[0]?.aiScore).toBeGreaterThan(0);

    const mood = moodSearch('yen binh co bien va an ngon');
    expect(mood.inferredFilters.pace).toBe('chill');
    expect(mood.destinations.length).toBeGreaterThan(0);
  });

  it('exports shared API and mobile contracts', () => {
    const destinationQuery = { q: 'Da Nang', sort: 'popular' } satisfies DestinationListQuery;
    const bookingRequest = {
      itemName: 'Demo tour',
      amount: 1000000,
      method: 'MOCK_MOMO',
    } satisfies BookingCreateRequest;
    const chatRequest = {
      message: 'Da Nang food itinerary',
      contextSlug: 'da-nang',
    } satisfies AiChatRequest;
    const snapshot = {
      itineraries: [],
      wishlist: [],
      bookings: [],
      cachedAt: new Date(0).toISOString(),
    } satisfies MobileOfflineSnapshot;
    const contract = 'ai' satisfies keyof WanderVietApiContract;

    expect(destinationQuery.sort).toBe('popular');
    expect(bookingRequest.method).toBe('MOCK_MOMO');
    expect(chatRequest.contextSlug).toBe('da-nang');
    expect(snapshot.cachedAt).toBe('1970-01-01T00:00:00.000Z');
    expect(contract).toBe('ai');
  });

  it('builds structured local chat answers for the concierge UI', () => {
    const answer = buildStructuredLocalAiAnswer('Đà Nẵng đi 3 ngày ăn gì cho cặp đôi');

    expect(answer.destination).toBe('Đà Nẵng');
    expect(answer.provider.requiresOpenAiApiKey).toBe(false);
    expect(answer.itinerary.days).toHaveLength(3);
    expect(answer.budget.total).toBeGreaterThan(0);
    expect(answer.foods.length).toBeGreaterThan(1);
    expect(answer.quickActions.map((action) => action.id)).toContain('convert_to_itinerary');
    expect(answer.citations[0]?.trustTier).toBe('sample');
  });

  it('exports full app commerce mock data without real payment claims', () => {
    expect(flightOffers.length).toBeGreaterThanOrEqual(3);
    expect(flightOffers.every((offer) => offer.isMock)).toBe(true);
    expect(getHotelPropertyBySlug('da-nang-boutique-stay')?.rooms.length).toBeGreaterThan(1);
    expect(supportArticles.some((article) => article.category === 'payment')).toBe(true);
    expect(userBookingSummaries[0]?.code).toContain('CT-QR');
    expect(userBookingSummaries[0]?.paymentWarning).toBe(demoPaymentWarning);
    expect(loyaltyTiers[0]?.demoRewards.length).toBeGreaterThan(1);
  });
});
