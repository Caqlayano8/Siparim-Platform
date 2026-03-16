import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/order.dart';
import 'auth_service.dart';

class OrderService {
  final AuthService _authService = AuthService();

  Future<Order> createOrder({
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
    final headers = await _authService.getAuthHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: headers,
      body: jsonEncode({
        'restaurantId': restaurantId,
        'restaurantName': restaurantName,
        'items': items,
        'subtotal': subtotal,
        'deliveryFee': deliveryFee,
        'total': total,
        'deliveryAddress': deliveryAddress,
        if (promoCode != null) 'promoCode': promoCode,
        'discount': discount,
      }),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return Order.fromJson(data['order'] ?? data);
    }
    throw Exception('Sipariş oluşturulamadı');
  }

  Future<List<Order>> getOrders() async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/orders/my'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final list = data is List ? data : (data['orders'] ?? data['data'] ?? []);
      return (list as List)
          .map((o) => Order.fromJson(o as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Siparişler yüklenemedi');
  }

  Future<Order> getOrderById(String id) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/orders/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return Order.fromJson(data['order'] ?? data);
    }
    throw Exception('Sipariş bulunamadı');
  }

  Future<bool> cancelOrder(String id) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/orders/$id/cancel'),
      headers: headers,
    );
    return response.statusCode == 200;
  }
}
