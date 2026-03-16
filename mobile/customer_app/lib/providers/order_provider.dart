import 'package:flutter/material.dart';
import '../models/order.dart';
import '../services/order_service.dart';
import '../services/socket_service.dart';

class OrderProvider extends ChangeNotifier {
  final OrderService _orderService = OrderService();

  List<Order> _orders = [];
  Order? _activeOrder;
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  Order? get activeOrder => _activeOrder;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await _orderService.getOrders();
      // Find active order (not delivered or cancelled)
      _activeOrder = _orders.where((o) =>
        o.status != 'delivered' && o.status != 'cancelled'
      ).firstOrNull;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Order?> createOrder({
    required String restaurantId,
    required String restaurantName,
    required List<Map<String, dynamic>> items,
    required double subtotal,
    required double deliveryFee,
    required double total,
    required String deliveryAddress,
    String? promoCode,
    double discount = 0.0,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final order = await _orderService.createOrder(
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        items: items,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        deliveryAddress: deliveryAddress,
        promoCode: promoCode,
        discount: discount,
      );
      _orders.insert(0, order);
      _activeOrder = order;
      _isLoading = false;
      notifyListeners();
      return order;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<Order?> getOrderById(String id) async {
    try {
      return await _orderService.getOrderById(id);
    } catch (_) {
      return null;
    }
  }

  void updateOrderStatus(String orderId, String newStatus) {
    final idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx >= 0) {
      _orders[idx] = Order(
        id: _orders[idx].id,
        userId: _orders[idx].userId,
        restaurantId: _orders[idx].restaurantId,
        restaurantName: _orders[idx].restaurantName,
        items: _orders[idx].items,
        subtotal: _orders[idx].subtotal,
        deliveryFee: _orders[idx].deliveryFee,
        total: _orders[idx].total,
        status: newStatus,
        deliveryAddress: _orders[idx].deliveryAddress,
        courierId: _orders[idx].courierId,
        courierName: _orders[idx].courierName,
        promoCode: _orders[idx].promoCode,
        discount: _orders[idx].discount,
        createdAt: _orders[idx].createdAt,
        updatedAt: DateTime.now(),
        estimatedDelivery: _orders[idx].estimatedDelivery,
      );
      if (_activeOrder?.id == orderId) {
        _activeOrder = _orders[idx];
      }
      notifyListeners();
    }
  }

  void listenToOrderUpdates(SocketService socketService, String orderId) {
    socketService.listenToOrderUpdates(orderId, (data) {
      final status = data['status'] as String?;
      if (status != null) {
        updateOrderStatus(orderId, status);
      }
    });
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
