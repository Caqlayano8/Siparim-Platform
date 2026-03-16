import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/menu_item.dart';

class CartProvider extends ChangeNotifier {
  final List<CartItem> _items = [];
  String? _restaurantId;
  String? _restaurantName;
  String? _promoCode;
  double _discount = 0.0;
  double _deliveryFee = 5.99;

  List<CartItem> get items => List.unmodifiable(_items);
  String? get restaurantId => _restaurantId;
  String? get restaurantName => _restaurantName;
  String? get promoCode => _promoCode;
  double get discount => _discount;
  double get deliveryFee => _deliveryFee;
  bool get isEmpty => _items.isEmpty;
  int get itemCount => _items.fold(0, (sum, i) => sum + i.quantity);

  double get subtotal => _items.fold(0.0, (sum, i) => sum + i.subtotal);
  double get total => subtotal + _deliveryFee - _discount;

  void addItem(MenuItem menuItem, String restaurantId, String restaurantName) {
    // Clear cart if switching restaurants
    if (_restaurantId != null && _restaurantId != restaurantId) {
      _items.clear();
      _discount = 0.0;
      _promoCode = null;
    }
    _restaurantId = restaurantId;
    _restaurantName = restaurantName;

    final existingIndex = _items.indexWhere((i) => i.menuItem.id == menuItem.id);
    if (existingIndex >= 0) {
      _items[existingIndex].quantity++;
    } else {
      _items.add(CartItem(menuItem: menuItem));
    }
    notifyListeners();
  }

  void removeItem(String menuItemId) {
    final idx = _items.indexWhere((i) => i.menuItem.id == menuItemId);
    if (idx >= 0) {
      if (_items[idx].quantity > 1) {
        _items[idx].quantity--;
      } else {
        _items.removeAt(idx);
      }
      if (_items.isEmpty) {
        _restaurantId = null;
        _restaurantName = null;
      }
      notifyListeners();
    }
  }

  void removeItemCompletely(String menuItemId) {
    _items.removeWhere((i) => i.menuItem.id == menuItemId);
    if (_items.isEmpty) {
      _restaurantId = null;
      _restaurantName = null;
    }
    notifyListeners();
  }

  int getItemQuantity(String menuItemId) {
    final item = _items.where((i) => i.menuItem.id == menuItemId).firstOrNull;
    return item?.quantity ?? 0;
  }

  void applyPromoCode(String code) {
    _promoCode = code.toUpperCase();
    // Simple demo discount logic
    switch (_promoCode) {
      case 'SIPARIM10':
        _discount = subtotal * 0.10;
        break;
      case 'ILKSIPARIM':
        _discount = subtotal * 0.20;
        break;
      case 'YEMEK5':
        _discount = 5.0;
        break;
      default:
        _discount = 0.0;
        _promoCode = null;
    }
    notifyListeners();
  }

  void removePromoCode() {
    _promoCode = null;
    _discount = 0.0;
    notifyListeners();
  }

  void clear() {
    _items.clear();
    _restaurantId = null;
    _restaurantName = null;
    _promoCode = null;
    _discount = 0.0;
    notifyListeners();
  }

  List<Map<String, dynamic>> toOrderItems() {
    return _items.map((i) => i.toOrderItem()).toList();
  }
}
