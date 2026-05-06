import 'package:flutter_test/flutter_test.dart';
import 'package:vietwander_ai/src/app.dart';

void main() {
  testWidgets('app renders onboarding', (tester) async {
    await tester.pumpWidget(const VietWanderApp());
    expect(find.text('VIETWANDER AI'), findsWidgets);
  });
}
