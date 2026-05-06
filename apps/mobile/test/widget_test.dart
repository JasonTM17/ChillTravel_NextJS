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
    expect(find.text('Vietnam-first planning'), findsOneWidget);
  });

  testWidgets('home renders offline trip metrics', (tester) async {
    await _pumpMobileWidget(tester, const HomeScreen());

    expect(find.text('Itinerary days'), findsOneWidget);
    expect(find.text('Saved items'), findsOneWidget);
    expect(find.text('Sandbox bookings'), findsOneWidget);
  });

  testWidgets('explore renders cached destinations', (tester) async {
    await _pumpMobileWidget(tester, const ExploreScreen());

    expect(find.text('Ha Long Bay'), findsOneWidget);
    expect(find.text('Hue Imperial City'), findsOneWidget);
  });

  testWidgets('planner renders cached itinerary days', (tester) async {
    await _pumpMobileWidget(tester, const ItineraryScreen());

    expect(find.text('Day 1: Hanoi arrival'), findsOneWidget);
    expect(find.text('Day 2: Ninh Binh day trip'), findsOneWidget);
  });

  testWidgets('chat renders local AI guidance without OpenAI key', (
    tester,
  ) async {
    await _pumpMobileWidget(tester, const AiChatScreen());

    expect(find.text('Food near me'), findsOneWidget);
    expect(find.text('assistant'), findsOneWidget);
    expect(find.textContaining('offline packing'), findsOneWidget);
  });

  testWidgets('booking creates sandbox holds locally', (tester) async {
    await _pumpMobileWidget(tester, const BookingScreen());

    expect(find.text('Ha Long overnight cruise'), findsOneWidget);

    await tester.tap(find.text('Create mock hold'));
    await tester.pumpAndSettle();

    expect(find.text('Vietnam essentials pack'), findsOneWidget);
    expect(find.textContaining('No real charge'), findsOneWidget);
  });

  testWidgets('wishlist renders cached saved items', (tester) async {
    await _pumpMobileWidget(tester, const WishlistScreen());

    expect(find.text('Hoi An lantern night'), findsOneWidget);
    expect(find.text('Sapa terrace trek'), findsOneWidget);
  });

  test('travel repository falls back to offline cache', () async {
    final repository = TravelRepository(
      api: _ThrowingApiGateway(),
      cache: InMemoryTravelOfflineCache(),
    );

    final destinations = await repository.getExploreDestinations();
    final days = await repository.getItineraryDays();
    final wishlist = await repository.getWishlistItems();

    expect(destinations.map((item) => item.name), contains('Ha Long Bay'));
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
    expect(booking.amountLabel, 'No real charge');
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
    expect(response.content, contains('Local guide fallback'));
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
