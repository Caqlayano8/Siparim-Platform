class Order {
  final String id;
  final String userId;
  final String restaurantId;
  final String restaurantName;
  final List<OrderItem> items;
  final double subtotal;
  final double deliveryFee;
  final double total;
  final String status;
  final String deliveryAddress;
  final String? courierId;
  final String? courierName;
  final String? promoCode;
  final double discount;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String? estimatedDelivery;

  const Order({
    required this.id,
    required this.userId,
    required this.restaurantId,
    required this.restaurantName,
    required this.items,
    required this.subtotal,
    this.deliveryFee = 0.0,
    required this.total,
    required this.status,
    required this.deliveryAddress,
    this.courierId,
    this.courierName,
    this.promoCode,
    this.discount = 0.0,
    required this.createdAt,
    this.updatedAt,
    this.estimatedDelivery,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['userId'] ?? '',
      restaurantId: json['restaurantId'] ?? '',
      restaurantName: json['restaurantName'] ?? '',
      items: (json['items'] as List<dynamic>? ?? [])
          .map((i) => OrderItem.fromJson(i as Map<String, dynamic>))
          .toList(),
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      deliveryFee: (json['deliveryFee'] as num?)?.toDouble() ?? 0.0,
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'pending',
      deliveryAddress: json['deliveryAddress'] ?? '',
      courierId: json['courierId'],
      courierName: json['courierName'],
      promoCode: json['promoCode'],
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : null,
      estimatedDelivery: json['estimatedDelivery'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'restaurantId': restaurantId,
        'restaurantName': restaurantName,
        'items': items.map((i) => i.toJson()).toList(),
        'subtotal': subtotal,
        'deliveryFee': deliveryFee,
        'total': total,
        'status': status,
        'deliveryAddress': deliveryAddress,
        'courierId': courierId,
        'courierName': courierName,
        'promoCode': promoCode,
        'discount': discount,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt?.toIso8601String(),
        'estimatedDelivery': estimatedDelivery,
      };

  static const List<String> statusFlow = [
    'pending',
    'restaurant_accepted',
    'preparing',
    'ready',
    'courier_assigned',
    'picked_up',
    'delivered',
  ];

  static String statusLabel(String status) {
    const labels = {
      'pending': 'Sipariş Alındı',
      'restaurant_accepted': 'Restoran Onayladı',
      'preparing': 'Hazırlanıyor',
      'ready': 'Hazır',
      'courier_assigned': 'Kurye Atandı',
      'picked_up': 'Yolda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi',
    };
    return labels[status] ?? status;
  }

  int get currentStep {
    final idx = statusFlow.indexOf(status);
    return idx < 0 ? 0 : idx;
  }
}

class OrderItem {
  final String menuItemId;
  final String name;
  final int quantity;
  final double price;
  final double subtotal;

  const OrderItem({
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.price,
    required this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      menuItemId: json['menuItemId'] ?? '',
      name: json['name'] ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'menuItemId': menuItemId,
        'name': name,
        'quantity': quantity,
        'price': price,
        'subtotal': subtotal,
      };
}
