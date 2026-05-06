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
      title: 'Wishlist',
      subtitle: 'Saved places, hotels, and experiences grouped by trip',
      nextRoute: '/profile',
      children: [
        wishlist.when(
          data: (items) => Column(
            children: [
              for (final item in items)
                Card(
                  child: ListTile(
                    title: Text(item.title),
                    subtitle: Text('${item.type} - ${item.location}'),
                    trailing: item.offlineAvailable
                        ? const Icon(Icons.offline_pin_outlined)
                        : null,
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Offline wishlist unavailable'),
        ),
      ],
    );
  }
}
