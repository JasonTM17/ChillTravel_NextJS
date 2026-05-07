import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class DestinationDetailScreen extends StatelessWidget {
  const DestinationDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return TravelPageShell(
      title: 'Chi tiết điểm đến',
      subtitle:
          'Xem ảnh, mùa đẹp, món nên thử, hoạt động nổi bật và lưu gói demo vào lịch trình offline.',
      nextRoute: '/chat',
      children: const [
        _HeroGalleryCard(),
        SizedBox(height: 12),
        _QuickFacts(),
        SizedBox(height: 12),
        _ExperiencePanel(),
        SizedBox(height: 12),
        _AssistantCard(),
      ],
    );
  }
}

class _HeroGalleryCard extends StatelessWidget {
  const _HeroGalleryCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 176,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFBFE8FF), Color(0xFFEAF7FF)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Center(
              child: Icon(Icons.beach_access_outlined, size: 64, color: chillBlue),
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Đà Nẵng · Sơn Trà · Hội An',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                ),
                SizedBox(height: 8),
                Text(
                  'Biển, ẩm thực miền Trung, phố cổ và lịch trình 4 ngày dễ demo cho portfolio.',
                  style: TextStyle(
                    color: Color(0xFF476273),
                    fontWeight: FontWeight.w700,
                    height: 1.4,
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

class _QuickFacts extends StatelessWidget {
  const _QuickFacts();

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 10,
      runSpacing: 10,
      children: const [
        _FactChip(icon: Icons.calendar_month_outlined, label: 'Mùa đẹp', value: 'Tháng 3-8'),
        _FactChip(icon: Icons.payments_outlined, label: 'Ngân sách', value: 'Từ 1,8 triệu/ngày'),
        _FactChip(icon: Icons.verified_user_outlined, label: 'An toàn', value: 'Cao'),
      ],
    );
  }
}

class _FactChip extends StatelessWidget {
  const _FactChip({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 168,
      child: Card(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: Color(0xFFD9ECFB)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: chillBlue),
              const SizedBox(height: 10),
              Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF6F8594),
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 4),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w900)),
            ],
          ),
        ),
      ),
    );
  }
}

class _ExperiencePanel extends StatelessWidget {
  const _ExperiencePanel();

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
              'Ăn gì và chơi gì',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: const [
                Chip(label: Text('Mì Quảng')),
                Chip(label: Text('Hải sản Mỹ Khê')),
                Chip(label: Text('Sơn Trà')),
                Chip(label: Text('Hội An buổi tối')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AssistantCard extends StatelessWidget {
  const _AssistantCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color(0xFFFFF7ED),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFFFD9BD)),
      ),
      child: const Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.support_agent_outlined, color: chillOrange),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Hỏi trợ lý chuyến đi để đổi thành lịch trình, ước tính ngân sách hoặc lưu gói offline.',
                style: TextStyle(fontWeight: FontWeight.w900, height: 1.35),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
