import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final snapshot = ref.watch(homeSnapshotProvider);

    return TravelPageShell(
      title: 'Home',
      subtitle: 'Search, AI planner, Top Vietnam, World picks, saved trips',
      nextRoute: '/explore',
      children: [
        snapshot.when(
          data: (data) => Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _MetricTile(
                label: 'Itinerary days',
                value: '${data.itineraryDays}',
              ),
              _MetricTile(label: 'Saved items', value: '${data.savedItems}'),
              _MetricTile(
                label: 'Sandbox bookings',
                value: '${data.sandboxBookings}',
              ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Offline trip board unavailable'),
        ),
      ],
    );
  }
}

class _MetricTile extends StatelessWidget {
  const _MetricTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 4),
              Text(label),
            ],
          ),
        ),
      ),
    );
  }
}
