class OrderOffer {
  final String orderId;
  final String restaurantName;
  final String restaurantAddress;
  final String customerAddress;
  final double distance; // km
  final double earnings; // TL
  final int itemCount;
  final List<OfferItem> items;
  final DateTime receivedAt;

  const OrderOffer({
    required this.orderId,
    required this.restaurantName,
    required this.restaurantAddress,
    required this.customerAddress,
    required this.distance,
    required this.earnings,
    required this.itemCount,
    this.items = const [],
    required this.receivedAt,
  });

  factory OrderOffer.fromJson(Map<String, dynamic> json) {
    return OrderOffer(
      orderId: json['orderId'] ?? json['_id'] ?? '',
      restaurantName: json['restaurantName'] ?? '',
      restaurantAddress: json['restaurantAddress'] ?? '',
      customerAddress: json['customerAddress'] ?? json['deliveryAddress'] ?? '',
      distance: (json['distance'] as num?)?.toDouble() ?? 0.0,
      earnings: (json['earnings'] as num?)?.toDouble() ?? 0.0,
      itemCount: (json['itemCount'] as num?)?.toInt() ?? 0,
      items: (json['items'] as List<dynamic>? ?? [])
          .map((i) => OfferItem.fromJson(i as Map<String, dynamic>))
          .toList(),
      receivedAt: json['receivedAt'] != null
          ? DateTime.parse(json['receivedAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        'orderId': orderId,
        'restaurantName': restaurantName,
        'restaurantAddress': restaurantAddress,
        'customerAddress': customerAddress,
        'distance': distance,
        'earnings': earnings,
        'itemCount': itemCount,
        'items': items.map((i) => i.toJson()).toList(),
        'receivedAt': receivedAt.toIso8601String(),
      };
}

class OfferItem {
  final String name;
  final int quantity;

  const OfferItem({required this.name, required this.quantity});

  factory OfferItem.fromJson(Map<String, dynamic> json) {
    return OfferItem(
      name: json['name'] ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toJson() => {'name': name, 'quantity': quantity};
}
