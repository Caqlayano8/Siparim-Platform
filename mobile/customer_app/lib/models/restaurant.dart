class Restaurant {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final String category;
  final double rating;
  final int ratingCount;
  final int deliveryTime; // minutes
  final double deliveryFee;
  final double minOrder;
  final String address;
  final bool isOpen;
  final List<String> tags;

  const Restaurant({
    required this.id,
    required this.name,
    this.description = '',
    this.imageUrl = '',
    this.category = '',
    this.rating = 0.0,
    this.ratingCount = 0,
    this.deliveryTime = 30,
    this.deliveryFee = 0.0,
    this.minOrder = 0.0,
    this.address = '',
    this.isOpen = true,
    this.tags = const [],
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    return Restaurant(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? json['image'] ?? '',
      category: json['category'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      ratingCount: (json['ratingCount'] as num?)?.toInt() ?? 0,
      deliveryTime: (json['deliveryTime'] as num?)?.toInt() ?? 30,
      deliveryFee: (json['deliveryFee'] as num?)?.toDouble() ?? 0.0,
      minOrder: (json['minOrder'] as num?)?.toDouble() ?? 0.0,
      address: json['address'] ?? '',
      isOpen: json['isOpen'] ?? true,
      tags: List<String>.from(json['tags'] ?? []),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'imageUrl': imageUrl,
        'category': category,
        'rating': rating,
        'ratingCount': ratingCount,
        'deliveryTime': deliveryTime,
        'deliveryFee': deliveryFee,
        'minOrder': minOrder,
        'address': address,
        'isOpen': isOpen,
        'tags': tags,
      };
}
