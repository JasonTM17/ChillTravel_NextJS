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
    name: 'Vịnh Hạ Long',
    region: 'Quảng Ninh',
    summary: 'Đảo đá vôi, du thuyền qua đêm và chèo kayak buổi sáng.',
    tags: ['UNESCO', 'Du thuyền', 'Thiên nhiên'],
    rating: 4.9,
  ),
  Destination(
    id: 'hue',
    name: 'Kinh thành Huế',
    region: 'Thừa Thiên Huế',
    summary: 'Đại Nội, lăng tẩm, nhà vườn và ẩm thực miền Trung.',
    tags: ['Lịch sử', 'Ẩm thực', 'Văn hóa'],
    rating: 4.8,
  ),
  Destination(
    id: 'phu-quoc',
    name: 'Phú Quốc',
    region: 'Kiên Giang',
    summary: 'Ngày biển nhẹ, đảo nhỏ, chợ đêm và resort dễ đi cho gia đình.',
    tags: ['Biển', 'Gia đình', 'Đảo'],
    rating: 4.7,
  ),
];

const _seedItineraryDays = [
  ItineraryDay(
    day: 1,
    title: 'Đến Hà Nội',
    area: 'Phố cổ',
    activities: ['Hồ Hoàn Kiếm', 'Đi bộ ăn vặt', 'Múa rối nước'],
    offlineReady: true,
  ),
  ItineraryDay(
    day: 2,
    title: 'Đi Ninh Bình trong ngày',
    area: 'Trang An',
    activities: ['Tuyến thuyền', 'Hang Múa', 'Ăn tối Tam Cốc'],
    offlineReady: true,
  ),
];

final _seedWishlistItems = [
  WishlistItem(
    id: 'hoi-an-lanterns',
    title: 'Đêm đèn lồng Hội An',
    type: 'trải nghiệm',
    location: 'Quảng Nam',
    savedAt: DateTime(2026, 5),
    offlineAvailable: true,
  ),
  WishlistItem(
    id: 'sapa-trek',
    title: 'Trekking ruộng bậc thang Sapa',
    type: 'tour',
    location: 'Lào Cai',
    savedAt: DateTime(2026, 5, 1),
    offlineAvailable: true,
  ),
];

final _seedBookings = [
  BookingSummary(
    id: 'sandbox-cruise',
    label: 'Du thuyền Hạ Long qua đêm',
    status: 'Giữ chỗ demo',
    amountLabel: 'Không charge thật',
    sandboxOnly: true,
    updatedAt: DateTime(2026, 5),
  ),
];

final _seedMessages = [
  ChatMessage(
    role: 'assistant',
    content:
        'Bạn có thể hỏi món ăn, tuyến đi, nhịp di chuyển hoặc gói offline.',
    createdAt: DateTime(2026, 5),
  ),
];
