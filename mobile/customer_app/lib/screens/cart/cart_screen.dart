import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _promoController = TextEditingController();
  bool _promoApplied = false;
  String _promoError = '';
  bool _isOrdering = false;

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
  }

  void _applyPromoCode(CartProvider cart) {
    final code = _promoController.text.trim();
    if (code.isEmpty) return;

    final prevDiscount = cart.discount;
    cart.applyPromoCode(code);

    setState(() {
      if (cart.discount > 0) {
        _promoApplied = true;
        _promoError = '';
      } else {
        _promoApplied = false;
        _promoError = 'Geçersiz promosyon kodu';
      }
    });
  }

  Future<void> _placeOrder(BuildContext context) async {
    final cart = context.read<CartProvider>();
    final auth = context.read<AuthProvider>();
    final orderProvider = context.read<OrderProvider>();

    if (cart.isEmpty) return;

    final user = auth.user;
    if (user == null) {
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }

    setState(() => _isOrdering = true);

    final order = await orderProvider.createOrder(
      restaurantId: cart.restaurantId ?? '',
      restaurantName: cart.restaurantName ?? '',
      items: cart.toOrderItems(),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      deliveryAddress: user.addresses.isNotEmpty
          ? user.addresses.first.fullAddress
          : 'İstanbul, Kadıköy',
      promoCode: cart.promoCode,
      discount: cart.discount,
    );

    setState(() => _isOrdering = false);

    if (!mounted) return;

    if (order != null) {
      cart.clear();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🎉 Siparişiniz alındı!'),
          backgroundColor: AppTheme.successColor,
        ),
      );
      Navigator.pushReplacementNamed(
        context,
        '/order-tracking',
        arguments: order.id,
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Sipariş oluşturulamadı. Tekrar deneyin.'),
          backgroundColor: AppTheme.primaryColor,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sepetim'),
        actions: [
          if (!cart.isEmpty)
            TextButton(
              onPressed: () => _showClearDialog(context, cart),
              child: const Text('Temizle',
                  style: TextStyle(color: AppTheme.primaryColor)),
            ),
        ],
      ),
      body: cart.isEmpty ? _emptyCart() : _buildCart(context, cart),
    );
  }

  Widget _emptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.shopping_cart_outlined,
              size: 100, color: AppTheme.textGrey),
          const SizedBox(height: 16),
          const Text(
            'Sepetiniz boş',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.textDark,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Restoranları keşfet ve sipariş ver',
            style: TextStyle(color: AppTheme.textGrey),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
            icon: const Icon(Icons.restaurant),
            label: const Text('Restoranları Keşfet'),
          ),
        ],
      ),
    );
  }

  Widget _buildCart(BuildContext context, CartProvider cart) {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Restaurant name
              if (cart.restaurantName != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.restaurant,
                          color: AppTheme.primaryColor, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        cart.restaurantName!,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 12),
              // Cart items
              ...cart.items.map((item) => _buildCartItem(item, cart)),
              const SizedBox(height: 16),
              // Promo code
              _buildPromoSection(cart),
              const SizedBox(height: 16),
              // Order summary
              _buildOrderSummary(cart),
            ],
          ),
        ),
        // Place order button
        _buildBottomBar(context, cart),
      ],
    );
  }

  Widget _buildCartItem(item, CartProvider cart) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black08, blurRadius: 4),
        ],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Container(
              width: 60,
              height: 60,
              color: const Color(0xFFF0F0F0),
              child: const Icon(Icons.fastfood,
                  color: Color(0xFFCCCCCC), size: 30),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.menuItem.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppTheme.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${item.menuItem.price.toStringAsFixed(2)} TL',
                  style: const TextStyle(
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Row(
            children: [
              GestureDetector(
                onTap: () => cart.removeItem(item.menuItem.id),
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    border: Border.all(color: AppTheme.primaryColor),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.remove,
                      color: AppTheme.primaryColor, size: 16),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Text(
                  '${item.quantity}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
              GestureDetector(
                onTap: () => cart.addItem(
                  item.menuItem,
                  cart.restaurantId!,
                  cart.restaurantName!,
                ),
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: const BoxDecoration(
                    color: AppTheme.primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.add, color: Colors.white, size: 16),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                '${item.subtotal.toStringAsFixed(2)} TL',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textDark,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPromoSection(CartProvider cart) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Promosyon Kodu',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 10),
          if (!_promoApplied)
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _promoController,
                    textCapitalization: TextCapitalization.characters,
                    decoration: InputDecoration(
                      hintText: 'Kodu girin',
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                      errorText: _promoError.isNotEmpty ? _promoError : null,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () => _applyPromoCode(cart),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 12),
                  ),
                  child: const Text('Uygula'),
                ),
              ],
            )
          else
            Row(
              children: [
                const Icon(Icons.check_circle,
                    color: AppTheme.successColor, size: 20),
                const SizedBox(width: 8),
                Text(
                  '${cart.promoCode} uygulandı — ${cart.discount.toStringAsFixed(2)} TL indirim',
                  style: const TextStyle(
                    color: AppTheme.successColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const Spacer(),
                GestureDetector(
                  onTap: () {
                    cart.removePromoCode();
                    _promoController.clear();
                    setState(() => _promoApplied = false);
                  },
                  child: const Icon(Icons.close,
                      color: AppTheme.textGrey, size: 18),
                ),
              ],
            ),
          const SizedBox(height: 6),
          const Text(
            'Deneme: SIPARIM10 • ILKSIPARIM • YEMEK5',
            style: TextStyle(color: AppTheme.textGrey, fontSize: 11),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummary(CartProvider cart) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black08, blurRadius: 4)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sipariş Özeti',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
          const SizedBox(height: 12),
          _summaryRow('Ara Toplam', '${cart.subtotal.toStringAsFixed(2)} TL'),
          _summaryRow(
              'Teslimat Ücreti',
              cart.deliveryFee == 0
                  ? 'Ücretsiz'
                  : '${cart.deliveryFee.toStringAsFixed(2)} TL'),
          if (cart.discount > 0)
            _summaryRow(
              'İndirim (${cart.promoCode})',
              '−${cart.discount.toStringAsFixed(2)} TL',
              color: AppTheme.successColor,
            ),
          const Divider(height: 20),
          _summaryRow(
            'Toplam',
            '${cart.total.toStringAsFixed(2)} TL',
            isBold: true,
            color: AppTheme.primaryColor,
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value,
      {bool isBold = false, Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: TextStyle(
                color: isBold ? AppTheme.textDark : AppTheme.textGrey,
                fontWeight:
                    isBold ? FontWeight.bold : FontWeight.normal,
              )),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              color: color ?? AppTheme.textDark,
              fontSize: isBold ? 16 : 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(BuildContext context, CartProvider cart) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: SizedBox(
        height: 54,
        child: ElevatedButton(
          onPressed: _isOrdering ? null : () => _placeOrder(context),
          child: _isOrdering
              ? const CircularProgressIndicator(
                  color: Colors.white, strokeWidth: 2)
              : Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Siparişi Onayla',
                      style: TextStyle(fontSize: 16),
                    ),
                    Text(
                      '${cart.total.toStringAsFixed(2)} TL',
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  void _showClearDialog(BuildContext context, CartProvider cart) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sepeti Temizle'),
        content: const Text('Sepetinizdeki tüm ürünler silinecek. Emin misiniz?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('İptal'),
          ),
          ElevatedButton(
            onPressed: () {
              cart.clear();
              Navigator.pop(ctx);
            },
            child: const Text('Temizle'),
          ),
        ],
      ),
    );
  }
}
