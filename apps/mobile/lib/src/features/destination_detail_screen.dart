import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class DestinationDetailScreen extends StatelessWidget {
  const DestinationDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const TravelPageShell(
      title: 'Chi tiết điểm đến',
      subtitle:
          'Ảnh dẫn đường, mùa đẹp, món nên thử, hoạt động nổi bật và nút lưu vào lịch trình.',
      nextRoute: '/chat',
      children: [
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.photo_library_outlined, color: chillBlue),
            title: Text('Đà Nẵng · Sơn Trà · Hội An'),
            subtitle: Text(
              'Biển, ẩm thực miền Trung, phố cổ và lịch trình 4 ngày dễ demo.',
            ),
          ),
        ),
        Card(
          color: Colors.white,
          child: ListTile(
            leading: Icon(Icons.restaurant_outlined, color: chillOrange),
            title: Text('Ăn gì và chơi gì'),
            subtitle: Text(
              'Mì Quảng, hải sản, Bà Nà demo, phố cổ, cà phê ven sông.',
            ),
          ),
        ),
      ],
    );
  }
}
