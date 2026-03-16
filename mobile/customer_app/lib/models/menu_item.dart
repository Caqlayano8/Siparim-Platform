class MenuItem {
  final String id;
  final String restaurantId;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String category;
  final bool isAvailable;
  final List<MenuOption> options;

  const MenuItem({
    required this.id,
    required this.restaurantId,
    required this.name,
    this.description = '',
    required this.price,
    this.imageUrl = '',
    this.category = '',
    this.isAvailable = true,
    this.options = const [],
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: json['_id'] ?? json['id'] ?? '',
      restaurantId: json['restaurantId'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['imageUrl'] ?? json['image'] ?? '',
      category: json['category'] ?? '',
      isAvailable: json['isAvailable'] ?? true,
      options: (json['options'] as List<dynamic>? ?? [])
          .map((o) => MenuOption.fromJson(o as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'restaurantId': restaurantId,
        'name': name,
        'description': description,
        'price': price,
        'imageUrl': imageUrl,
        'category': category,
        'isAvailable': isAvailable,
        'options': options.map((o) => o.toJson()).toList(),
      };
}

class MenuOption {
  final String name;
  final double extraPrice;

  const MenuOption({required this.name, this.extraPrice = 0.0});

  factory MenuOption.fromJson(Map<String, dynamic> json) {
    return MenuOption(
      name: json['name'] ?? '',
      extraPrice: (json['extraPrice'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'extraPrice': extraPrice,
      };
}
