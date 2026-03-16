import 'menu_item.dart';

class CartItem {
  final MenuItem menuItem;
  int quantity;
  final String? note;

  CartItem({
    required this.menuItem,
    this.quantity = 1,
    this.note,
  });

  double get subtotal => menuItem.price * quantity;

  CartItem copyWith({int? quantity, String? note}) {
    return CartItem(
      menuItem: menuItem,
      quantity: quantity ?? this.quantity,
      note: note ?? this.note,
    );
  }

  Map<String, dynamic> toOrderItem() => {
        'menuItemId': menuItem.id,
        'name': menuItem.name,
        'quantity': quantity,
        'price': menuItem.price,
        'subtotal': subtotal,
      };
}
