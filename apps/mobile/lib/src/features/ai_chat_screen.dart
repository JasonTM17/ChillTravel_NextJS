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
      title: 'AI Chat',
      subtitle: 'Streaming-ready local AI assistant with suggested questions',
      nextRoute: '/itinerary',
      children: [
        const Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            Chip(label: Text('Food near me')),
            Chip(label: Text('Rain plan')),
            Chip(label: Text('Offline pack')),
          ],
        ),
        const SizedBox(height: 12),
        messages.when(
          data: (items) => Column(
            children: [
              for (final message in items)
                Card(
                  child: ListTile(
                    title: Text(message.role),
                    subtitle: Text(message.content),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Local AI preview unavailable'),
        ),
      ],
    );
  }
}
