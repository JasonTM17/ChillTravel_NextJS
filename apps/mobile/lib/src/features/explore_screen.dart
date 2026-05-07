import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../application/travel_providers.dart';
import '../domain/travel_models.dart';
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
              for (final destination in items) ...[
                _DestinationListingCard(destination: destination),
                const SizedBox(height: 12),
              ],
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Điểm đến offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}

class _DestinationListingCard extends StatelessWidget {
  const _DestinationListingCard({required this.destination});

  final Destination destination;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 132,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFBFE8FF), Color(0xFFFFF0D8)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Center(
              child: Icon(Icons.photo_camera_back_outlined, size: 48, color: chillBlue),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        destination.name,
                        style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w900),
                      ),
                    ),
                    const Icon(Icons.star_rounded, color: chillOrange, size: 18),
                    Text(
                      destination.rating.toStringAsFixed(1),
                      style: const TextStyle(color: chillOrange, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  '${destination.region} · ${destination.summary}',
                  style: const TextStyle(color: Color(0xFF476273), height: 1.35, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    for (final tag in destination.tags.take(3))
                      Chip(
                        label: Text(tag),
                        backgroundColor: const Color(0xFFF3FAFF),
                        side: const BorderSide(color: Color(0xFFD9ECFB)),
                      ),
                  ],
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF7ED),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFFFD9BD)),
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Giá mẫu từ', style: TextStyle(color: Color(0xFF6F8594), fontWeight: FontWeight.w800)),
                            SizedBox(height: 3),
                            Text('1,8 triệu/ngày', style: TextStyle(fontSize: 18, color: chillOrange, fontWeight: FontWeight.w900)),
                          ],
                        ),
                      ),
                      FilledButton(
                        style: FilledButton.styleFrom(backgroundColor: chillOrange, foregroundColor: Colors.white),
                        onPressed: () => context.go('/booking'),
                        child: const Text('Xem ưu đãi'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
