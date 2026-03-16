import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'auth_service.dart';

class CourierService {
  final AuthService _authService = AuthService();

  Future<bool> updateLocation(double lat, double lng) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/couriers/location'),
      headers: headers,
      body: jsonEncode({'lat': lat, 'lng': lng}),
    );
    return response.statusCode == 200;
  }

  Future<bool> toggleOnline(bool isOnline) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/couriers/status'),
      headers: headers,
      body: jsonEncode({'isOnline': isOnline}),
    );
    return response.statusCode == 200;
  }

  Future<Map<String, dynamic>> getEarnings({String period = 'daily'}) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/couriers/earnings?period=$period'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw Exception('Kazanç bilgisi yüklenemedi');
  }

  Future<bool> acceptOrder(String orderId) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/orders/$orderId/accept'),
      headers: headers,
    );
    return response.statusCode == 200;
  }

  Future<bool> rejectOrder(String orderId) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/orders/$orderId/reject'),
      headers: headers,
    );
    return response.statusCode == 200;
  }

  Future<bool> updateOrderStatus(String orderId, String status) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$orderId/status'),
      headers: headers,
      body: jsonEncode({'status': status}),
    );
    return response.statusCode == 200;
  }

  Future<Map<String, dynamic>?> getActiveOrder() async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/couriers/active-order'),
      headers: headers,
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    return null;
  }
}
