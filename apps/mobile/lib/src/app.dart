import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'features/ai_chat_screen.dart';
import 'features/booking_screen.dart';
import 'features/destination_detail_screen.dart';
import 'features/explore_screen.dart';
import 'features/home_screen.dart';
import 'features/itinerary_screen.dart';
import 'features/onboarding_screen.dart';
import 'features/profile_screen.dart';
import 'features/wishlist_screen.dart';

final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => const OnboardingScreen()),
    GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/explore', builder: (_, __) => const ExploreScreen()),
    GoRoute(
      path: '/destination',
      builder: (_, __) => const DestinationDetailScreen(),
    ),
    GoRoute(path: '/chat', builder: (_, __) => const AiChatScreen()),
    GoRoute(path: '/itinerary', builder: (_, __) => const ItineraryScreen()),
    GoRoute(path: '/booking', builder: (_, __) => const BookingScreen()),
    GoRoute(path: '/wishlist', builder: (_, __) => const WishlistScreen()),
    GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
  ],
);

class ChillTravelApp extends StatelessWidget {
  const ChillTravelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'CHILLTRAVEL',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0F8B7B)),
        useMaterial3: true,
      ),
      darkTheme: ThemeData.dark(useMaterial3: true),
      routerConfig: router,
    );
  }
}
