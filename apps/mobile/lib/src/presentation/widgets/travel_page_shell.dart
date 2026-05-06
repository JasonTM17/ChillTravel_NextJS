import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TravelPageShell extends StatelessWidget {
  const TravelPageShell({
    required this.title,
    required this.subtitle,
    required this.children,
    this.nextRoute,
    super.key,
  });

  final String title;
  final String subtitle;
  final List<Widget> children;
  final String? nextRoute;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _HeroPanel(title: title, subtitle: subtitle),
          const SizedBox(height: 20),
          ...children,
          const SizedBox(height: 20),
          const _HardeningTile(
            title: 'Offline cache ready',
            subtitle:
                'Itinerary, wishlist, and booking data use a local fallback cache.',
          ),
          const _HardeningTile(
            title: 'Local AI runtime',
            subtitle:
                'Chat uses API/AI-service adapters without an OpenAI runtime key.',
          ),
          const _HardeningTile(
            title: 'Payment safety',
            subtitle:
                'Mock, sandbox, and local booking holds only. No real card processing.',
          ),
          if (nextRoute != null) ...[
            const SizedBox(height: 20),
            FilledButton(
              onPressed: () => context.go(nextRoute!),
              child: const Text('Continue'),
            ),
          ],
        ],
      ),
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [Color(0xFF071827), Color(0xFF0F8B7B)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            subtitle,
            style: const TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ],
      ),
    );
  }
}

class _HardeningTile extends StatelessWidget {
  const _HardeningTile({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(title: Text(title), subtitle: Text(subtitle)),
    );
  }
}
