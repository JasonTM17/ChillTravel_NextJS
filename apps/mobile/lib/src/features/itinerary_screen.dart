import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ItineraryScreen extends StatelessWidget {
  const ItineraryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Itinerary')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: const LinearGradient(colors: [Color(0xFF071827), Color(0xFF0F8B7B)]),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Itinerary', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w800)),
                SizedBox(height: 12),
                Text('Day-by-day cards, checklist, budget, map preview, offline pack', style: TextStyle(color: Colors.white70, fontSize: 16)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Card(child: ListTile(title: Text('Offline cache ready'), subtitle: Text('Itinerary, wishlist, booking and emergency info can be cached locally.'))),
          const Card(child: ListTile(title: Text('Local AI runtime'), subtitle: Text('Chatbot uses API/AI-service adapters, not an OpenAI runtime key.'))),
          const Card(child: ListTile(title: Text('Payment safety'), subtitle: Text('Mock/sandbox/local only. No real card storage or charge.'))),
          const SizedBox(height: 20),
          FilledButton(onPressed: () => context.go('/booking'), child: const Text('Continue')),
        ],
      ),
    );
  }
}
