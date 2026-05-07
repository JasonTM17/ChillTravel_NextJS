import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../presentation/widgets/travel_page_shell.dart';

class BookingScreen extends ConsumerWidget {
  const BookingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookings = ref.watch(bookingSummariesProvider);

    return TravelPageShell(
      title: 'Đặt chỗ',
      subtitle:
          'Thanh toán demo — không phát sinh giao dịch thật. Chọn phương thức mô phỏng và nhận vé QR.',
      nextRoute: '/wishlist',
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF7ED),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFFD9BD)),
          ),
          child: const Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.warning_amber_rounded, color: chillOrange),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Thanh toán demo — không phát sinh giao dịch thật. Không nhập hoặc lưu số thẻ thật.',
                  style: TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: const [
            Chip(label: Text('Thẻ mô phỏng')),
            Chip(label: Text('Momo demo')),
            Chip(label: Text('VNPay demo')),
            Chip(label: Text('ZaloPay demo')),
            Chip(label: Text('PayPal thử nghiệm')),
            Chip(label: Text('Trả tại nơi đến')),
          ],
        ),
        const SizedBox(height: 12),
        FilledButton.tonal(
          onPressed: () async {
            await ref
                .read(bookingRepositoryProvider)
                .createMockHold(label: 'Gói thiết yếu Việt Nam');
            ref.invalidate(bookingSummariesProvider);
          },
          child: const Text('Tạo giữ chỗ demo'),
        ),
        const SizedBox(height: 12),
        bookings.when(
          data: (items) => Column(
            children: [
              for (final booking in items)
                Card(
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: const BorderSide(color: Color(0xFFD9ECFB)),
                  ),
                  child: ListTile(
                    title: Text(
                      booking.label,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(
                      '${booking.status} · ${booking.amountLabel}',
                    ),
                    trailing: booking.sandboxOnly
                        ? const Icon(
                            Icons.verified_user_outlined,
                            color: chillTeal,
                          )
                        : null,
                  ),
                ),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Đặt chỗ offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}
