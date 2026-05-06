import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/api/vietwander_api_client.dart';
import '../data/cache/travel_offline_cache.dart';
import '../data/repositories/booking_repository.dart';
import '../data/repositories/chat_repository.dart';
import '../data/repositories/travel_repository.dart';
import '../domain/travel_models.dart';

final travelOfflineCacheProvider = Provider<TravelOfflineCache>((ref) {
  return InMemoryTravelOfflineCache();
});

final travelRepositoryProvider = Provider<TravelRepository>((ref) {
  return TravelRepository(
    api: ref.watch(travelApiGatewayProvider),
    cache: ref.watch(travelOfflineCacheProvider),
  );
});

final bookingRepositoryProvider = Provider<BookingRepository>((ref) {
  return BookingRepository(cache: ref.watch(travelOfflineCacheProvider));
});

final chatRepositoryProvider = Provider<ChatRepository>((ref) {
  return ChatRepository(
    api: ref.watch(travelApiGatewayProvider),
    cache: ref.watch(travelOfflineCacheProvider),
  );
});

final homeSnapshotProvider = FutureProvider<HomeSnapshot>((ref) {
  return ref.watch(travelRepositoryProvider).getHomeSnapshot();
});

final exploreDestinationsProvider = FutureProvider<List<Destination>>((ref) {
  return ref.watch(travelRepositoryProvider).getExploreDestinations();
});

final itineraryDaysProvider = FutureProvider<List<ItineraryDay>>((ref) {
  return ref.watch(travelRepositoryProvider).getItineraryDays();
});

final wishlistItemsProvider = FutureProvider<List<WishlistItem>>((ref) {
  return ref.watch(travelRepositoryProvider).getWishlistItems();
});

final bookingSummariesProvider = FutureProvider<List<BookingSummary>>((ref) {
  return ref.watch(bookingRepositoryProvider).getBookings();
});

final chatMessagesProvider = FutureProvider<List<ChatMessage>>((ref) {
  return ref.watch(chatRepositoryProvider).getMessages();
});
