import 'package:flutter/material.dart';
import '../models/courier.dart';
import '../services/auth_service.dart';
import '../services/socket_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final SocketService _socketService = SocketService();

  Courier? _courier;
  bool _isLoading = false;
  String? _error;
  bool _initialized = false;

  Courier? get courier => _courier;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _courier != null;
  bool get initialized => _initialized;
  SocketService get socketService => _socketService;

  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();
    try {
      final courier = await _authService.getSavedCourier();
      if (courier != null && courier.token.isNotEmpty) {
        _courier = courier;
        _socketService.connect(courier.token);
      }
    } catch (_) {}
    _isLoading = false;
    _initialized = true;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.login(email, password);

    if (result['success'] == true) {
      _courier = result['courier'] as Courier;
      _socketService.connect(_courier!.token);
      _isLoading = false;
      notifyListeners();
      return true;
    } else {
      _error = result['message'] as String?;
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _socketService.disconnect();
    await _authService.logout();
    _courier = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
