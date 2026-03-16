import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/restaurant.dart';
import '../models/menu_item.dart';
import 'auth_service.dart';

class RestaurantService {
  final AuthService _authService = AuthService();

  Future<List<Restaurant>> getRestaurants({String? category, String? search}) async {
    final headers = await _authService.getAuthHeaders();
    final queryParams = <String, String>{};
    if (category != null && category.isNotEmpty) queryParams['category'] = category;
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    final uri = Uri.parse('$baseUrl/restaurants').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: headers);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final list = data is List ? data : (data['restaurants'] ?? data['data'] ?? []);
      return (list as List)
          .map((r) => Restaurant.fromJson(r as Map<String, dynamic>))
          .toList();
    }
    throw Exception('Restoranlar yüklenemedi');
  }

  Future<Restaurant> getRestaurantById(String id) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/restaurants/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return Restaurant.fromJson(data['restaurant'] ?? data);
    }
    throw Exception('Restoran bulunamadı');
  }

  Future<Map<String, List<MenuItem>>> getMenuItems(String restaurantId) async {
    final headers = await _authService.getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/restaurants/$restaurantId/menu'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final list = data is List ? data : (data['items'] ?? data['menu'] ?? []);
      final items = (list as List)
          .map((i) => MenuItem.fromJson(i as Map<String, dynamic>))
          .toList();

      // Group by category
      final grouped = <String, List<MenuItem>>{};
      for (final item in items) {
        final cat = item.category.isEmpty ? 'Diğer' : item.category;
        grouped.putIfAbsent(cat, () => []).add(item);
      }
      return grouped;
    }
    throw Exception('Menü yüklenemedi');
  }
}
