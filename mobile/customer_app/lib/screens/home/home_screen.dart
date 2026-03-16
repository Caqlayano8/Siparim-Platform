import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../../config/theme.dart';
import '../../models/restaurant.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../services/restaurant_service.dart';
import 'widgets/category_chip.dart';
import 'widgets/restaurant_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final RestaurantService _restaurantService = RestaurantService();
  final TextEditingController _searchController = TextEditingController();

  List<Restaurant> _restaurants = [];
  List<Restaurant> _filteredRestaurants = [];
  bool _isLoading = true;
  String? _error;
  String _selectedCategory = '';
  int _currentNavIndex = 0;

  static const List<Map<String, String>> _categories = [
    {'emoji': '🍽️', 'label': 'Tümü'},
    {'emoji': '🍔', 'label': 'Burger'},
    {'emoji': '🍕', 'label': 'Pizza'},
    {'emoji': '🌯', 'label': 'Döner'},
    {'emoji': '🍜', 'label': 'Fast Food'},
    {'emoji': '🍰', 'label': 'Tatlı'},
    {'emoji': '🥗', 'label': 'Salata'},
    {'emoji': '🍣', 'label': 'Sushi'},
  ];

  @override
  void initState() {
    super.initState();
    _loadRestaurants();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadRestaurants({String? category}) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final restaurants = await _restaurantService.getRestaurants(
        category: category,
      );
      setState(() {
        _restaurants = restaurants;
        _filteredRestaurants = restaurants;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
        // Show demo data on error
        _restaurants = _demoRestaurants();
        _filteredRestaurants = _demoRestaurants();
      });
    }
  }

  void _onSearchChanged() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredRestaurants = _restaurants.where((r) {
        return r.name.toLowerCase().contains(query) ||
            r.category.toLowerCase().contains(query);
      }).toList();
    });
  }

  void _onCategorySelected(String category) {
    setState(() {
      _selectedCategory = category == 'Tümü' ? '' : category;
    });
    _loadRestaurants(category: category == 'Tümü' ? null : category);
  }

  List<Restaurant> _demoRestaurants() {
    return [
      const Restaurant(
        id: '1',
        name: 'Burger Palace',
        description: 'En lezzetli burger\'lar burada',
        category: 'Burger',
        rating: 4.7,
        ratingCount: 234,
        deliveryTime: 25,
        deliveryFee: 0,
        minOrder: 50,
        isOpen: true,
      ),
      const Restaurant(
        id: '2',
        name: 'Pizza Express',
        description: 'Taş fırında İtalyan pizza',
        category: 'Pizza',
        rating: 4.5,
        ratingCount: 189,
        deliveryTime: 35,
        deliveryFee: 5,
        minOrder: 75,
        isOpen: true,
      ),
      const Restaurant(
        id: '3',
        name: 'Döner Usta',
        description: 'Geleneksel Türk döneri',
        category: 'Döner',
        rating: 4.8,
        ratingCount: 512,
        deliveryTime: 20,
        deliveryFee: 0,
        minOrder: 40,
        isOpen: true,
      ),
      const Restaurant(
        id: '4',
        name: 'Tatlı Dünyası',
        description: 'Her türlü tatlı',
        category: 'Tatlı',
        rating: 4.3,
        ratingCount: 98,
        deliveryTime: 30,
        deliveryFee: 8,
        minOrder: 60,
        isOpen: false,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final cartCount = context.watch<CartProvider>().itemCount;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: SafeArea(
        child: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            SliverAppBar(
              floating: true,
              snap: true,
              backgroundColor: Colors.white,
              elevation: 0,
              title: null,
              flexibleSpace: FlexibleSpaceBar(
                background: _buildHeader(user?.name ?? 'Misafir'),
              ),
              expandedHeight: 140,
              toolbarHeight: 0,
            ),
          ],
          body: RefreshIndicator(
            onRefresh: () => _loadRestaurants(
              category: _selectedCategory.isEmpty ? null : _selectedCategory,
            ),
            color: AppTheme.primaryColor,
            child: CustomScrollView(
              slivers: [
                // Search bar
                SliverToBoxAdapter(
                  child: _buildSearchBar(),
                ),
                // Categories
                SliverToBoxAdapter(
                  child: _buildCategories(),
                ),
                // Section title
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      children: [
                        const Text(
                          'Restoranlar',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textDark,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          '${_filteredRestaurants.length} restoran',
                          style: const TextStyle(
                            color: AppTheme.textGrey,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                // Restaurant list
                if (_isLoading)
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (_, __) => _shimmerCard(),
                      childCount: 4,
                    ),
                  )
                else if (_filteredRestaurants.isEmpty)
                  SliverFillRemaining(
                    child: _emptyState(),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, i) => RestaurantCard(
                        restaurant: _filteredRestaurants[i],
                        onTap: () => Navigator.pushNamed(
                          context,
                          '/restaurant',
                          arguments: _filteredRestaurants[i].id,
                        ),
                      ),
                      childCount: _filteredRestaurants.length,
                    ),
                  ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: 80),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentNavIndex,
        onDestinationSelected: (i) {
          setState(() => _currentNavIndex = i);
          switch (i) {
            case 1:
              Navigator.pushNamed(context, '/orders');
              break;
            case 2:
              Navigator.pushNamed(context, '/cart');
              break;
            case 3:
              Navigator.pushNamed(context, '/profile');
              break;
          }
        },
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Ana Sayfa',
          ),
          const NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long),
            label: 'Siparişler',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: cartCount > 0,
              label: Text('$cartCount'),
              child: const Icon(Icons.shopping_cart_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: cartCount > 0,
              label: Text('$cartCount'),
              child: const Icon(Icons.shopping_cart),
            ),
            label: 'Sepet',
          ),
          const NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
        backgroundColor: Colors.white,
        indicatorColor: AppTheme.primaryColor.withOpacity(0.15),
      ),
    );
  }

  Widget _buildHeader(String userName) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Merhaba, $userName 👋',
                      style: const TextStyle(
                        color: AppTheme.textGrey,
                        fontSize: 13,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            color: AppTheme.primaryColor, size: 18),
                        const SizedBox(width: 4),
                        const Expanded(
                          child: Text(
                            'İstanbul, Kadıköy',
                            style: TextStyle(
                              color: AppTheme.textDark,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(Icons.keyboard_arrow_down,
                            color: AppTheme.textGrey, size: 20),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  color: AppTheme.primaryColor,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person, color: Colors.white, size: 22),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Restoran veya yemek ara...',
          hintStyle:
              const TextStyle(color: AppTheme.textGrey, fontSize: 14),
          prefixIcon:
              const Icon(Icons.search, color: AppTheme.textGrey),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear, color: AppTheme.textGrey),
                  onPressed: () {
                    _searchController.clear();
                    _onSearchChanged();
                  },
                )
              : null,
          fillColor: Colors.white,
          filled: true,
        ),
      ),
    );
  }

  Widget _buildCategories() {
    return SizedBox(
      height: 56,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        itemCount: _categories.length,
        itemBuilder: (context, i) {
          final cat = _categories[i];
          final isSelected = _selectedCategory == cat['label'] ||
              (_selectedCategory.isEmpty && cat['label'] == 'Tümü');
          return CategoryChip(
            emoji: cat['emoji']!,
            label: cat['label']!,
            isSelected: isSelected,
            onTap: () => _onCategorySelected(cat['label']!),
          );
        },
      ),
    );
  }

  Widget _shimmerCard() {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE0E0E0),
      highlightColor: const Color(0xFFF5F5F5),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        height: 220,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  Widget _emptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.restaurant_menu,
              size: 72, color: AppTheme.textGrey),
          const SizedBox(height: 16),
          const Text(
            'Restoran bulunamadı',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.textGrey,
            ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () {
              _searchController.clear();
              setState(() => _selectedCategory = '');
              _loadRestaurants();
            },
            child: const Text(
              'Filtreleri temizle',
              style: TextStyle(color: AppTheme.primaryColor),
            ),
          ),
        ],
      ),
    );
  }
}
