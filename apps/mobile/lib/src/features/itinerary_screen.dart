import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class ItineraryScreen extends ConsumerWidget {
  const ItineraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final days = ref.watch(itineraryDaysProvider);

    return TravelPageShell(
      title: 'Lịch trình',
      subtitle:
          'Timeline theo ngày, checklist, ngân sách và bản đồ preview có thể lưu offline.',
      nextRoute: '/booking',
      children: [
        days.when(
          data: (items) => Column(
            children: [
              for (final day in items)
                Card(
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: const BorderSide(color: Color(0xFFD9ECFB)),
                  ),
                  child: CheckboxListTile(
                    value: day.offlineReady,
                    onChanged: null,
                    title: Text(
                      'Ngày ${day.day}: ${day.title}',
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(
                      '${day.area} · ${day.activities.join(', ')}',
                    ),
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Lịch trình offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}
