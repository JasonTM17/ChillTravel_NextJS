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
      title: 'Trang chủ',
      subtitle:
          'Tìm khách sạn, hoạt động, xe đưa đón và lịch trình thông minh trong một luồng đặt chuyến rõ ràng.',
      nextRoute: '/explore',
      children: [
        const _SearchCard(),
        const SizedBox(height: 14),
        const _ServiceGrid(),
        const SizedBox(height: 14),
        const _PromoCard(),
        const SizedBox(height: 14),
        snapshot.when(
          data: (data) => Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _MetricTile(
                label: 'Ngày lịch trình',
                value: '${data.itineraryDays}',
              ),
              _MetricTile(label: 'Đã lưu', value: '${data.savedItems}'),
              _MetricTile(
                label: 'Đặt chỗ demo',
                value: '${data.sandboxBookings}',
              ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Bảng chuyến đi offline chưa sẵn sàng'),
        ),
        const SizedBox(height: 14),
        const _OfflinePackCard(),
      ],
    );
  }
}

class _SearchCard extends StatelessWidget {
  const _SearchCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Bạn muốn đi đâu?',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
            const SizedBox(height: 12),
            TextField(
              readOnly: true,
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.location_on_outlined),
                hintText: 'Đà Nẵng, Phú Quốc, Sapa...',
                filled: true,
                fillColor: const Color(0xFFF7FBFF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 12),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: chillOrange,
                minimumSize: const Size.fromHeight(48),
              ),
              onPressed: () {},
              child: const Text('Tìm kiếm'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ServiceGrid extends StatelessWidget {
  const _ServiceGrid();

  static const services = [
    (Icons.hotel_outlined, 'Khách sạn'),
    (Icons.flight_takeoff_outlined, 'Chuyến bay'),
    (Icons.confirmation_num_outlined, 'Hoạt động'),
    (Icons.directions_car_outlined, 'Xe đưa đón'),
    (Icons.map_outlined, 'Bản đồ'),
    (Icons.event_note_outlined, 'Lịch trình'),
  ];

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 3,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        for (final service in services)
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFD9ECFB)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(service.$1, color: chillBlue),
                const SizedBox(height: 8),
                Text(
                  service.$2,
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

class _PromoCard extends StatelessWidget {
  const _PromoCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        color: const Color(0xFFFFF7ED),
        border: Border.all(color: const Color(0xFFFFD9BD)),
      ),
      child: const Row(
        children: [
          Icon(Icons.local_offer_outlined, color: chillOrange),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              'Mã demo cuối tuần: giảm mẫu 12%, không phát sinh giao dịch thật.',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
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
      width: 154,
      child: Card(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFFD9ECFB)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: chillBlue,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      ),
    );
  }
}

class _OfflinePackCard extends StatelessWidget {
  const _OfflinePackCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.offline_pin_outlined, color: chillTeal),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Gói offline đã lưu',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            const Text(
              'Lịch trình, yêu thích, vé QR demo và checklist an toàn luôn có bản local khi mất mạng.',
              style: TextStyle(
                color: Color(0xFF476273),
                fontWeight: FontWeight.w700,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: const [
                Chip(label: Text('Lịch trình')),
                Chip(label: Text('Yêu thích')),
                Chip(label: Text('Vé QR demo')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
