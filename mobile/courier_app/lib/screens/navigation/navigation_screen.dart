import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';
import '../../providers/courier_provider.dart';
import '../../providers/auth_provider.dart';

class NavigationScreen extends StatefulWidget {
  final String orderId;

  const NavigationScreen({super.key, required this.orderId});

  @override
  State<NavigationScreen> createState() => _NavigationScreenState();
}

class _NavigationScreenState extends State<NavigationScreen> {
  String _currentStep = 'pickup'; // pickup or delivery

  // Demo order data
  final Map<String, dynamic> _demoOrder = {
    'restaurantName': 'Burger Palace',
    'restaurantAddress': 'Bağdat Cad. No:45, Kadıköy',
    'restaurantLat': 40.9833,
    'restaurantLng': 29.0333,
    'customerName': 'Ahmet Yılmaz',
    'customerAddress': 'Moda Cad. No:12, Kadıköy',
    'customerLat': 40.9920,
    'customerLng': 29.0250,
    'orderItems': '2x Classic Burger, 1x Cola',
    'total': '195.00',
    'status': 'courier_assigned',
  };

  Future<void> _openGoogleMaps(double lat, double lng, String label) async {
    final uri = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Google Maps açılamadı')),
        );
      }
    }
  }

  Future<void> _updateStatus(BuildContext context, String status) async {
    final courierProvider = context.read<CourierProvider>();
    final success =
        await courierProvider.updateOrderStatus(widget.orderId, status);

    if (!mounted) return;

    if (success) {
      if (status == 'delivered') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Teslimat tamamlandı!'),
            backgroundColor: AppTheme.onlineColor,
          ),
        );
        Navigator.pushReplacementNamed(context, '/home');
      } else {
        setState(() {
          if (status == 'picked_up') {
            _currentStep = 'delivery';
          }
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final order = context.watch<CourierProvider>().activeOrder ?? _demoOrder;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text(
          'Aktif Teslimat',
          style: TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Step indicator
          _buildStepIndicator(),
          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Current destination card
                  _buildDestinationCard(order),
                  const SizedBox(height: 16),
                  // Order details card
                  _buildOrderDetailsCard(order),
                  const SizedBox(height: 16),
                  // Action button
                  _buildActionButton(context),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Container(
      color: AppTheme.surfaceColor,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
      child: Row(
        children: [
          _stepDot(
            isActive: _currentStep == 'pickup',
            isCompleted: _currentStep == 'delivery',
            label: 'Alınıyor',
            icon: Icons.restaurant,
          ),
          Expanded(
            child: Container(
              height: 2,
              color: _currentStep == 'delivery'
                  ? AppTheme.onlineColor
                  : const Color(0xFF444444),
            ),
          ),
          _stepDot(
            isActive: _currentStep == 'delivery',
            isCompleted: false,
            label: 'Teslim',
            icon: Icons.home,
          ),
        ],
      ),
    );
  }

  Widget _stepDot({
    required bool isActive,
    required bool isCompleted,
    required String label,
    required IconData icon,
  }) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: isCompleted
                ? AppTheme.onlineColor
                : isActive
                    ? AppTheme.primaryColor
                    : const Color(0xFF444444),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: Colors.white, size: 22),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : AppTheme.textGrey,
            fontSize: 11,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Widget _buildDestinationCard(Map<String, dynamic> order) {
    final isPickup = _currentStep == 'pickup';
    final address = isPickup
        ? (order['restaurantAddress'] ?? 'Restoran adresi')
        : (order['customerAddress'] ?? 'Müşteri adresi');
    final name = isPickup
        ? (order['restaurantName'] ?? 'Restoran')
        : (order['customerName'] ?? 'Müşteri');
    final lat = isPickup
        ? (order['restaurantLat'] as num?)?.toDouble() ?? 41.0
        : (order['customerLat'] as num?)?.toDouble() ?? 41.0;
    final lng = isPickup
        ? (order['restaurantLng'] as num?)?.toDouble() ?? 29.0
        : (order['customerLng'] as num?)?.toDouble() ?? 29.0;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPickup
              ? AppTheme.primaryColor.withOpacity(0.5)
              : AppTheme.onlineColor.withOpacity(0.5),
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: (isPickup
                          ? AppTheme.primaryColor
                          : AppTheme.onlineColor)
                      .withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  isPickup ? Icons.restaurant : Icons.home,
                  color: isPickup
                      ? AppTheme.primaryColor
                      : AppTheme.onlineColor,
                  size: 22,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isPickup ? 'ALINIYOR' : 'TESLİM EDİLİYOR',
                      style: TextStyle(
                        color: isPickup
                            ? AppTheme.primaryColor
                            : AppTheme.onlineColor,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1,
                      ),
                    ),
                    Text(
                      name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on,
                    color: AppTheme.primaryColor, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    address,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _openGoogleMaps(lat, lng, name),
              icon: const Icon(Icons.navigation, size: 18),
              label: const Text('Google Maps\'ta Aç'),
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    isPickup ? AppTheme.primaryColor : AppTheme.onlineColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderDetailsCard(Map<String, dynamic> order) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sipariş Detayları',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          _detailRow(
              '📦', 'Ürünler', order['orderItems']?.toString() ?? ''),
          const SizedBox(height: 8),
          _detailRow('💵', 'Toplam',
              '${order['total']?.toString() ?? '0'} TL'),
          const SizedBox(height: 8),
          _detailRow('📍', 'Teslimat',
              order['customerAddress']?.toString() ?? ''),
        ],
      ),
    );
  }

  Widget _detailRow(String emoji, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(emoji, style: const TextStyle(fontSize: 16)),
        const SizedBox(width: 10),
        SizedBox(
          width: 70,
          child: Text(
            label,
            style:
                const TextStyle(color: AppTheme.textGrey, fontSize: 13),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(color: Colors.white, fontSize: 13),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(BuildContext context) {
    if (_currentStep == 'pickup') {
      return SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton.icon(
          onPressed: () => _updateStatus(context, 'picked_up'),
          icon: const Icon(Icons.check_circle, size: 22),
          label: const Text(
            'Siparişi Aldım',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
          ),
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.primaryColor,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14)),
          ),
        ),
      );
    } else {
      return Column(
        children: [
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () => _updateStatus(context, 'delivered'),
              icon: const Text('🎉', style: TextStyle(fontSize: 20)),
              label: const Text(
                'Teslim Ettim',
                style:
                    TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.onlineColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                elevation: 4,
                shadowColor: AppTheme.onlineColor.withOpacity(0.5),
              ),
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'Müşteriye teslim ettiğinizde onaylayın',
            style: TextStyle(color: AppTheme.textGrey, fontSize: 12),
          ),
        ],
      );
    }
  }
}
