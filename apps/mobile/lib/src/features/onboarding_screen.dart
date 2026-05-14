import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const TravelPageShell(
      title: 'WANDERVIET',
      subtitle:
          'Chọn ngôn ngữ, phong cách đi và bắt đầu một chuyến du lịch Việt hóa, rõ giá, rõ ranh giới demo.',
      nextRoute: '/home',
      children: [
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.language_outlined, color: chillBlue),
            title: Text('Tiếng Việt là mặc định'),
            subtitle: Text(
              'Luồng tìm kiếm, đặt chỗ, offline pack và cảnh báo thanh toán đều được Việt hóa.',
            ),
          ),
        ),
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.favorite_border, color: chillOrange),
            title: Text('Phong cách du lịch'),
            subtitle: Text(
              'Ẩm thực, biển, văn hóa, gia đình, tiết kiệm hoặc nghỉ dưỡng.',
            ),
          ),
        ),
      ],
    );
  }
}
