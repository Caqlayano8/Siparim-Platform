import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/theme.dart';
import '../../models/order.dart';
import '../../providers/order_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().loadOrders();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final orderProvider = context.watch<OrderProvider>();

    final activeOrders = orderProvider.orders
        .where((o) => o.status != 'delivered' && o.status != 'cancelled')
        .toList();
    final pastOrders = orderProvider.orders
        .where((o) => o.status == 'delivered' || o.status == 'cancelled')
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Siparişlerim'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: AppTheme.textGrey,
          indicatorColor: AppTheme.primaryColor,
          tabs: [
            Tab(text: 'Aktif (${activeOrders.length})'),
            Tab(text: 'Geçmiş (${pastOrders.length})'),
          ],
        ),
      ),
      body: orderProvider.isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppTheme.primaryColor))
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOrderList(context, activeOrders, isActive: true),
                _buildOrderList(context, pastOrders, isActive: false),
              ],
            ),
    );
  }

  Widget _buildOrderList(BuildContext context, List<Order> orders,
      {required bool isActive}) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? Icons.receipt_long : Icons.history,
              size: 80,
              color: AppTheme.textGrey,
            ),
            const SizedBox(height: 16),
            Text(
              isActive ? 'Aktif sipariş yok' : 'Geçmiş sipariş yok',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textGrey,
              ),
            ),
            if (isActive) ...[
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () =>
                    Navigator.pushReplacementNamed(context, '/home'),
                child: const Text('Sipariş Ver'),
              ),
            ],
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => context.read<OrderProvider>().loadOrders(),
      color: AppTheme.primaryColor,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: orders.length,
        itemBuilder: (context, i) => _buildOrderCard(context, orders[i]),
      ),
    );
  }

  Widget _buildOrderCard(BuildContext context, Order order) {
    final statusColor = _getStatusColor(order.status);
    final dateFormat = DateFormat('dd MMM yyyy, HH:mm', 'tr_TR');

    return GestureDetector(
      onTap: () => Navigator.pushNamed(
        context,
        '/order-tracking',
        arguments: order.id,
      ),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: const [
            BoxShadow(color: Colors.black08, blurRadius: 6, offset: Offset(0, 2)),
          ],
        ),
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.08),
                borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(14)),
              ),
              child: Row(
                children: [
                  Icon(Icons.restaurant, color: statusColor, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      order.restaurantName,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: AppTheme.textDark,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      Order.statusLabel(order.status),
                      style: TextStyle(
                        color: statusColor,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Body
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Items
                  Text(
                    order.items.map((i) => '${i.quantity}x ${i.name}').join(', '),
                    style: const TextStyle(
                        color: AppTheme.textGrey, fontSize: 13),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Icon(Icons.access_time,
                          size: 14, color: AppTheme.textGrey),
                      const SizedBox(width: 4),
                      Text(
                        dateFormat.format(order.createdAt),
                        style: const TextStyle(
                            color: AppTheme.textGrey, fontSize: 12),
                      ),
                      const Spacer(),
                      Text(
                        '${order.total.toStringAsFixed(2)} TL',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppTheme.textDark,
                        ),
                      ),
                    ],
                  ),
                  if (order.status != 'delivered' &&
                      order.status != 'cancelled') ...[
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: () => Navigator.pushNamed(
                          context,
                          '/order-tracking',
                          arguments: order.id,
                        ),
                        icon: const Icon(Icons.track_changes, size: 16),
                        label: const Text('Siparişi Takip Et'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.primaryColor,
                          side: const BorderSide(color: AppTheme.primaryColor),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'restaurant_accepted':
      case 'preparing':
        return Colors.blue;
      case 'ready':
      case 'courier_assigned':
        return Colors.purple;
      case 'picked_up':
        return AppTheme.orangeColor;
      case 'delivered':
        return AppTheme.successColor;
      case 'cancelled':
        return AppTheme.primaryColor;
      default:
        return AppTheme.textGrey;
    }
  }
}
