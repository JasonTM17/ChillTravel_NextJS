import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class ExploreScreen extends ConsumerWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final destinations = ref.watch(exploreDestinationsProvider);

    return TravelPageShell(
      title: 'Explore',
      subtitle: 'Filter chips, destination cards, infinite-scroll-ready layout',
      nextRoute: '/destination',
      children: [
        destinations.when(
          data: (items) => Column(
            children: [
              for (final destination in items)
                Card(
                  child: ListTile(
                    title: Text(destination.name),
                    subtitle: Text(
                      '${destination.region} - ${destination.summary}',
                    ),
                    trailing: Text(destination.rating.toStringAsFixed(1)),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Offline destinations unavailable'),
        ),
      ],
    );
  }
}
