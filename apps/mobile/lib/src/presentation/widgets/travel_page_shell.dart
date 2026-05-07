import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

const chillBlue = Color(0xFF0277D4);
const chillSky = Color(0xFFF3FAFF);
const chillOrange = Color(0xFFFF6D1A);
const chillTeal = Color(0xFF0F8B7B);
const chillNavy = Color(0xFF071827);

class TravelPageShell extends StatelessWidget {
  const TravelPageShell({
    required this.title,
    required this.subtitle,
    required this.children,
    this.nextRoute,
    super.key,
  });

  final String title;
  final String subtitle;
  final List<Widget> children;
  final String? nextRoute;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: chillSky,
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: chillNavy,
        elevation: 0,
        title: const Text(
          'ChillTravel',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        actions: [
          IconButton(
            tooltip: 'Hỗ trợ',
            onPressed: () {},
            icon: const Icon(Icons.support_agent_outlined),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFEAF6FF),
        selectedIndex: _selectedIndex(title),
        onDestinationSelected: (index) {
          final route = switch (index) {
            0 => '/home',
            1 => '/explore',
            2 => '/itinerary',
            3 => '/booking',
            _ => '/profile',
          };
          context.go(route);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Trang chủ',
          ),
          NavigationDestination(
            icon: Icon(Icons.search_outlined),
            selectedIcon: Icon(Icons.search),
            label: 'Khám phá',
          ),
          NavigationDestination(
            icon: Icon(Icons.event_note_outlined),
            selectedIcon: Icon(Icons.event_note),
            label: 'Lịch trình',
          ),
          NavigationDestination(
            icon: Icon(Icons.confirmation_num_outlined),
            selectedIcon: Icon(Icons.confirmation_num),
            label: 'Đặt chỗ',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Hồ sơ',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
        children: [
          _HeroPanel(title: title, subtitle: subtitle),
          const SizedBox(height: 16),
          ...children,
          const SizedBox(height: 16),
          const _TrustTile(
            icon: Icons.offline_pin_outlined,
            title: 'Gói offline đã sẵn sàng',
            subtitle:
                'Lịch trình, yêu thích và đặt chỗ demo có bản lưu local khi mất mạng.',
          ),
          const _TrustTile(
            icon: Icons.shield_outlined,
            title: 'Thanh toán demo',
            subtitle:
                'Không phát sinh giao dịch thật, không lưu thẻ thật, chỉ mô phỏng giữ chỗ.',
          ),
          const _TrustTile(
            icon: Icons.route_outlined,
            title: 'Trợ lý local-first',
            subtitle:
                'Gợi ý chuyến đi dùng service/RAG local khi chạy, không cần khóa cloud cho runtime.',
          ),
          if (nextRoute != null) ...[
            const SizedBox(height: 16),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: chillOrange,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(52),
              ),
              onPressed: () => context.go(nextRoute!),
              child: const Text('Tiếp tục'),
            ),
          ],
        ],
      ),
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: Colors.white,
        border: Border.all(color: const Color(0xFFD9ECFB)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14024478),
            blurRadius: 28,
            offset: Offset(0, 14),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: const Color(0xFFEAF6FF),
                ),
                child: const Icon(Icons.explore_outlined, color: chillBlue),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: chillNavy,
                    fontSize: 26,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            subtitle,
            style: const TextStyle(
              color: Color(0xFF476273),
              fontSize: 15,
              height: 1.45,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _TrustTile extends StatelessWidget {
  const _TrustTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: ListTile(
        leading: Icon(icon, color: chillTeal),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
        subtitle: Text(subtitle),
      ),
    );
  }
}

int _selectedIndex(String title) {
  if (title.contains('Khám phá')) return 1;
  if (title.contains('Lịch trình')) return 2;
  if (title.contains('Đặt chỗ')) return 3;
  if (title.contains('Hồ sơ')) return 4;
  return 0;
}
