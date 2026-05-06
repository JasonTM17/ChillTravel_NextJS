import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class WishlistScreen extends ConsumerWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wishlist = ref.watch(wishlistItemsProvider);

    return TravelPageShell(
      title: 'Yêu thích',
      subtitle: 'Điểm đến, khách sạn và trải nghiệm đã lưu theo từng chuyến.',
      nextRoute: '/profile',
      children: [
        wishlist.when(
          data: (items) => Column(
            children: [
              for (final item in items)
                Card(
                  color: Colors.white,
                  child: ListTile(
                    title: Text(
                      item.title,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text('${item.type} · ${item.location}'),
                    trailing: item.offlineAvailable
                        ? const Icon(
                            Icons.offline_pin_outlined,
                            color: chillTeal,
                          )
                        : null,
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Yêu thích offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}
