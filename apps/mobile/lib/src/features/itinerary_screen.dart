import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class ItineraryScreen extends ConsumerWidget {
  const ItineraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final days = ref.watch(itineraryDaysProvider);

    return TravelPageShell(
      title: 'Itinerary',
      subtitle:
          'Day-by-day cards, checklist, budget, map preview, offline pack',
      nextRoute: '/booking',
      children: [
        days.when(
          data: (items) => Column(
            children: [
              for (final day in items)
                Card(
                  child: CheckboxListTile(
                    value: day.offlineReady,
                    onChanged: null,
                    title: Text('Day ${day.day}: ${day.title}'),
                    subtitle: Text(
                      '${day.area} - ${day.activities.join(', ')}',
                    ),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Offline itinerary unavailable'),
        ),
      ],
    );
  }
}
