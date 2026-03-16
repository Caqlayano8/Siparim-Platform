import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/theme.dart';
import '../../providers/courier_provider.dart';

class EarningsScreen extends StatefulWidget {
  const EarningsScreen({super.key});

  @override
  State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Demo data
  final List<Map<String, dynamic>> _todayDeliveries = [
    {
      'restaurant': 'Burger Palace',
      'customer': 'Ahmet Y.',
      'earnings': 35.0,
      'time': DateTime.now().subtract(const Duration(hours: 1)),
      'status': 'delivered',
    },
    {
      'restaurant': 'Pizza Express',
      'customer': 'Fatma K.',
      'earnings': 42.0,
      'time': DateTime.now().subtract(const Duration(hours: 2)),
      'status': 'delivered',
    },
    {
      'restaurant': 'Döner Usta',
      'customer': 'Mehmet A.',
      'earnings': 28.0,
      'time': DateTime.now().subtract(const Duration(hours: 3)),
      'status': 'delivered',
    },
    {
      'restaurant': 'Sushi World',
      'customer': 'Ayşe B.',
      'earnings': 55.0,
      'time': DateTime.now().subtract(const Duration(hours: 4)),
      'status': 'delivered',
    },
    {
      'restaurant': 'Tatlı Dünyası',
      'customer': 'Can D.',
      'earnings': 30.0,
      'time': DateTime.now().subtract(const Duration(hours: 5)),
      'status': 'delivered',
    },
  ];

  final List<Map<String, dynamic>> _weeklyData = [
    {'day': 'Pzt', 'earnings': 180.0, 'deliveries': 5},
    {'day': 'Sal', 'earnings': 210.0, 'deliveries': 6},
    {'day': 'Çar', 'earnings': 155.0, 'deliveries': 4},
    {'day': 'Per', 'earnings': 240.0, 'deliveries': 7},
    {'day': 'Cum', 'earnings': 310.0, 'deliveries': 9},
    {'day': 'Cmt', 'earnings': 280.0, 'deliveries': 8},
    {'day': 'Paz', 'earnings': 175.0, 'deliveries': 5},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CourierProvider>().loadWeeklyEarnings();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final courierProvider = context.watch<CourierProvider>();
    final totalToday = _todayDeliveries.fold<double>(
      0.0,
      (sum, d) => sum + (d['earnings'] as double),
    );
    final totalWeekly = _weeklyData.fold<double>(
      0.0,
      (sum, d) => sum + (d['earnings'] as double),
    );

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceColor,
        title: const Text('Kazanç Raporu'),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppTheme.primaryColor,
          unselectedLabelColor: AppTheme.textGrey,
          indicatorColor: AppTheme.primaryColor,
          tabs: const [
            Tab(text: 'Bugün'),
            Tab(text: 'Bu Hafta'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDailyView(totalToday),
          _buildWeeklyView(totalWeekly),
        ],
      ),
    );
  }

  Widget _buildDailyView(double totalToday) {
    final timeFormat = DateFormat('HH:mm');

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Summary card
          _buildSummaryCard(
            title: 'Bugünkü Kazanç',
            amount: totalToday,
            icon: Icons.today,
            stats: [
              {
                'label': 'Teslimat',
                'value': '${_todayDeliveries.length}',
                'icon': Icons.delivery_dining
              },
              {
                'label': 'Ort. Kazanç',
                'value':
                    '${(totalToday / _todayDeliveries.length).toStringAsFixed(0)} TL',
                'icon': Icons.trending_up
              },
            ],
          ),
          const SizedBox(height: 20),

          // Deliveries list
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Teslimat Geçmişi',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
          ),
          const SizedBox(height: 10),
          ..._todayDeliveries.map(
            (delivery) => _deliveryRow(
              restaurantName: delivery['restaurant'],
              customerName: delivery['customer'],
              earnings: delivery['earnings'],
              time: timeFormat.format(delivery['time'] as DateTime),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyView(double totalWeekly) {
    final maxEarnings =
        _weeklyData.map((d) => d['earnings'] as double).reduce(
              (a, b) => a > b ? a : b,
            );

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Summary card
          _buildSummaryCard(
            title: 'Haftalık Kazanç',
            amount: totalWeekly,
            icon: Icons.date_range,
            stats: [
              {
                'label': 'Toplam',
                'value': '${_weeklyData.fold<int>(0, (s, d) => s + (d['deliveries'] as int))} teslimat',
                'icon': Icons.delivery_dining,
              },
              {
                'label': 'En İyi Gün',
                'value': _weeklyData.reduce((a, b) =>
                    (a['earnings'] as double) > (b['earnings'] as double) ? a : b)['day'],
                'icon': Icons.star,
              },
            ],
          ),
          const SizedBox(height: 20),

          // Bar chart
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.cardColor,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Günlük Dağılım',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: _weeklyData.map((day) {
                    final height =
                        ((day['earnings'] as double) / maxEarnings) * 120;
                    final isToday = day['day'] == DateFormat('EEE', 'tr_TR')
                        .format(DateTime.now())
                        .substring(0, 3);

                    return Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          '${(day['earnings'] as double).toStringAsFixed(0)}',
                          style: const TextStyle(
                            color: AppTheme.goldColor,
                            fontSize: 9,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          width: 32,
                          height: height,
                          decoration: BoxDecoration(
                            color: isToday
                                ? AppTheme.primaryColor
                                : AppTheme.primaryColor.withOpacity(0.4),
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(6)),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          day['day'],
                          style: TextStyle(
                            color: isToday
                                ? AppTheme.primaryColor
                                : AppTheme.textGrey,
                            fontSize: 11,
                            fontWeight: isToday
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                        Text(
                          '${day['deliveries']}',
                          style: const TextStyle(
                            color: AppTheme.textGrey,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required String title,
    required double amount,
    required IconData icon,
    required List<Map<String, dynamic>> stats,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF2A1A1A), Color(0xFF1A1A1A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
            color: AppTheme.primaryColor.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.primaryColor, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  color: AppTheme.textGrey,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: AppTheme.goldColor,
                  fontSize: 44,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const Padding(
                padding: EdgeInsets.only(bottom: 8, left: 4),
                child: Text(
                  'TL',
                  style: TextStyle(
                    color: AppTheme.goldColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: stats
                .map((s) => Expanded(
                      child: Row(
                        children: [
                          Icon(s['icon'] as IconData,
                              size: 16,
                              color: AppTheme.primaryColor),
                          const SizedBox(width: 6),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                s['value'] as String,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                s['label'] as String,
                                style: const TextStyle(
                                  color: AppTheme.textGrey,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _deliveryRow({
    required String restaurantName,
    required String customerName,
    required double earnings,
    required String time,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppTheme.onlineColor.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle,
                color: AppTheme.onlineColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  restaurantName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Text(
                  '$customerName • $time',
                  style: const TextStyle(
                    color: AppTheme.textGrey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '+${earnings.toStringAsFixed(0)} TL',
            style: const TextStyle(
              color: AppTheme.onlineColor,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}
