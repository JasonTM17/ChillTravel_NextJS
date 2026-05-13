import { destinations } from './seed';
import type {
  AiAnswer,
  AiChatStructuredAnswer,
  AiProviderStatus,
  BudgetSimulationInput,
  BudgetSimulationResult,
  Destination,
  DestinationComparison,
  MoodSearchResult,
  TravelPersonalityResult,
  TravelQuizAnswer,
  TravelStyle,
  TripPlan,
} from './types';

function getFallbackDestination(): Destination {
  // destinations is a non-empty static array; use non-null assertion for the fallback
  return destinations[5] ?? destinations[0]!;
}

export const aiToolNames = [
  'suggest_destination',
  'build_itinerary',
  'estimate_budget',
  'find_local_food',
  'find_hotels_mock',
  'find_experiences_mock',
  'compare_destinations',
  'generate_packing_list',
  'detect_travel_style',
  'answer_from_knowledge_base',
] as const;

export type AiToolName = (typeof aiToolNames)[number];

export function normalizeTravelText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export function findDestination(query: string): Destination | undefined {
  const normalized = normalizeTravelText(query);
  return destinations.find((destination) => {
    const name = normalizeTravelText(destination.name);
    return (
      name.includes(normalized) ||
      normalized.includes(name) ||
      normalized.includes(destination.slug)
    );
  });
}

const personalityProfiles: Record<
  TravelStyle,
  { keywords: string[]; description: string; traits: string[] }
> = {
  'Food Hunter': {
    keywords: ['food', 'street', 'eat', 'coffee', 'local', 'an', 'am thuc', 'cafe', 'market'],
    description:
      'You plan trips around markets, signature dishes, cafes, and local cooking rituals.',
    traits: ['Street food curiosity', 'Neighborhood-first routes', 'Flexible mealtimes'],
  },
  'Culture Seeker': {
    keywords: [
      'culture',
      'history',
      'museum',
      'temple',
      'heritage',
      'van hoa',
      'lich su',
      'old town',
    ],
    description:
      'You care about stories, etiquette, architecture, museums, and the deeper rhythm of a place.',
    traits: ['Context-rich days', 'Local etiquette', 'Slow discovery'],
  },
  'Beach Lover': {
    keywords: ['beach', 'sea', 'island', 'sunset', 'bien', 'dao', 'snorkel'],
    description:
      'You want open water, sunset pacing, seafood, and soft recovery time between activities.',
    traits: ['Coastal stays', 'Sunset windows', 'Light packing'],
  },
  'Mountain Adventurer': {
    keywords: ['mountain', 'trek', 'hike', 'viewpoint', 'nui', 'adventure', 'loop'],
    description:
      'You look for elevation, scenic roads, crisp mornings, and routes that feel earned.',
    traits: ['Early starts', 'Weather checks', 'Route discipline'],
  },
  'Luxury Escaper': {
    keywords: ['luxury', 'resort', 'spa', 'private', 'premium', 'boutique', 'fine'],
    description:
      'You prefer fewer moves, stronger stays, private transfers, and curated experiences.',
    traits: ['Comfort margin', 'Private transfers', 'Premium dining'],
  },
  'Budget Backpacker': {
    keywords: ['budget', 'cheap', 'hostel', 'public', 'save', 'tiet kiem', 'backpack'],
    description: 'You optimize for local transport, affordable stays, and high-value experiences.',
    traits: ['Cost control', 'Public transport', 'Flexible lodging'],
  },
  'Family Planner': {
    keywords: ['family', 'kids', 'safe', 'slow', 'gia dinh', 'tre em', 'accessible'],
    description:
      'You need lower-risk pacing, reliable stays, nearby food, and offline-ready plans.',
    traits: ['Safety-first', 'Offline checklist', 'Shorter transfers'],
  },
  'World Wanderer': {
    keywords: ['world', 'bucket', 'global', 'city', 'multi', 'international', 'the gioi'],
    description:
      'You like big contrasts, cross-border inspiration, and globally recognizable highlights.',
    traits: ['Bucket list energy', 'City contrasts', 'Global context'],
  },
};

export function detectTravelStyle(input: string | TravelQuizAnswer[]): TravelPersonalityResult {
  const text = Array.isArray(input) ? input.map((answer) => answer.value).join(' ') : input;
  const normalized = normalizeTravelText(text);
  const ranked = Object.entries(personalityProfiles)
    .map(([style, profile]) => {
      const keywordScore = profile.keywords.reduce(
        (score, keyword) => score + (normalized.includes(keyword) ? 18 : 0),
        0,
      );
      const destinationAffinity = destinations.filter((destination) => {
        const haystack = normalizeTravelText(
          [...destination.tags, ...destination.travelStyles, destination.summary].join(' '),
        );
        return profile.keywords.some((keyword) => haystack.includes(keyword));
      }).length;
      return { style: style as TravelStyle, score: keywordScore + destinationAffinity };
    })
    .sort((a, b) => b.score - a.score);
  const winner = ranked[0]?.score
    ? ranked[0]
    : { style: 'Culture Seeker' as TravelStyle, score: 64 };
  const profile = personalityProfiles[winner.style];
  const recommendedDestinationSlugs = destinations
    .filter((destination) => {
      const haystack = normalizeTravelText(
        [...destination.tags, ...destination.travelStyles, destination.summary].join(' '),
      );
      return profile.keywords.some((keyword) => haystack.includes(keyword));
    })
    .slice(0, 4)
    .map((destination) => destination.slug);
  return {
    style: winner.style,
    score: Math.min(99, Math.max(64, winner.score + 64)),
    description: profile.description,
    traits: profile.traits,
    recommendedDestinationSlugs: recommendedDestinationSlugs.length
      ? recommendedDestinationSlugs
      : destinations.slice(0, 4).map((destination) => destination.slug),
  };
}

export function buildDemoItinerary(destination: Destination, durationDays = 3): TripPlan {
  const days = Array.from({ length: durationDays }, (_, index) => ({
    day: index + 1,
    title:
      index === 0
        ? destination.name + ' arrival and local rhythm'
        : destination.name + ' day ' + (index + 1) + ' discovery',
    morning: [
      destination.experiences[index % destination.experiences.length] ?? 'Local exploration',
      'Slow breakfast and neighborhood walk',
    ],
    afternoon: ['Signature attraction route', 'Cafe or rest stop with budget check'],
    evening: ['Local dinner', 'Culture guard reminder and next-day prep'],
    food: destination.foodHighlights.slice(0, 3),
    estimatedCost: Math.round(
      (destination.budgetMin + destination.budgetMax) / 2 / Math.max(durationDays, 1),
    ),
  }));

  return {
    destination: destination.name,
    durationDays,
    style: destination.travelStyles.join(', '),
    budgetLevel:
      destination.budgetMax > 7000000
        ? 'luxury'
        : destination.budgetMin < 900000
          ? 'budget'
          : 'mid-range',
    days,
    budgetBreakdown: {
      hotel: Math.round(destination.budgetMin * 0.45),
      food: Math.round(destination.budgetMin * 0.2),
      transport: Math.round(destination.budgetMin * 0.18),
      activities: Math.round(destination.budgetMin * 0.17),
    },
    safetyNotes: destination.cultureNotes,
    packingList: [
      'Comfortable walking shoes',
      'Reusable water bottle',
      'Light rain layer',
      'Offline itinerary pack',
    ],
  };
}

export function buildStructuredLocalAiAnswer(
  query: string,
  contextSlug?: string,
  provider?: Partial<AiProviderStatus>,
): AiChatStructuredAnswer {
  const enrichedQuery = `${query} ${contextSlug ?? ''}`.trim();
  const destination = findDestination(enrichedQuery) ?? getFallbackDestination();
  const baseAnswer = localAiAnswer(enrichedQuery);
  const style = detectTravelStyle(enrichedQuery).style;
  const durationDays = /5/.test(enrichedQuery) ? 5 : /4/.test(enrichedQuery) ? 4 : 3;
  const itinerary = buildDemoItinerary(destination, durationDays);
  const budget = simulateBudget({
    destinationSlug: destination.slug,
    travelers: inferTravelers(enrichedQuery),
    days: durationDays,
    hotelLevel: normalizedIncludes(enrichedQuery, ['luxury', 'resort', 'cao cap'])
      ? 'boutique'
      : 'comfort',
    foodLevel: normalizedIncludes(enrichedQuery, ['street', 'duong pho', 'cho'])
      ? 'street'
      : 'balanced',
    transportLevel: normalizedIncludes(enrichedQuery, ['private', 'xe rieng'])
      ? 'private'
      : 'mixed',
    activityLevel: normalizedIncludes(enrichedQuery, ['packed', 'nhieu', 'day lich'])
      ? 'packed'
      : 'balanced',
  });
  const defaultProvider: AiProviderStatus = {
    runtime: 'local',
    chatProvider: 'sample',
    model: 'local-tools',
    embeddingProvider: 'sample',
    vectorDb: 'sample',
    available: false,
    fallback: true,
    requiresOpenAiApiKey: false,
    note: 'Sample deterministic travel tools are active until Ollama/Qdrant are reachable.',
  };

  return {
    summary: baseAnswer.summary,
    answer: baseAnswer.answer,
    destination: destination.name,
    travelStyle: style,
    clarifyingQuestions: buildClarifyingQuestions(enrichedQuery),
    itinerary,
    budget,
    foods: destination.foodHighlights.slice(0, 5),
    hotels: destination.hotelsMock.slice(0, 3),
    experiences: destination.experiences.slice(0, 5),
    packingList: itinerary.packingList,
    safetyNotes: itinerary.safetyNotes,
    culturalNotes: destination.cultureNotes,
    citations: baseAnswer.citations.map((citation) => ({
      ...citation,
      trustTier: 'sample',
      language: destination.country === 'Vietnam' ? 'vi' : 'en',
    })),
    toolCalls: [
      { name: 'suggest_destination', status: 'ok', summary: `Matched ${destination.name}.` },
      { name: 'detect_travel_style', status: 'ok', summary: `Detected ${style}.` },
      {
        name: 'answer_from_knowledge_base',
        status: 'ok',
        summary: 'Used local sample knowledge and RAG-style citations.',
      },
      { name: 'build_itinerary', status: 'ok', summary: `Built ${durationDays} days.` },
      {
        name: 'estimate_budget',
        status: 'ok',
        summary: `Estimated ${budget.currency} budget without live prices.`,
      },
    ],
    quickActions: [
      { id: 'save_answer', label: 'Lưu câu trả lời' },
      {
        id: 'convert_to_itinerary',
        label: 'Chuyển thành lịch trình',
        href: `/ai-planner?destination=${destination.slug}`,
      },
      { id: 'add_destination', label: 'Thêm điểm đến', href: `/destinations/${destination.slug}` },
      {
        id: 'estimate_budget',
        label: 'Ước tính ngân sách',
        href: `/budget?destination=${destination.slug}`,
      },
    ],
    provider: { ...defaultProvider, ...provider, requiresOpenAiApiKey: false },
    realtimeWarning: baseAnswer.safety.grounded
      ? undefined
      : 'Dữ liệu vé bay, visa và thời tiết hiện tại cần kiểm tra nguồn chính thức.',
  };
}

export function simulateBudget(input: BudgetSimulationInput): BudgetSimulationResult {
  const destination =
    destinations.find((item) => item.slug === input.destinationSlug) ?? getFallbackDestination();
  const hotelMultipliers = { hostel: 0.55, comfort: 0.82, boutique: 1.08, luxury: 1.65 };
  const foodMultipliers = { street: 0.52, balanced: 0.84, premium: 1.3 };
  const transportMultipliers = { public: 0.48, mixed: 0.82, private: 1.35 };
  const activityMultipliers = { slow: 0.58, balanced: 0.9, packed: 1.24 };
  const dailyBase = (destination.budgetMin + destination.budgetMax) / 2;
  const breakdown = {
    hotel: Math.round(dailyBase * 0.42 * hotelMultipliers[input.hotelLevel] * input.days),
    food: Math.round(
      dailyBase * 0.22 * foodMultipliers[input.foodLevel] * input.days * input.travelers,
    ),
    transport: Math.round(
      dailyBase * 0.16 * transportMultipliers[input.transportLevel] * input.days,
    ),
    activities: Math.round(
      dailyBase * 0.2 * activityMultipliers[input.activityLevel] * input.days * input.travelers,
    ),
  };
  const total = breakdown.hotel + breakdown.food + breakdown.transport + breakdown.activities;
  return {
    destination: destination.name,
    total,
    perPerson: Math.round(total / Math.max(1, input.travelers)),
    currency: 'VND',
    breakdown,
    adjustmentNotes: [
      input.hotelLevel === 'luxury'
        ? 'Prioritize fewer hotel moves and private transfers.'
        : 'Hotel level keeps the trip flexible.',
      input.foodLevel === 'street'
        ? 'Street food routes increase local texture and lower cost.'
        : 'Food budget supports curated meals and cafe stops.',
      input.activityLevel === 'packed'
        ? 'Packed pacing needs stronger rest windows and transport buffers.'
        : 'Pacing leaves room for weather and local discoveries.',
    ],
    itineraryBias:
      input.activityLevel === 'slow'
        ? 'chill'
        : input.activityLevel === 'packed'
          ? 'packed'
          : 'balanced',
  };
}

export function compareDestinations(
  slugs: string[],
  style: TravelStyle = 'Culture Seeker',
): DestinationComparison[] {
  return slugs.slice(0, 4).map((slug) => {
    const destination = destinations.find((item) => item.slug === slug) ?? destinations[0]!;
    const haystack = normalizeTravelText(
      [...destination.tags, ...destination.travelStyles, destination.summary].join(' '),
    );
    const styleNeedle = normalizeTravelText(style.split(' ')[0] ?? '');
    const foodFit = destination.foodHighlights.length >= 3 ? 92 : 76;
    const familyFit = haystack.includes('family')
      ? 94
      : destination.safetyLevel === 'high'
        ? 84
        : 70;
    const nightlifeFit = haystack.includes('nightlife') || haystack.includes('city') ? 90 : 62;
    const activityFit = styleNeedle && haystack.includes(styleNeedle) ? 94 : 78;
    const safetyFit =
      destination.safetyLevel === 'high' ? 92 : destination.safetyLevel === 'medium' ? 78 : 58;
    const budgetFit =
      destination.budgetMax < 5000000 ? 90 : destination.budgetMin < 2500000 ? 78 : 62;
    const aiScore = Math.round(
      (foodFit + familyFit + nightlifeFit + activityFit + safetyFit + budgetFit) / 6,
    );
    return {
      slug: destination.slug,
      destination: destination.name,
      budgetRange: `${destination.budgetMin}-${destination.budgetMax} VND/day`,
      bestSeason: destination.bestTimeToVisit,
      activityFit,
      foodFit,
      familyFit,
      nightlifeFit,
      safetyFit,
      aiScore,
      verdict: aiScore > 86 ? 'Best fit' : aiScore > 78 ? 'Strong fit' : 'Good with tradeoffs',
    };
  });
}

export function moodSearch(query: string): MoodSearchResult {
  const normalized = normalizeTravelText(query);
  const tags = [
    normalized.includes('bien') || normalized.includes('beach') ? 'beach' : '',
    normalized.includes('yen binh') || normalized.includes('quiet') ? 'quiet' : '',
    normalized.includes('food') || normalized.includes('an ngon') ? 'food' : '',
    normalized.includes('culture') || normalized.includes('van hoa') ? 'culture' : '',
    normalized.includes('mountain') || normalized.includes('nui') ? 'mountain' : '',
  ].filter(Boolean);
  const budget =
    normalized.includes('luxury') || normalized.includes('resort')
      ? 'luxury'
      : normalized.includes('cheap') || normalized.includes('tiet kiem')
        ? 'budget'
        : 'mid-range';
  const pace =
    normalized.includes('packed') || normalized.includes('nhieu')
      ? 'packed'
      : normalized.includes('chill') || normalized.includes('yen binh')
        ? 'chill'
        : 'balanced';
  const style = detectTravelStyle(query).style;
  const result = destinations
    .filter((destination) => {
      const haystack = normalizeTravelText(
        [
          ...destination.tags,
          ...destination.travelStyles,
          destination.summary,
          destination.longDescription,
        ].join(' '),
      );
      return tags.length === 0 || tags.some((tag) => haystack.includes(tag));
    })
    .sort((a, b) => b.ratingAvg - a.ratingAvg)
    .slice(0, 8);
  return {
    query,
    inferredFilters: { tags, styles: [style], pace, budget },
    destinations: result.length ? result : destinations.slice(0, 8),
  };
}

export function localAiAnswer(query: string): AiAnswer {
  const destination = findDestination(query) ?? getFallbackDestination();
  const normalized = normalizeTravelText(query);
  const realTimePattern =
    /(real-time|realtime|current|today|flight price|visa|weather now|gia ve bay|thoi tiet hien tai)/i;
  const limited = realTimePattern.test(normalized);
  const itinerary = buildDemoItinerary(destination, /5/.test(query) ? 5 : /4/.test(query) ? 4 : 3);
  const personality = detectTravelStyle(query);
  return {
    summary: limited
      ? 'This is a local knowledge-base answer. Real-time prices, visa rules, and current weather must be checked with official sources.'
      : 'A grounded local RAG-style travel answer using ChillTravel sample knowledge.',
    answer: limited
      ? 'I do not have live flight, visa, or current weather data in the local runtime. I can still build a sample plan and budget, but you should verify real-time details with official providers.'
      : 'I recommend ' +
        destination.name +
        ' for your ' +
        personality.style +
        ' style. Start with food, culture, and a balanced pace, then adjust hotel and transport choices with the Smart Budget Simulator.',
    citations: [
      {
        title: 'ChillTravel knowledge: ' + destination.name,
        sourceId: 'destinations/' + destination.slug + '.md',
        chunkId: destination.slug + '-overview',
      },
    ],
    itineraryDraft: itinerary,
    toolCalls: [
      {
        name: 'detect_travel_style',
        status: 'ok',
        summary: 'Detected ' + personality.style + ' from the user query.',
      },
      {
        name: 'answer_from_knowledge_base',
        status: 'ok',
        summary: 'Retrieved curated local sample knowledge.',
      },
      {
        name: 'build_itinerary',
        status: 'ok',
        summary: 'Created structured day-by-day itinerary.',
      },
      {
        name: 'estimate_budget',
        status: 'ok',
        summary: 'Estimated demo cost bands without real payment data.',
      },
    ],
    safety: { grounded: !limited, confidence: limited ? 'medium' : 'high' },
  };
}

function inferTravelers(query: string) {
  const normalized = normalizeTravelText(query);
  if (normalized.includes('family') || normalized.includes('gia dinh')) return 4;
  if (normalized.includes('couple') || normalized.includes('cap doi')) return 2;
  const match = normalized.match(/(\d+)\s*(nguoi|khach|traveler|people)/);
  return match?.[1] ? Math.max(1, Number(match[1])) : 2;
}

function normalizedIncludes(query: string, needles: string[]) {
  const normalized = normalizeTravelText(query);
  return needles.some((needle) => normalized.includes(normalizeTravelText(needle)));
}

function buildClarifyingQuestions(query: string) {
  const normalized = normalizeTravelText(query);
  const questions = [];
  if (!/\d+\s*(ngay|day)/.test(normalized)) {
    questions.push({
      id: 'duration',
      question: 'Bạn đi mấy ngày?',
      options: ['3 ngày', '4 ngày', '5 ngày'],
    });
  }
  if (!normalizedIncludes(query, ['budget', 'ngan sach', 'trieu', 'luxury', 'tiet kiem'])) {
    questions.push({
      id: 'budget',
      question: 'Ngân sách dự kiến của bạn là bao nhiêu?',
      options: ['Tiết kiệm', 'Tầm trung', 'Thoải mái'],
    });
  }
  if (!normalizedIncludes(query, ['family', 'gia dinh', 'couple', 'cap doi', 'solo', 'mot minh'])) {
    questions.push({
      id: 'travelers',
      question: 'Bạn đi một mình, cặp đôi hay gia đình?',
      options: ['Một mình', 'Cặp đôi', 'Gia đình'],
    });
  }
  return questions.slice(0, 3);
}
