class Courier {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String token;
  final bool isOnline;
  final double? lat;
  final double? lng;
  final double totalEarnings;
  final int totalDeliveries;
  final double rating;

  const Courier({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.token,
    this.isOnline = false,
    this.lat,
    this.lng,
    this.totalEarnings = 0.0,
    this.totalDeliveries = 0,
    this.rating = 5.0,
  });

  factory Courier.fromJson(Map<String, dynamic> json) {
    return Courier(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      token: json['token'] ?? '',
      isOnline: json['isOnline'] ?? false,
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
      totalEarnings: (json['totalEarnings'] as num?)?.toDouble() ?? 0.0,
      totalDeliveries: (json['totalDeliveries'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'token': token,
        'isOnline': isOnline,
        'lat': lat,
        'lng': lng,
        'totalEarnings': totalEarnings,
        'totalDeliveries': totalDeliveries,
        'rating': rating,
      };

  Courier copyWith({
    bool? isOnline,
    double? lat,
    double? lng,
    double? totalEarnings,
    int? totalDeliveries,
  }) {
    return Courier(
      id: id,
      name: name,
      email: email,
      phone: phone,
      token: token,
      isOnline: isOnline ?? this.isOnline,
      lat: lat ?? this.lat,
      lng: lng ?? this.lng,
      totalEarnings: totalEarnings ?? this.totalEarnings,
      totalDeliveries: totalDeliveries ?? this.totalDeliveries,
      rating: rating,
    );
  }
}
