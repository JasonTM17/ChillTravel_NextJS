import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../presentation/widgets/travel_page_shell.dart';

class LoyaltyScreen extends StatelessWidget {
  const LoyaltyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return TravelPageShell(
      title: 'Chill Rewards',
      subtitle:
          'Bảng thành viên demo: điểm, voucher mẫu, gói offline và booking hub không có giá trị thanh toán thật.',
      nextRoute: '/booking',
      children: [
        const _TierHero(),
        const SizedBox(height: 12),
        const _RewardGrid(),
        const SizedBox(height: 12),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: chillOrange, foregroundColor: Colors.white, minimumSize: const Size.fromHeight(52)),
          onPressed: () => context.go('/booking'),
          child: const Text('Dùng ưu đãi demo'),
        ),
      ],
    );
  }
}

class _TierHero extends StatelessWidget {
  const _TierHero();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: chillBlue,
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Chip(label: Text('Chill Blue')),
          SizedBox(height: 14),
          Text('1.280 điểm demo', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900)),
          SizedBox(height: 8),
          Text('Cần thêm 1.220 điểm mẫu để lên Chill Teal.', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          SizedBox(height: 14),
          LinearProgressIndicator(value: 0.51, color: Color(0xFFFFCF88), backgroundColor: Colors.white24),
        ],
      ),
    );
  }
}

class _RewardGrid extends StatelessWidget {
  const _RewardGrid();

  static const rewards = [
    (Icons.local_offer_outlined, 'Voucher mẫu 120K', 'Không có giá trị thanh toán thật.'),
    (Icons.hotel_outlined, 'Nâng hạng phòng demo', 'Chỉ hiển thị trong booking mock.'),
    (Icons.offline_pin_outlined, '5 gói offline', 'Lưu lịch trình và QR demo local.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final reward in rewards)
          Card(
            color: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
              side: const BorderSide(color: Color(0xFFD9ECFB)),
            ),
            child: ListTile(
              leading: Icon(reward.$1, color: chillOrange),
              title: Text(reward.$2, style: const TextStyle(fontWeight: FontWeight.w900)),
              subtitle: Text(reward.$3),
            ),
          ),
      ],
    );
  }
}
