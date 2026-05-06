import '../../core/api/vietwander_api_client.dart';
import '../../domain/travel_models.dart';
import '../cache/travel_offline_cache.dart';

class TravelRepository {
  TravelRepository({
    required TravelApiGateway api,
    required TravelOfflineCache cache,
  }) : _api = api,
       _cache = cache;

  final TravelApiGateway _api;
  final TravelOfflineCache _cache;

  Future<HomeSnapshot> getHomeSnapshot() async {
    final itineraryDays = await getItineraryDays();
    final wishlistItems = await getWishlistItems();
    final bookings = await getBookingSummaries();

    return HomeSnapshot(
      itineraryDays: itineraryDays.length,
      savedItems: wishlistItems.length,
      sandboxBookings: bookings.where((booking) => booking.sandboxOnly).length,
    );
  }

  Future<List<Destination>> getExploreDestinations() async {
    try {
      final rows = await _api.getList('/destinations', rootKey: 'destinations');
      final destinations = rows
          .map(Destination.fromJson)
          .toList(growable: false);
      if (destinations.isNotEmpty) {
        return destinations;
      }
    } catch (_) {
      // Local cache keeps the mobile shell usable while API services are offline.
    }

    return _cache.getExploreDestinations();
  }

  Future<List<ItineraryDay>> getItineraryDays() async {
    try {
      final rows = await _api.getList('/itinerary', rootKey: 'days');
      final days = rows.map(ItineraryDay.fromJson).toList(growable: false);
      if (days.isNotEmpty) {
        await _cache.cacheItineraryDays(days);
        return days;
      }
    } catch (_) {
      // Intentionally falls back to the local mobile cache.
    }

    return _cache.getItineraryDays();
  }

  Future<List<WishlistItem>> getWishlistItems() async {
    try {
      final rows = await _api.getList('/wishlist', rootKey: 'items');
      final items = rows.map(WishlistItem.fromJson).toList(growable: false);
      if (items.isNotEmpty) {
        await _cache.cacheWishlistItems(items);
        return items;
      }
    } catch (_) {
      // Intentionally falls back to the local mobile cache.
    }

    return _cache.getWishlistItems();
  }

  Future<void> saveWishlistItem(WishlistItem item) {
    return _cache.addWishlistItem(item);
  }

  Future<List<BookingSummary>> getBookingSummaries() async {
    try {
      final rows = await _api.getList('/bookings', rootKey: 'bookings');
      final bookings = rows
          .map(BookingSummary.fromJson)
          .toList(growable: false);
      if (bookings.isNotEmpty) {
        await _cache.cacheBookingSummaries(bookings);
        return bookings;
      }
    } catch (_) {
      // Intentionally falls back to the local mobile cache.
    }

    return _cache.getBookingSummaries();
  }
}
