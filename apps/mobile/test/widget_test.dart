import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vietwander_ai/src/application/travel_providers.dart';
import 'package:vietwander_ai/src/core/api/vietwander_api_client.dart';
import 'package:vietwander_ai/src/data/cache/travel_offline_cache.dart';
import 'package:vietwander_ai/src/data/repositories/booking_repository.dart';
import 'package:vietwander_ai/src/data/repositories/chat_repository.dart';
import 'package:vietwander_ai/src/data/repositories/travel_repository.dart';
import 'package:vietwander_ai/src/domain/travel_models.dart';
import 'package:vietwander_ai/src/features/ai_chat_screen.dart';
import 'package:vietwander_ai/src/features/booking_screen.dart';
import 'package:vietwander_ai/src/features/explore_screen.dart';
import 'package:vietwander_ai/src/features/home_screen.dart';
import 'package:vietwander_ai/src/features/itinerary_screen.dart';
import 'package:vietwander_ai/src/features/onboarding_screen.dart';
import 'package:vietwander_ai/src/features/wishlist_screen.dart';

import 'package:vietwander_ai/src/app.dart';

void main() {
  testWidgets('app renders onboarding', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          travelApiGatewayProvider.overrideWith((ref) => _ThrowingApiGateway()),
        ],
        child: const ChillTravelApp(),
      ),
    );

    expect(find.text('CHILLTRAVEL'), findsWidgets);
    expect(find.text('Tiếng Việt là mặc định'), findsOneWidget);
  });

  testWidgets('home renders offline trip metrics', (tester) async {
    await _pumpMobileWidget(tester, const HomeScreen());

    expect(find.text('Ngày lịch trình'), findsOneWidget);
    expect(find.text('Đã lưu'), findsOneWidget);
    expect(find.text('Đặt chỗ demo'), findsOneWidget);
  });

  testWidgets('explore renders cached destinations', (tester) async {
    await _pumpMobileWidget(tester, const ExploreScreen());

    expect(find.text('Vịnh Hạ Long'), findsOneWidget);
    expect(find.text('Kinh thành Huế'), findsOneWidget);
  });

  testWidgets('planner renders cached itinerary days', (tester) async {
    await _pumpMobileWidget(tester, const ItineraryScreen());

    expect(find.text('Ngày 1: Đến Hà Nội'), findsOneWidget);
    expect(find.text('Ngày 2: Đi Ninh Bình trong ngày'), findsOneWidget);
  });

  testWidgets('chat renders local guidance without cloud runtime key', (
    tester,
  ) async {
    await _pumpMobileWidget(tester, const AiChatScreen());

    expect(find.text('Ăn gì ở gần đây?'), findsOneWidget);
    expect(find.text('Trợ lý'), findsOneWidget);
    expect(find.textContaining('gói offline'), findsOneWidget);
  });

  testWidgets('booking creates sandbox holds locally', (tester) async {
    await _pumpMobileWidget(tester, const BookingScreen());

    expect(find.text('Du thuyền Hạ Long qua đêm'), findsOneWidget);

    await tester.tap(find.text('Tạo giữ chỗ demo'));
    await tester.pumpAndSettle();

    expect(find.text('Gói thiết yếu Việt Nam'), findsOneWidget);
    expect(find.textContaining('Không thu tiền thật'), findsWidgets);
  });

  testWidgets('wishlist renders cached saved items', (tester) async {
    await _pumpMobileWidget(tester, const WishlistScreen());

    expect(find.text('Đêm đèn lồng Hội An'), findsOneWidget);
    expect(find.text('Trekking ruộng bậc thang Sapa'), findsOneWidget);
  });

  test('travel repository falls back to offline cache', () async {
    final repository = TravelRepository(
      api: _ThrowingApiGateway(),
      cache: InMemoryTravelOfflineCache(),
    );

    final destinations = await repository.getExploreDestinations();
    final days = await repository.getItineraryDays();
    final wishlist = await repository.getWishlistItems();

    expect(destinations.map((item) => item.name), contains('Vịnh Hạ Long'));
    expect(days, hasLength(2));
    expect(wishlist, hasLength(2));
  });

  test('travel repository stores API itinerary in cache', () async {
    final cache = InMemoryTravelOfflineCache();
    final repository = TravelRepository(
      api: _ListApiGateway(
        lists: {
          '/itinerary': [
            {
              'day': 3,
              'title': 'Da Nang coast',
              'area': 'Son Tra',
              'activities': ['Beach walk'],
              'offlineReady': true,
            },
          ],
        },
      ),
      cache: cache,
    );

    final days = await repository.getItineraryDays();
    final cachedDays = await cache.getItineraryDays();

    expect(days.single.title, 'Da Nang coast');
    expect(cachedDays.single.title, 'Da Nang coast');
  });

  test('booking repository only creates sandbox bookings', () async {
    final repository = BookingRepository(cache: InMemoryTravelOfflineCache());

    final booking = await repository.createMockHold(
      label: 'Hue food walk',
      now: DateTime(2026, 5, 6),
    );

    expect(booking.sandboxOnly, isTrue);
    expect(booking.amountLabel, 'Không thu tiền thật');
  });

  test('chat repository uses local fallback when service is offline', () async {
    final cache = InMemoryTravelOfflineCache(chatMessages: const []);
    final repository = ChatRepository(api: _ThrowingApiGateway(), cache: cache);

    final response = await repository.sendMessage(
      'Plan a rainy day',
      now: DateTime(2026, 5, 6),
    );
    final cachedMessages = await cache.getChatMessages();

    expect(response.role, 'assistant');
    expect(response.content, contains('Gợi ý local'));
    expect(cachedMessages, hasLength(2));
  });
}

Future<void> _pumpMobileWidget(WidgetTester tester, Widget child) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [
        travelApiGatewayProvider.overrideWith((ref) => _ThrowingApiGateway()),
      ],
      child: MaterialApp(home: child),
    ),
  );
  await tester.pumpAndSettle();
}

class _ThrowingApiGateway implements TravelApiGateway {
  @override
  Future<List<Map<String, dynamic>>> getList(String path, {String? rootKey}) {
    throw StateError('offline');
  }

  @override
  Future<Map<String, dynamic>> postMap(
    String path, {
    Map<String, dynamic>? body,
  }) {
    throw StateError('offline');
  }
}

class _ListApiGateway implements TravelApiGateway {
  _ListApiGateway({required this.lists});

  final Map<String, List<Map<String, dynamic>>> lists;

  @override
  Future<List<Map<String, dynamic>>> getList(
    String path, {
    String? rootKey,
  }) async {
    return lists[path] ?? const [];
  }

  @override
  Future<Map<String, dynamic>> postMap(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    return const {};
  }
}
