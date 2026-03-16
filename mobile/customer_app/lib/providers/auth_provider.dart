import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/socket_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final SocketService _socketService = SocketService();

  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _initialized = false;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;
  bool get initialized => _initialized;
  SocketService get socketService => _socketService;

  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();
    try {
      final user = await _authService.getSavedUser();
      if (user != null && user.token.isNotEmpty) {
        _user = user;
        _socketService.connect(user.token);
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
      _user = result['user'] as User;
      _socketService.connect(_user!.token);
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

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String phone,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    final result = await _authService.register(
      name: name,
      email: email,
      password: password,
      phone: phone,
    );

    if (result['success'] == true) {
      _user = result['user'] as User;
      _socketService.connect(_user!.token);
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
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
