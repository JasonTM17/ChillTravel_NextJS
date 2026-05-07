import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../presentation/widgets/travel_page_shell.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return TravelPageShell(
      title: 'Hồ sơ',
      subtitle:
          'Phong cách du lịch, đặt chỗ demo, đánh giá, ngôn ngữ và thiết lập offline.',
      nextRoute: '/home',
      children: [
        const Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.badge_outlined, color: chillBlue),
            title: Text('Food Hunter · Chill Blue'),
            subtitle: Text(
              'Ưu tiên món địa phương, di sản và lịch trình vừa nhịp.',
            ),
          ),
        ),
        const Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.settings_outlined, color: chillTeal),
            title: Text('Thiết lập an toàn'),
            subtitle: Text(
              'Không dùng thanh toán thật; dữ liệu theo thời gian thực cần kiểm tra nguồn chính thức.',
            ),
          ),
        ),
        _ProfileActionCard(
          icon: Icons.workspace_premium_outlined,
          title: 'Chill Rewards',
          body: 'Xem điểm demo, voucher mẫu và booking hub.',
          route: '/loyalty',
        ),
        _ProfileActionCard(
          icon: Icons.help_outline,
          title: 'Trung tâm hỗ trợ',
          body: 'FAQ thanh toán demo, gói offline và trợ lý local-first.',
          route: '/support',
        ),
      ],
    );
  }
}

class _ProfileActionCard extends StatelessWidget {
  const _ProfileActionCard({
    required this.icon,
    required this.title,
    required this.body,
    required this.route,
  });

  final IconData icon;
  final String title;
  final String body;
  final String route;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      child: ListTile(
        leading: Icon(icon, color: chillBlue),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
        subtitle: Text(body),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => context.go(route),
      ),
    );
  }
}
