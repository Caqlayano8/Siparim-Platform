class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final List<Address> addresses;
  final String? avatarUrl;
  final String token;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.addresses = const [],
    this.avatarUrl,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      addresses: (json['addresses'] as List<dynamic>? ?? [])
          .map((a) => Address.fromJson(a as Map<String, dynamic>))
          .toList(),
      avatarUrl: json['avatarUrl'],
      token: json['token'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'addresses': addresses.map((a) => a.toJson()).toList(),
        'avatarUrl': avatarUrl,
        'token': token,
      };

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    List<Address>? addresses,
    String? avatarUrl,
    String? token,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      addresses: addresses ?? this.addresses,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      token: token ?? this.token,
    );
  }
}

class Address {
  final String id;
  final String title;
  final String fullAddress;
  final double? lat;
  final double? lng;
  final bool isDefault;

  const Address({
    required this.id,
    required this.title,
    required this.fullAddress,
    this.lat,
    this.lng,
    this.isDefault = false,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      fullAddress: json['fullAddress'] ?? json['address'] ?? '',
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
      isDefault: json['isDefault'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'fullAddress': fullAddress,
        'lat': lat,
        'lng': lng,
        'isDefault': isDefault,
      };
}
