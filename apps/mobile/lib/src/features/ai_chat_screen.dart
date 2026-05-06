import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class AiChatScreen extends ConsumerWidget {
  const AiChatScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final messages = ref.watch(chatMessagesProvider);

    return TravelPageShell(
      title: 'Trợ lý chuyến đi',
      subtitle:
          'Hỏi món ăn, lịch trình, nhịp di chuyển và gói offline. Nếu cần dữ liệu thời gian thực, ứng dụng sẽ nhắc kiểm tra nguồn chính thức.',
      nextRoute: '/itinerary',
      children: [
        const Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Ăn gì ở gần đây?')),
            Chip(label: Text('Kế hoạch ngày mưa')),
            Chip(label: Text('Chuẩn bị gói offline')),
          ],
        ),
        const SizedBox(height: 12),
        messages.when(
          data: (items) => Column(
            children: [
              for (final message in items)
                Card(
                  color: Colors.white,
                  child: ListTile(
                    title: Text(
                      message.role == 'assistant' ? 'Trợ lý' : 'Bạn',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(message.content),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) =>
              const Text('Bản xem trước trợ lý local chưa sẵn sàng'),
        ),
      ],
    );
  }
}
