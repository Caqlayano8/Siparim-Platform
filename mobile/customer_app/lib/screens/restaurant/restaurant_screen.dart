import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/menu_item.dart';
import '../../models/restaurant.dart';
import '../../providers/cart_provider.dart';
import '../../services/restaurant_service.dart';
import 'widgets/menu_item_card.dart';

class RestaurantScreen extends StatefulWidget {
  final String restaurantId;

  const RestaurantScreen({super.key, required this.restaurantId});

  @override
  State<RestaurantScreen> createState() => _RestaurantScreenState();
}

class _RestaurantScreenState extends State<RestaurantScreen>
    with SingleTickerProviderStateMixin {
  final RestaurantService _service = RestaurantService();
  Restaurant? _restaurant;
  Map<String, List<MenuItem>> _menuGroups = {};
  bool _isLoading = true;
  TabController? _tabController;
  final List<String> _categories = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final restaurant =
          await _service.getRestaurantById(widget.restaurantId);
      final menuGroups =
          await _service.getMenuItems(widget.restaurantId);

      setState(() {
        _restaurant = restaurant;
        _menuGroups = menuGroups;
        _categories.addAll(menuGroups.keys);
        _tabController = TabController(
          length: _categories.length,
          vsync: this,
        );
        _isLoading = false;
      });
    } catch (e) {
      // Demo data
      setState(() {
        _restaurant = const Restaurant(
          id: '1',
          name: 'Burger Palace',
          description: 'En lezzetli burgerlar burada',
          category: 'Burger',
          rating: 4.7,
          ratingCount: 234,
          deliveryTime: 25,
          deliveryFee: 0,
          minOrder: 50,
          isOpen: true,
        );
        _menuGroups = {
          'Burgerlar': [
            MenuItem(
              id: '1',
              restaurantId: widget.restaurantId,
              name: 'Classic Burger',
              description: 'Dana eti, marul, domates, özel sos',
              price: 85.0,
              category: 'Burgerlar',
            ),
            MenuItem(
              id: '2',
              restaurantId: widget.restaurantId,
              name: 'Cheese Burger',
              description: 'Dana eti, çedar peyniri, turşu',
              price: 95.0,
              category: 'Burgerlar',
            ),
            MenuItem(
              id: '3',
              restaurantId: widget.restaurantId,
              name: 'Double Burger',
              description: 'Çift katlı dana eti, özel sos',
              price: 125.0,
              category: 'Burgerlar',
            ),
          ],
          'İçecekler': [
            MenuItem(
              id: '4',
              restaurantId: widget.restaurantId,
              name: 'Cola',
              description: '500ml soğuk içecek',
              price: 25.0,
              category: 'İçecekler',
            ),
            MenuItem(
              id: '5',
              restaurantId: widget.restaurantId,
              name: 'Ayran',
              description: 'Taze ayran',
              price: 15.0,
              category: 'İçecekler',
            ),
          ],
          'Yanlar': [
            MenuItem(
              id: '6',
              restaurantId: widget.restaurantId,
              name: 'Patates Kızartması',
              description: 'Büyük boy',
              price: 45.0,
              category: 'Yanlar',
            ),
          ],
        };
        _categories.addAll(_menuGroups.keys);
        _tabController = TabController(
          length: _categories.length,
          vsync: this,
        );
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Yükleniyor...')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            leading: IconButton(
              icon: const CircleAvatar(
                backgroundColor: Colors.white,
                child: Icon(Icons.arrow_back, color: AppTheme.textDark),
              ),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                icon: const CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Icon(Icons.favorite_border, color: AppTheme.primaryColor),
                ),
                onPressed: () {},
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: _restaurant?.imageUrl.isNotEmpty == true
                  ? Image.network(
                      _restaurant!.imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _restaurantPlaceholder(),
                    )
                  : _restaurantPlaceholder(),
            ),
          ),
          SliverToBoxAdapter(
            child: _buildRestaurantInfo(),
          ),
          if (_categories.isNotEmpty)
            SliverPersistentHeader(
              pinned: true,
              delegate: _TabBarDelegate(
                TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  labelColor: AppTheme.primaryColor,
                  unselectedLabelColor: AppTheme.textGrey,
                  indicatorColor: AppTheme.primaryColor,
                  tabs: _categories
                      .map((cat) => Tab(text: cat))
                      .toList(),
                ),
              ),
            ),
        ],
        body: _categories.isEmpty
            ? const Center(child: Text('Menü bulunamadı'))
            : TabBarView(
                controller: _tabController,
                children: _categories.map((cat) {
                  final items = _menuGroups[cat] ?? [];
                  return ListView.builder(
                    padding: const EdgeInsets.only(top: 8, bottom: 100),
                    itemCount: items.length,
                    itemBuilder: (context, i) => MenuItemCard(
                      item: items[i],
                      cartProvider: cartProvider,
                      restaurantId: _restaurant?.id ?? widget.restaurantId,
                      restaurantName: _restaurant?.name ?? '',
                    ),
                  );
                }).toList(),
              ),
      ),
      floatingActionButton: cartProvider.items.isNotEmpty &&
              cartProvider.restaurantId == (_restaurant?.id ?? widget.restaurantId)
          ? _buildCartButton(context, cartProvider)
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildRestaurantInfo() {
    if (_restaurant == null) return const SizedBox();
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  _restaurant!.name,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textDark,
                  ),
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: Colors.amber),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 16),
                    const SizedBox(width: 3),
                    Text(
                      '${_restaurant!.rating} (${_restaurant!.ratingCount})',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (_restaurant!.description.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                _restaurant!.description,
                style: const TextStyle(color: AppTheme.textGrey),
              ),
            ),
          const SizedBox(height: 12),
          Row(
            children: [
              _infoItem(
                Icons.access_time,
                '${_restaurant!.deliveryTime} dk',
                'Teslimat',
              ),
              const SizedBox(width: 20),
              _infoItem(
                Icons.delivery_dining,
                _restaurant!.deliveryFee == 0
                    ? 'Ücretsiz'
                    : '${_restaurant!.deliveryFee} TL',
                'Teslimat Ücreti',
              ),
              const SizedBox(width: 20),
              _infoItem(
                Icons.shopping_bag_outlined,
                'Min ${_restaurant!.minOrder} TL',
                'Min. Sipariş',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: AppTheme.primaryColor, size: 22),
        const SizedBox(height: 3),
        Text(value,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 13)),
        Text(label,
            style:
                const TextStyle(color: AppTheme.textGrey, fontSize: 11)),
      ],
    );
  }

  Widget _buildCartButton(BuildContext context, CartProvider cart) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: ElevatedButton(
        onPressed: () => Navigator.pushNamed(context, '/cart'),
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(54),
          backgroundColor: AppTheme.primaryColor,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                '${cart.itemCount} ürün',
                style: const TextStyle(
                    color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            const Text(
              'Sepete Git',
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold),
            ),
            Text(
              '${cart.subtotal.toStringAsFixed(2)} TL',
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _restaurantPlaceholder() {
    return Container(
      color: const Color(0xFFE0E0E0),
      child: const Icon(Icons.restaurant, size: 80, color: Color(0xFFBBBBBB)),
    );
  }
}

class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;

  _TabBarDelegate(this.tabBar);

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: Colors.white,
      child: tabBar,
    );
  }

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) =>
      false;
}
