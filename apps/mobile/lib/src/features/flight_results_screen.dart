import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../presentation/widgets/travel_page_shell.dart';

class FlightResultsScreen extends StatelessWidget {
  const FlightResultsScreen({super.key});

  static const offers = [
    ('Chill Airways mô phỏng', 'Hà Nội', 'Đà Nẵng', '07:45', '09:10', '1 giờ 25 phút', '1,68 triệu'),
    ('Lotus Local demo', 'TP.HCM', 'Đà Nẵng', '18:20', '19:45', '1 giờ 25 phút', '1,42 triệu'),
    ('Mekong Connect demo', 'Đà Nẵng', 'Bangkok', '10:15', '12:05', '1 giờ 50 phút', '2,89 triệu'),
  ];

  @override
  Widget build(BuildContext context) {
    return TravelPageShell(
      title: 'Vé máy bay',
      subtitle:
          'Kết quả chuyến bay mẫu theo bố cục OTA: giờ bay rõ, hành lý demo, giá local và không có dữ liệu real-time.',
      nextRoute: '/booking',
      children: [
        const _FlightSearchCard(),
        const SizedBox(height: 12),
        for (final offer in offers) ...[
          _FlightOfferCard(offer: offer),
          const SizedBox(height: 12),
        ],
      ],
    );
  }
}

class _FlightSearchCard extends StatelessWidget {
  const _FlightSearchCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Hà Nội → Đà Nẵng', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            SizedBox(height: 8),
            Text('12/08/2026 · 2 người lớn · bay thẳng ưu tiên', style: TextStyle(color: Color(0xFF476273), fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}

class _FlightOfferCard extends StatelessWidget {
  const _FlightOfferCard({required this.offer});

  final (String, String, String, String, String, String, String) offer;

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
            Row(
              children: [
                const Icon(Icons.flight_takeoff_outlined, color: chillBlue),
                const SizedBox(width: 10),
                Expanded(child: Text(offer.$1, style: const TextStyle(fontWeight: FontWeight.w900))),
                const Chip(label: Text('Mock fare')),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(child: _TimeBlock(city: offer.$2, time: offer.$4)),
                Column(
                  children: [
                    Text(offer.$6, style: const TextStyle(fontWeight: FontWeight.w900)),
                    const SizedBox(height: 4),
                    const Text('Bay thẳng', style: TextStyle(color: Color(0xFF6F8594))),
                  ],
                ),
                Expanded(child: _TimeBlock(city: offer.$3, time: offer.$5, alignRight: true)),
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
                  Expanded(
                    child: Text(
                      'Giá mẫu từ ${offer.$7}/khách. Không có dữ liệu real-time.',
                      style: const TextStyle(color: chillOrange, fontWeight: FontWeight.w900),
                    ),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: chillOrange, foregroundColor: Colors.white),
                    onPressed: () => context.go('/booking'),
                    child: const Text('Chọn'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TimeBlock extends StatelessWidget {
  const _TimeBlock({required this.city, required this.time, this.alignRight = false});

  final String city;
  final String time;
  final bool alignRight;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: alignRight ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Text(time, style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w900)),
        Text(city, style: const TextStyle(color: Color(0xFF476273), fontWeight: FontWeight.w700)),
      ],
    );
  }
}
