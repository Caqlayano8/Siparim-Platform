import 'package:flutter/material.dart';
import '../models/order_offer.dart';
import '../services/courier_service.dart';
import '../services/socket_service.dart';

class CourierProvider extends ChangeNotifier {
  final CourierService _courierService = CourierService();

  bool _isOnline = false;
  OrderOffer? _currentOffer;
  Map<String, dynamic>? _activeOrder;
  double _dailyEarnings = 0.0;
  double _weeklyEarnings = 0.0;
  int _dailyDeliveries = 0;
  bool _isLoading = false;

  bool get isOnline => _isOnline;
  OrderOffer? get currentOffer => _currentOffer;
  Map<String, dynamic>? get activeOrder => _activeOrder;
  double get dailyEarnings => _dailyEarnings;
  double get weeklyEarnings => _weeklyEarnings;
  int get dailyDeliveries => _dailyDeliveries;
  bool get isLoading => _isLoading;

  Future<void> initialize(SocketService socketService) async {
    socketService.listenForOrderOffers((offer) {
      _currentOffer = offer;
      notifyListeners();
    });
    await loadEarnings();
    await loadActiveOrder();
  }

  Future<void> toggleOnline(bool value, SocketService socketService) async {
    _isOnline = value;
    notifyListeners();

    await _courierService.toggleOnline(value);
    socketService.emitOnlineStatus(value);
  }

  Future<void> loadEarnings() async {
    try {
      final data = await _courierService.getEarnings(period: 'daily');
      _dailyEarnings = (data['totalEarnings'] as num?)?.toDouble() ?? 0.0;
      _dailyDeliveries = (data['totalDeliveries'] as num?)?.toInt() ?? 0;
      notifyListeners();
    } catch (_) {}
  }

  Future<void> loadWeeklyEarnings() async {
    try {
      final data = await _courierService.getEarnings(period: 'weekly');
      _weeklyEarnings = (data['totalEarnings'] as num?)?.toDouble() ?? 0.0;
      notifyListeners();
    } catch (_) {}
  }

  Future<void> loadActiveOrder() async {
    try {
      _activeOrder = await _courierService.getActiveOrder();
      notifyListeners();
    } catch (_) {}
  }

  Future<bool> acceptOffer(String orderId) async {
    _isLoading = true;
    notifyListeners();

    final success = await _courierService.acceptOrder(orderId);
    if (success) {
      await loadActiveOrder();
    }
    _currentOffer = null;
    _isLoading = false;
    notifyListeners();
    return success;
  }

  Future<void> rejectOffer(String orderId) async {
    await _courierService.rejectOrder(orderId);
    _currentOffer = null;
    notifyListeners();
  }

  void clearOffer() {
    _currentOffer = null;
    notifyListeners();
  }

  Future<bool> updateOrderStatus(String orderId, String status) async {
    final success = await _courierService.updateOrderStatus(orderId, status);
    if (success) {
      if (status == 'delivered') {
        _activeOrder = null;
        _dailyDeliveries++;
      } else if (_activeOrder != null) {
        _activeOrder = Map<String, dynamic>.from(_activeOrder!)
          ..['status'] = status;
      }
      notifyListeners();
    }
    return success;
  }

  void updateLocation(double lat, double lng, SocketService socketService) {
    socketService.emitLocation(lat, lng);
  }
}
