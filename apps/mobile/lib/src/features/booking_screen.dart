import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../application/travel_providers.dart';
import '../domain/travel_models.dart';
import '../presentation/widgets/travel_page_shell.dart';

class BookingScreen extends ConsumerWidget {
  const BookingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookings = ref.watch(bookingSummariesProvider);

    return TravelPageShell(
      title: 'Đặt chỗ',
      subtitle:
          'Checkout demo theo luồng OTA: xem tóm tắt chuyến đi, chọn phương thức mô phỏng và nhận vé QR mẫu.',
      nextRoute: '/wishlist',
      children: [
        const _DemoPaymentBanner(),
        const SizedBox(height: 12),
        const _TripSummaryCard(),
        const SizedBox(height: 12),
        const _CheckoutStepper(),
        const SizedBox(height: 12),
        const _PaymentMethodPanel(),
        const SizedBox(height: 12),
        const _QrPreviewCard(),
        const SizedBox(height: 12),
        FilledButton(
          style: FilledButton.styleFrom(
            backgroundColor: chillOrange,
            foregroundColor: Colors.white,
            minimumSize: const Size.fromHeight(52),
          ),
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
              for (final booking in items) _BookingCard(booking: booking),
            ],
          ),
          loading: () => const LinearProgressIndicator(),
          error: (_, __) => const Text('Đặt chỗ offline chưa sẵn sàng'),
        ),
      ],
    );
  }
}

class _DemoPaymentBanner extends StatelessWidget {
  const _DemoPaymentBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
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
              style: TextStyle(fontWeight: FontWeight.w900, height: 1.35),
            ),
          ),
        ],
      ),
    );
  }
}

class _TripSummaryCard extends StatelessWidget {
  const _TripSummaryCard();

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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEAF6FF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.hotel_outlined, color: chillBlue),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Đà Nẵng · Hội An 4 ngày',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text('2 khách · 1 phòng · nhịp cân bằng'),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            const Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                Chip(label: Text('Hủy demo miễn phí')),
                Chip(label: Text('QR mẫu')),
                Chip(label: Text('Lưu offline')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _CheckoutStepper extends StatelessWidget {
  const _CheckoutStepper();

  static const steps = [
    ('1', 'Thông tin khách', 'Tên demo và liên hệ local'),
    ('2', 'Phương thức demo', 'Thẻ mô phỏng, ví demo hoặc trả tại nơi đến'),
    ('3', 'Vé QR mẫu', 'Mã giữ chỗ để test portfolio'),
  ];

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
        child: Column(
          children: [
            for (final step in steps)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: chillBlue,
                      child: Text(
                        step.$1,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            step.$2,
                            style: const TextStyle(fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            step.$3,
                            style: const TextStyle(color: Color(0xFF476273)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _PaymentMethodPanel extends StatelessWidget {
  const _PaymentMethodPanel();

  static const methods = [
    'Thẻ mô phỏng',
    'Momo demo',
    'VNPay demo',
    'ZaloPay demo',
    'PayPal thử nghiệm',
    'Chuyển khoản mẫu',
    'Trả tại nơi đến',
  ];

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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Phương thức thanh toán demo',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final method in methods) Chip(label: Text(method)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _QrPreviewCard extends StatelessWidget {
  const _QrPreviewCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color(0xFFEAF6FF),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: const BorderSide(color: Color(0xFFD9ECFB)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              height: 88,
              width: 88,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFFD9ECFB)),
              ),
              child: const Icon(Icons.qr_code_2_outlined, color: chillBlue, size: 58),
            ),
            const SizedBox(width: 14),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Xem trước vé QR demo', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
                  SizedBox(height: 6),
                  Text(
                    'Mã mẫu CT-QR-MOBILE, chỉ dùng để kiểm thử checkout và gói offline.',
                    style: TextStyle(color: Color(0xFF476273), fontWeight: FontWeight.w700, height: 1.35),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  const _BookingCard({required this.booking});

  final BookingSummary booking;

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
        leading: Container(
          height: 42,
          width: 42,
          decoration: BoxDecoration(
            color: const Color(0xFFEAF6FF),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.qr_code_2_outlined, color: chillBlue),
        ),
        title: Text(
          booking.label,
          style: const TextStyle(fontWeight: FontWeight.w900),
        ),
        subtitle: Text('${booking.status} · ${booking.amountLabel}'),
        trailing: booking.sandboxOnly
            ? const Icon(Icons.verified_user_outlined, color: chillTeal)
            : null,
      ),
    );
  }
}
