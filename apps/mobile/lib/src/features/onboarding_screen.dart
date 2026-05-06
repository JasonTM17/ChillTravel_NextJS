import 'package:flutter/material.dart';

import '../presentation/widgets/travel_page_shell.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const TravelPageShell(
      title: 'VIETWANDER AI',
      subtitle: 'Choose language and travel style',
      nextRoute: '/home',
      children: [
        Card(
          child: ListTile(
            title: Text('Vietnam-first planning'),
            subtitle: Text(
              'Local tips, pacing, and offline-first trip essentials.',
            ),
          ),
        ),
      ],
    );
  }
}
