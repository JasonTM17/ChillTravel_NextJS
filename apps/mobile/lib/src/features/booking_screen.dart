import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class BookingScreen extends ConsumerWidget {
  const BookingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookings = ref.watch(bookingSummariesProvider);

    return TravelPageShell(
      title: 'Booking',
      subtitle: 'Mock payment only. Demo payment - no real transaction.',
      nextRoute: '/wishlist',
      children: [
        FilledButton.tonal(
          onPressed: () async {
            await ref
                .read(bookingRepositoryProvider)
                .createMockHold(label: 'Vietnam essentials pack');
            ref.invalidate(bookingSummariesProvider);
          },
          child: const Text('Create mock hold'),
        ),
        const SizedBox(height: 12),
        bookings.when(
          data: (items) => Column(
            children: [
              for (final booking in items)
                Card(
                  child: ListTile(
                    title: Text(booking.label),
                    subtitle: Text(
                      '${booking.status} - ${booking.amountLabel}',
                    ),
                    trailing: booking.sandboxOnly
                        ? const Icon(Icons.verified_user_outlined)
                        : null,
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Offline bookings unavailable'),
        ),
      ],
    );
  }
}
