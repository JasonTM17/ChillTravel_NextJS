import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const TravelPageShell(
      title: 'Hỗ trợ',
      subtitle:
          'Trung tâm hỗ trợ demo cho thanh toán mô phỏng, trợ lý local-first, gói offline và tài khoản ChillTravel.',
      nextRoute: '/profile',
      children: [
        _SupportSearchCard(),
        SizedBox(height: 12),
        _FaqTile(
          icon: Icons.payments_outlined,
          title: 'Thanh toán demo hoạt động thế nào?',
          body: 'Chọn phương thức mô phỏng, xác nhận giữ chỗ mẫu và nhận QR demo. Không nhập thẻ thật.',
        ),
        _FaqTile(
          icon: Icons.support_agent_outlined,
          title: 'Trợ lý có dữ liệu real-time không?',
          body: 'Không. Giá vé bay, visa và thời tiết hiện tại phải kiểm tra nguồn chính thức.',
        ),
        _FaqTile(
          icon: Icons.offline_pin_outlined,
          title: 'Gói offline lưu gì?',
          body: 'Lưu lịch trình, yêu thích, booking demo, QR mẫu và checklist an toàn trong cache local.',
        ),
      ],
    );
  }
}

class _SupportSearchCard extends StatelessWidget {
  const _SupportSearchCard();

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
        child: TextField(
          readOnly: true,
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.search, color: chillBlue),
            hintText: 'Tìm thanh toán demo, QR, gói offline...',
            filled: true,
            fillColor: const Color(0xFFF7FBFF),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
          ),
        ),
      ),
    );
  }
}

class _FaqTile extends StatelessWidget {
  const _FaqTile({required this.icon, required this.title, required this.body});

  final IconData icon;
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: ListTile(
        leading: Icon(icon, color: chillBlue),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w900)),
        subtitle: Text(body),
      ),
    );
  }
}
