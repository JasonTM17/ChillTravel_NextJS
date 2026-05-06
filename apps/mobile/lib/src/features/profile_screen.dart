import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const TravelPageShell(
      title: 'Hồ sơ',
      subtitle:
          'Phong cách du lịch, đặt chỗ demo, đánh giá, ngôn ngữ và thiết lập offline.',
      nextRoute: '/home',
      children: [
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.badge_outlined, color: chillBlue),
            title: Text('Food Hunter · Culture Seeker'),
            subtitle: Text(
              'Ưu tiên món địa phương, di sản và lịch trình vừa nhịp.',
            ),
          ),
        ),
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.settings_outlined, color: chillTeal),
            title: Text('Thiết lập an toàn'),
            subtitle: Text(
              'Không dùng thanh toán thật; dữ liệu real-time cần kiểm tra nguồn chính thức.',
            ),
          ),
        ),
      ],
    );
  }
}
