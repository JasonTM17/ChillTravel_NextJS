import '../../domain/travel_models.dart';
import '../cache/travel_offline_cache.dart';

class BookingRepository {
  BookingRepository({required TravelOfflineCache cache}) : _cache = cache;

  final TravelOfflineCache _cache;

  Future<List<BookingSummary>> getBookings() {
    return _cache.getBookingSummaries();
  }

  Future<BookingSummary> createMockHold({
    required String label,
    DateTime? now,
  }) async {
    final timestamp = now ?? DateTime.now();
    final booking = BookingSummary(
      id: 'mock-${timestamp.millisecondsSinceEpoch}',
      label: label,
      status: 'Giữ chỗ demo',
      amountLabel: 'Không phát sinh giao dịch thật',
      sandboxOnly: true,
      updatedAt: timestamp,
    );

    await _cache.addBookingSummary(booking);
    return booking;
  }
}
