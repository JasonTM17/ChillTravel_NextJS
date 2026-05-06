import '../../domain/travel_models.dart';

abstract interface class TravelOfflineCache {
  Future<List<Destination>> getExploreDestinations();
  Future<List<ItineraryDay>> getItineraryDays();
  Future<void> cacheItineraryDays(List<ItineraryDay> days);
  Future<List<WishlistItem>> getWishlistItems();
  Future<void> cacheWishlistItems(List<WishlistItem> items);
  Future<void> addWishlistItem(WishlistItem item);
  Future<List<BookingSummary>> getBookingSummaries();
  Future<void> cacheBookingSummaries(List<BookingSummary> bookings);
  Future<void> addBookingSummary(BookingSummary booking);
  Future<List<ChatMessage>> getChatMessages();
  Future<void> addChatMessages(List<ChatMessage> messages);
}

class InMemoryTravelOfflineCache implements TravelOfflineCache {
  InMemoryTravelOfflineCache({
    List<Destination>? destinations,
    List<ItineraryDay>? itineraryDays,
    List<WishlistItem>? wishlistItems,
    List<BookingSummary>? bookingSummaries,
    List<ChatMessage>? chatMessages,
  }) : _destinations = List.of(destinations ?? _seedDestinations),
       _itineraryDays = List.of(itineraryDays ?? _seedItineraryDays),
       _wishlistItems = List.of(wishlistItems ?? _seedWishlistItems),
       _bookingSummaries = List.of(bookingSummaries ?? _seedBookings),
       _chatMessages = List.of(chatMessages ?? _seedMessages);

  final List<Destination> _destinations;
  List<ItineraryDay> _itineraryDays;
  List<WishlistItem> _wishlistItems;
  List<BookingSummary> _bookingSummaries;
  final List<ChatMessage> _chatMessages;

  @override
  Future<List<Destination>> getExploreDestinations() async {
    return List.unmodifiable(_destinations);
  }

  @override
  Future<List<ItineraryDay>> getItineraryDays() async {
    return List.unmodifiable(_itineraryDays);
  }

  @override
  Future<void> cacheItineraryDays(List<ItineraryDay> days) async {
    _itineraryDays = List.of(days);
  }

  @override
  Future<List<WishlistItem>> getWishlistItems() async {
    return List.unmodifiable(_wishlistItems);
  }

  @override
  Future<void> cacheWishlistItems(List<WishlistItem> items) async {
    _wishlistItems = List.of(items);
  }

  @override
  Future<void> addWishlistItem(WishlistItem item) async {
    _wishlistItems = [
      item,
      ..._wishlistItems.where((saved) => saved.id != item.id),
    ];
  }

  @override
  Future<List<BookingSummary>> getBookingSummaries() async {
    return List.unmodifiable(_bookingSummaries);
  }

  @override
  Future<void> cacheBookingSummaries(List<BookingSummary> bookings) async {
    _bookingSummaries = List.of(bookings);
  }

  @override
  Future<void> addBookingSummary(BookingSummary booking) async {
    _bookingSummaries = [booking, ..._bookingSummaries];
  }

  @override
  Future<List<ChatMessage>> getChatMessages() async {
    return List.unmodifiable(_chatMessages);
  }

  @override
  Future<void> addChatMessages(List<ChatMessage> messages) async {
    _chatMessages.addAll(messages);
  }
}

const _seedDestinations = [
  Destination(
    id: 'ha-long',
    name: 'Ha Long Bay',
    region: 'Quang Ninh',
    summary: 'Limestone karsts, overnight cruises, and calm morning kayaking.',
    tags: ['UNESCO', 'Cruise', 'Nature'],
    rating: 4.9,
  ),
  Destination(
    id: 'hue',
    name: 'Hue Imperial City',
    region: 'Thua Thien Hue',
    summary: 'Citadel walks, royal tombs, garden houses, and central cuisine.',
    tags: ['History', 'Food', 'Culture'],
    rating: 4.8,
  ),
  Destination(
    id: 'phu-quoc',
    name: 'Phu Quoc',
    region: 'Kien Giang',
    summary:
        'Beach days, island hopping, night markets, and easy resort stays.',
    tags: ['Beach', 'Family', 'Island'],
    rating: 4.7,
  ),
];

const _seedItineraryDays = [
  ItineraryDay(
    day: 1,
    title: 'Hanoi arrival',
    area: 'Old Quarter',
    activities: ['Hoan Kiem Lake', 'Street food walk', 'Water puppet show'],
    offlineReady: true,
  ),
  ItineraryDay(
    day: 2,
    title: 'Ninh Binh day trip',
    area: 'Trang An',
    activities: ['Boat route', 'Mua Cave viewpoint', 'Tam Coc dinner'],
    offlineReady: true,
  ),
];

final _seedWishlistItems = [
  WishlistItem(
    id: 'hoi-an-lanterns',
    title: 'Hoi An lantern night',
    type: 'experience',
    location: 'Quang Nam',
    savedAt: DateTime(2026, 5),
    offlineAvailable: true,
  ),
  WishlistItem(
    id: 'sapa-trek',
    title: 'Sapa terrace trek',
    type: 'tour',
    location: 'Lao Cai',
    savedAt: DateTime(2026, 5, 1),
    offlineAvailable: true,
  ),
];

final _seedBookings = [
  BookingSummary(
    id: 'sandbox-cruise',
    label: 'Ha Long overnight cruise',
    status: 'Sandbox hold',
    amountLabel: 'Mock total only',
    sandboxOnly: true,
    updatedAt: DateTime(2026, 5),
  ),
];

final _seedMessages = [
  ChatMessage(
    role: 'assistant',
    content: 'Ask for food, routes, weather-aware pacing, or offline packing.',
    createdAt: DateTime(2026, 5),
  ),
];
