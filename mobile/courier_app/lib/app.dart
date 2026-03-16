import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/offer/offer_screen.dart';
import 'screens/navigation/navigation_screen.dart';
import 'screens/earnings/earnings_screen.dart';
import 'models/order_offer.dart';

class SiparimCourierApp extends StatelessWidget {
  const SiparimCourierApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Siparim Kurye',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const SplashScreen(),
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/earnings': (context) => const EarningsScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/offer') {
          final offer = settings.arguments as OrderOffer;
          return MaterialPageRoute(
            fullscreenDialog: true,
            builder: (context) => OfferScreen(offer: offer),
          );
        }
        if (settings.name == '/navigation') {
          final orderId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => NavigationScreen(orderId: orderId),
          );
        }
        return null;
      },
    );
  }
}
