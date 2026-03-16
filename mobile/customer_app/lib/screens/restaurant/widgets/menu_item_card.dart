import 'package:flutter/material.dart';
import '../../../config/theme.dart';
import '../../../models/menu_item.dart';
import '../../../providers/cart_provider.dart';

class MenuItemCard extends StatelessWidget {
  final MenuItem item;
  final CartProvider cartProvider;
  final String restaurantId;
  final String restaurantName;

  const MenuItemCard({
    super.key,
    required this.item,
    required this.cartProvider,
    required this.restaurantId,
    required this.restaurantName,
  });

  @override
  Widget build(BuildContext context) {
    final quantity = cartProvider.getItemQuantity(item.id);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black08, blurRadius: 6, offset: Offset(0, 2)),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: item.imageUrl.isNotEmpty
                ? Image.network(
                    item.imageUrl,
                    width: 90,
                    height: 90,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => _imagePlaceholder(),
                  )
                : _imagePlaceholder(),
          ),
          const SizedBox(width: 12),
          // Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                    color: AppTheme.textDark,
                  ),
                ),
                if (item.description.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      item.description,
                      style: const TextStyle(
                          color: AppTheme.textGrey, fontSize: 12),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${item.price.toStringAsFixed(2)} TL',
                      style: const TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    if (!item.isAvailable)
                      const Text(
                        'Mevcut değil',
                        style: TextStyle(
                          color: AppTheme.textGrey,
                          fontSize: 12,
                        ),
                      )
                    else if (quantity == 0)
                      _addButton(context)
                    else
                      _quantityControl(context, quantity),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _addButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Check if adding from different restaurant
        if (cartProvider.restaurantId != null &&
            cartProvider.restaurantId != restaurantId &&
            cartProvider.items.isNotEmpty) {
          _showRestaurantChangeDialog(context);
        } else {
          cartProvider.addItem(item, restaurantId, restaurantName);
        }
      },
      child: Container(
        width: 36,
        height: 36,
        decoration: const BoxDecoration(
          color: AppTheme.primaryColor,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.add, color: Colors.white, size: 22),
      ),
    );
  }

  Widget _quantityControl(BuildContext context, int quantity) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        GestureDetector(
          onTap: () => cartProvider.removeItem(item.id),
          child: Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.primaryColor),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.remove,
                color: AppTheme.primaryColor, size: 18),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            '$quantity',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: AppTheme.textDark,
            ),
          ),
        ),
        GestureDetector(
          onTap: () => cartProvider.addItem(item, restaurantId, restaurantName),
          child: Container(
            width: 30,
            height: 30,
            decoration: const BoxDecoration(
              color: AppTheme.primaryColor,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.add, color: Colors.white, size: 18),
          ),
        ),
      ],
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      width: 90,
      height: 90,
      decoration: BoxDecoration(
        color: const Color(0xFFF0F0F0),
        borderRadius: BorderRadius.circular(10),
      ),
      child: const Icon(Icons.fastfood, size: 36, color: Color(0xFFCCCCCC)),
    );
  }

  void _showRestaurantChangeDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sepeti Temizle?'),
        content: Text(
          'Sepetinizde "${cartProvider.restaurantName}" restoranından ürünler var. '
          'Yeni ürün eklemek için sepeti temizlemeniz gerekiyor.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              cartProvider.clear();
              cartProvider.addItem(item, restaurantId, restaurantName);
            },
            child: const Text('Temizle ve Ekle'),
          ),
        ],
      ),
    );
  }
}
