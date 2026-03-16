import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/cart/cart_screen.dart';
import 'screens/orders/orders_screen.dart';
import 'screens/orders/order_tracking_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/restaurant/restaurant_screen.dart';

class SiparimApp extends StatelessWidget {
  const SiparimApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Siparim',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const HomeScreen(),
        '/cart': (context) => const CartScreen(),
        '/orders': (context) => const OrdersScreen(),
        '/profile': (context) => const ProfileScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/restaurant') {
          final restaurantId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => RestaurantScreen(restaurantId: restaurantId),
          );
        }
        if (settings.name == '/order-tracking') {
          final orderId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => OrderTrackingScreen(orderId: orderId),
          );
        }
        return null;
      },
    );
  }
}
