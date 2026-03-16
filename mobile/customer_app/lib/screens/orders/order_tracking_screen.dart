import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/theme.dart';
import '../../models/order.dart';
import '../../providers/auth_provider.dart';
import '../../providers/order_provider.dart';
import '../../services/order_service.dart';

class OrderTrackingScreen extends StatefulWidget {
  final String orderId;

  const OrderTrackingScreen({super.key, required this.orderId});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  final OrderService _orderService = OrderService();
  Order? _order;
  bool _isLoading = true;

  static const _steps = [
    {'status': 'pending', 'label': 'Sipariş Alındı', 'icon': Icons.receipt},
    {
      'status': 'restaurant_accepted',
      'label': 'Restoran Onayladı',
      'icon': Icons.check_circle
    },
    {
      'status': 'preparing',
      'label': 'Hazırlanıyor',
      'icon': Icons.restaurant_menu
    },
    {'status': 'ready', 'label': 'Hazır', 'icon': Icons.done_all},
    {
      'status': 'courier_assigned',
      'label': 'Kurye Atandı',
      'icon': Icons.delivery_dining
    },
    {
      'status': 'picked_up',
      'label': 'Kuryede / Yolda',
      'icon': Icons.two_wheeler
    },
    {
      'status': 'delivered',
      'label': 'Teslim Edildi',
      'icon': Icons.home_outlined
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadOrder();
  }

  Future<void> _loadOrder() async {
    try {
      final order = await _orderService.getOrderById(widget.orderId);
      setState(() {
        _order = order;
        _isLoading = false;
      });
      // Start listening for updates
      final auth = context.read<AuthProvider>();
      final orderProvider = context.read<OrderProvider>();
      orderProvider.listenToOrderUpdates(
        auth.socketService,
        widget.orderId,
      );
    } catch (e) {
      // Demo order
      setState(() {
        _order = Order(
          id: widget.orderId,
          userId: '',
          restaurantId: '1',
          restaurantName: 'Burger Palace',
          items: [
            const OrderItem(
              menuItemId: '1',
              name: 'Classic Burger',
              quantity: 2,
              price: 85.0,
              subtotal: 170.0,
            ),
          ],
          subtotal: 170.0,
          deliveryFee: 0,
          total: 170.0,
          status: 'preparing',
          deliveryAddress: 'İstanbul, Kadıköy, Moda Cad. No:1',
          createdAt: DateTime.now().subtract(const Duration(minutes: 12)),
        );
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Listen for order updates
    final updatedOrder = context
        .watch<OrderProvider>()
        .orders
        .where((o) => o.id == widget.orderId)
        .firstOrNull;

    final order = updatedOrder ?? _order;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sipariş Takibi'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadOrder,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppTheme.primaryColor))
          : order == null
              ? const Center(child: Text('Sipariş bulunamadı'))
              : _buildTrackingView(order),
    );
  }

  Widget _buildTrackingView(Order order) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Status banner
          _buildStatusBanner(order),
          const SizedBox(height: 20),
          // Order info card
          _buildOrderInfo(order),
          const SizedBox(height: 20),
          // Timeline
          const Text(
            'Sipariş Durumu',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 12),
          _buildTimeline(order),
          const SizedBox(height: 20),
          // Delivery address
          _buildDeliveryInfo(order),
          const SizedBox(height: 20),
          // Items
          _buildItemsList(order),
        ],
      ),
    );
  }

  Widget _buildStatusBanner(Order order) {
    final isDelivered = order.status == 'delivered';
    final isCancelled = order.status == 'cancelled';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDelivered
              ? [AppTheme.successColor, AppTheme.successColor.withOpacity(0.7)]
              : isCancelled
                  ? [AppTheme.primaryColor, AppTheme.primaryColor.withOpacity(0.7)]
                  : [AppTheme.primaryColor, AppTheme.orangeColor],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Icon(
            isDelivered
                ? Icons.check_circle
                : isCancelled
                    ? Icons.cancel
                    : Icons.delivery_dining,
            color: Colors.white,
            size: 48,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  Order.statusLabel(order.status),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (!isDelivered && !isCancelled)
                  const Text(
                    'Siparişiniz işleme alındı',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                if (order.estimatedDelivery != null)
                  Text(
                    'Tahmini teslimat: ${order.estimatedDelivery}',
                    style: const TextStyle(
                        color: Colors.white70, fontSize: 13),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeline(Order order) {
    final currentStep = order.currentStep;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(color: Colors.black08, blurRadius: 6),
        ],
      ),
      child: Column(
        children: List.generate(_steps.length, (i) {
          final step = _steps[i];
          final isCompleted = i <= currentStep;
          final isCurrent = i == currentStep;
          final isLast = i == _steps.length - 1;

          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon + line
              Column(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? (isCurrent
                              ? AppTheme.primaryColor
                              : AppTheme.successColor)
                          : const Color(0xFFE0E0E0),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      step['icon'] as IconData,
                      color: isCompleted ? Colors.white : AppTheme.textGrey,
                      size: 18,
                    ),
                  ),
                  if (!isLast)
                    Container(
                      width: 2,
                      height: 36,
                      color: isCompleted && i < currentStep
                          ? AppTheme.successColor
                          : const Color(0xFFE0E0E0),
                    ),
                ],
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                      top: 6, bottom: isLast ? 0 : 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        step['label'] as String,
                        style: TextStyle(
                          fontWeight: isCurrent || isCompleted
                              ? FontWeight.bold
                              : FontWeight.normal,
                          color: isCompleted
                              ? AppTheme.textDark
                              : AppTheme.textGrey,
                          fontSize: 14,
                        ),
                      ),
                      if (isCurrent && !_isDelivered(order.status))
                        Padding(
                          padding: const EdgeInsets.only(top: 3),
                          child: Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppTheme.primaryColor,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Text(
                                'Şu anki durum',
                                style: TextStyle(
                                  color: AppTheme.primaryColor,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  bool _isDelivered(String status) =>
      status == 'delivered' || status == 'cancelled';

  Widget _buildOrderInfo(Order order) {
    final dateFormat = DateFormat('dd MMM yyyy, HH:mm', 'tr_TR');
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _infoRow('Restoran', order.restaurantName),
          _infoRow('Sipariş No', '#${order.id.substring(0, 8).toUpperCase()}'),
          _infoRow('Tarih', dateFormat.format(order.createdAt)),
          _infoRow('Toplam', '${order.total.toStringAsFixed(2)} TL'),
          if (order.courierName != null)
            _infoRow('Kurye', order.courierName!),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(
                  color: AppTheme.textGrey, fontSize: 13),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: AppTheme.textDark,
              fontWeight: FontWeight.w500,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeliveryInfo(Order order) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 6)],
      ),
      child: Row(
        children: [
          const Icon(Icons.location_on, color: AppTheme.primaryColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Teslimat Adresi',
                  style: TextStyle(
                    color: AppTheme.textGrey,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  order.deliveryAddress,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textDark,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemsList(Order order) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sipariş İçeriği',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 10),
          ...order.items.map(
            (item) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 5),
              child: Row(
                children: [
                  Text(
                    '${item.quantity}x',
                    style: const TextStyle(
                      color: AppTheme.primaryColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(item.name,
                        style:
                            const TextStyle(color: AppTheme.textDark)),
                  ),
                  Text(
                    '${item.subtotal.toStringAsFixed(2)} TL',
                    style: const TextStyle(
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textDark,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Toplam',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              Text(
                '${order.total.toStringAsFixed(2)} TL',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.primaryColor,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
