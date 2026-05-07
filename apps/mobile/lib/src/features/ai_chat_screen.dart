import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class AiChatScreen extends ConsumerStatefulWidget {
  const AiChatScreen({super.key});

  @override
  ConsumerState<AiChatScreen> createState() => _AiChatScreenState();
}

class _AiChatScreenState extends ConsumerState<AiChatScreen> {
  final _controller = TextEditingController(
    text: 'Đà Nẵng đi 3 ngày ăn gì cho cặp đôi?',
  );
  bool _sending = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final messages = ref.watch(chatMessagesProvider);

    return TravelPageShell(
      title: 'Trợ lý chuyến đi',
      subtitle:
          'Hỏi món ăn, lịch trình, nhịp di chuyển và gói offline. Nếu cần dữ liệu thời gian thực, ứng dụng sẽ nhắc kiểm tra nguồn chính thức.',
      nextRoute: '/itinerary',
      children: [
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final prompt in const [
              'Ăn gì ở gần đây?',
              'Kế hoạch ngày mưa',
              'Chuẩn bị gói offline',
            ])
              ActionChip(
                label: Text(prompt),
                onPressed: () => _send(prompt),
              ),
          ],
        ),
        const SizedBox(height: 12),
        _ChatComposer(
          controller: _controller,
          sending: _sending,
          onSend: () => _send(_controller.text),
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

  Future<void> _send(String prompt) async {
    final message = prompt.trim();
    if (message.isEmpty || _sending) return;
    setState(() => _sending = true);
    try {
      await ref.read(chatRepositoryProvider).sendMessage(message);
      ref.invalidate(chatMessagesProvider);
      _controller.clear();
    } finally {
      if (mounted) {
        setState(() => _sending = false);
      }
    }
  }
}

class _ChatComposer extends StatelessWidget {
  const _ChatComposer({
    required this.controller,
    required this.sending,
    required this.onSend,
  });

  final TextEditingController controller;
  final bool sending;
  final VoidCallback onSend;

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
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Hỏi trợ lý local',
              style: TextStyle(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: controller,
              minLines: 1,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Ngân sách, món ăn, lịch trình, gói offline...',
                filled: true,
                fillColor: const Color(0xFFF7FBFF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 10),
            FilledButton.icon(
              style: FilledButton.styleFrom(
                backgroundColor: chillOrange,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(48),
              ),
              onPressed: sending ? null : onSend,
              icon: sending
                  ? const SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.send_outlined),
              label: Text(sending ? 'Đang gửi...' : 'Gửi câu hỏi'),
            ),
          ],
        ),
      ),
    );
  }
}
