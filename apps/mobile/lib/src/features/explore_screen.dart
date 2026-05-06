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
      title: 'Khám phá',
      subtitle:
          'Lọc điểm đến, xem đánh giá, so sánh giá mẫu và lưu vào chuyến đi offline.',
      nextRoute: '/destination',
      children: [
        const Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Biển')),
            Chip(label: Text('Gia đình')),
            Chip(label: Text('Ẩm thực')),
            Chip(label: Text('Hủy demo miễn phí')),
          ],
        ),
        const SizedBox(height: 12),
        destinations.when(
          data: (items) => Column(
            children: [
              for (final destination in items)
                Card(
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: const BorderSide(color: Color(0xFFD9ECFB)),
                  ),
                  child: ListTile(
                    title: Text(
                      destination.name,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(
                      '${destination.region} · ${destination.summary}',
                    ),
                    trailing: Text(
                      destination.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        color: chillOrange,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Điểm đến offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}
