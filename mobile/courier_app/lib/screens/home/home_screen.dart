import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/order_offer.dart';
import '../../providers/auth_provider.dart';
import '../../providers/courier_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final courierProvider = context.read<CourierProvider>();
      courierProvider.initialize(auth.socketService);
    });
  }

  void _checkForOffer(BuildContext context, CourierProvider courierProvider) {
    final offer = courierProvider.currentOffer;
    if (offer != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushNamed(context, '/offer', arguments: offer);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final courier = context.watch<AuthProvider>().courier;
    final courierProvider = context.watch<CourierProvider>();

    // Show offer screen if new offer arrives
    _checkForOffer(context, courierProvider);

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceColor,
        title: Row(
          children: [
            const Icon(Icons.delivery_dining,
                color: AppTheme.primaryColor, size: 26),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Siparim Kurye',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  courier?.name ?? 'Kurye',
                  style: const TextStyle(
                    color: AppTheme.textGrey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined,
                color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Online/Offline toggle
            _buildOnlineToggle(context, courierProvider),
            const SizedBox(height: 16),
            // Earnings card
            _buildEarningsCard(courierProvider),
            const SizedBox(height: 16),
            // Active order card
            if (courierProvider.activeOrder != null) ...[
              _buildActiveOrderCard(context, courierProvider),
              const SizedBox(height: 16),
            ],
            // Stats
            _buildStatsRow(courierProvider),
            const SizedBox(height: 16),
            // Tips
            _buildTipsCard(courierProvider),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedNavIndex,
        onDestinationSelected: (i) {
          setState(() => _selectedNavIndex = i);
          if (i == 1) {
            Navigator.pushNamed(context, '/earnings');
          }
        },
        backgroundColor: AppTheme.surfaceColor,
        indicatorColor: AppTheme.primaryColor.withOpacity(0.2),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined, color: AppTheme.textGrey),
            selectedIcon: Icon(Icons.home, color: AppTheme.primaryColor),
            label: 'Ana Sayfa',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined,
                color: AppTheme.textGrey),
            selectedIcon: Icon(Icons.account_balance_wallet,
                color: AppTheme.primaryColor),
            label: 'Kazanç',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline, color: AppTheme.textGrey),
            selectedIcon: Icon(Icons.person, color: AppTheme.primaryColor),
            label: 'Profil',
          ),
        ],
      ),
    );
  }

  Widget _buildOnlineToggle(
      BuildContext context, CourierProvider courierProvider) {
    return GestureDetector(
      onTap: () {
        final auth = context.read<AuthProvider>();
        courierProvider.toggleOnline(
            !courierProvider.isOnline, auth.socketService);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: courierProvider.isOnline
                ? [
                    AppTheme.onlineColor,
                    AppTheme.onlineColor.withOpacity(0.7),
                  ]
                : [
                    AppTheme.offlineColor,
                    AppTheme.offlineColor.withOpacity(0.7),
                  ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: (courierProvider.isOnline
                      ? AppTheme.onlineColor
                      : AppTheme.offlineColor)
                  .withOpacity(0.4),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  courierProvider.isOnline
                      ? '🟢 ÇEVRİMİÇİ'
                      : '🔴 ÇEVRİMDIŞI',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  courierProvider.isOnline
                      ? 'Sipariş almaya hazırsın'
                      : 'Sipariş almak için aç',
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
            Switch(
              value: courierProvider.isOnline,
              onChanged: (val) {
                final auth = context.read<AuthProvider>();
                courierProvider.toggleOnline(val, auth.socketService);
              },
              activeColor: Colors.white,
              activeTrackColor: Colors.white30,
              inactiveThumbColor: Colors.white,
              inactiveTrackColor: Colors.white24,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEarningsCard(CourierProvider courierProvider) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Bugünkü Kazanç',
                  style: TextStyle(
                    color: AppTheme.textGrey,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${courierProvider.dailyEarnings.toStringAsFixed(0)} TL',
                  style: const TextStyle(
                    color: AppTheme.goldColor,
                    fontSize: 36,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: AppTheme.goldColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.account_balance_wallet,
              color: AppTheme.goldColor,
              size: 30,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveOrderCard(
      BuildContext context, CourierProvider courierProvider) {
    final order = courierProvider.activeOrder!;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.primaryColor.withOpacity(0.5),
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.local_shipping,
                  color: AppTheme.primaryColor, size: 20),
              const SizedBox(width: 8),
              const Text(
                'Aktif Sipariş',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  order['status']?.toString() ?? 'active',
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _orderInfoRow(Icons.restaurant, order['restaurantName'] ?? 'Restoran'),
          const SizedBox(height: 6),
          _orderInfoRow(Icons.person, order['customerName'] ?? 'Müşteri'),
          const SizedBox(height: 6),
          _orderInfoRow(Icons.location_on, order['deliveryAddress'] ?? 'Adres'),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => Navigator.pushNamed(
                context,
                '/navigation',
                arguments: order['_id'] ?? order['id'] ?? '',
              ),
              icon: const Icon(Icons.navigation, size: 18),
              label: const Text('Navigasyonu Aç'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _orderInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppTheme.textGrey),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(color: Colors.white70, fontSize: 13),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _buildStatsRow(CourierProvider courierProvider) {
    return Row(
      children: [
        Expanded(
          child: _statCard(
            icon: Icons.local_shipping_outlined,
            value: '${courierProvider.dailyDeliveries}',
            label: 'Bugün\nTeslimat',
            color: AppTheme.onlineColor,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _statCard(
            icon: Icons.star_outline,
            value: '4.9',
            label: 'Kurye\nPuanı',
            color: Colors.amber,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _statCard(
            icon: Icons.speed,
            value: '23 dk',
            label: 'Ort.\nSüre',
            color: AppTheme.primaryColor,
          ),
        ),
      ],
    );
  }

  Widget _statCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.textGrey,
              fontSize: 11,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTipsCard(CourierProvider courierProvider) {
    if (courierProvider.isOnline) return const SizedBox();
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.amber.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Row(
            children: [
              Icon(Icons.lightbulb_outline, color: Colors.amber, size: 20),
              SizedBox(width: 8),
              Text(
                'İpuçları',
                style: TextStyle(
                  color: Colors.amber,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            '• Akşam 18:00-21:00 arası en yoğun saatler\n'
            '• Yüksek puanlı olmak daha fazla sipariş getirir\n'
            '• Hızlı teslimat = mutlu müşteri = yüksek puan',
            style: TextStyle(color: AppTheme.textGrey, fontSize: 13, height: 1.6),
          ),
        ],
      ),
    );
  }
}
