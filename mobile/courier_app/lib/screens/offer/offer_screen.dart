import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/order_offer.dart';
import '../../providers/auth_provider.dart';
import '../../providers/courier_provider.dart';

class OfferScreen extends StatefulWidget {
  final OrderOffer offer;

  const OfferScreen({super.key, required this.offer});

  @override
  State<OfferScreen> createState() => _OfferScreenState();
}

class _OfferScreenState extends State<OfferScreen>
    with SingleTickerProviderStateMixin {
  static const int _totalSeconds = 15;
  int _remainingSeconds = _totalSeconds;
  Timer? _timer;
  late AnimationController _pulseController;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);

    _startCountdown();
  }

  void _startCountdown() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() => _remainingSeconds--);
      if (_remainingSeconds <= 0) {
        timer.cancel();
        _autoReject();
      }
    });
  }

  void _autoReject() async {
    if (!mounted) return;
    await context
        .read<CourierProvider>()
        .rejectOffer(widget.offer.orderId);
    if (mounted) Navigator.of(context).pop();
  }

  Future<void> _accept() async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);
    _timer?.cancel();

    final success = await context
        .read<CourierProvider>()
        .acceptOffer(widget.offer.orderId);

    if (!mounted) return;
    if (success) {
      Navigator.pushReplacementNamed(
        context,
        '/navigation',
        arguments: widget.offer.orderId,
      );
    } else {
      Navigator.pop(context);
    }
  }

  Future<void> _reject() async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);
    _timer?.cancel();
    await context
        .read<CourierProvider>()
        .rejectOffer(widget.offer.orderId);
    if (mounted) Navigator.pop(context);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final progress = _remainingSeconds / _totalSeconds;
    final isUrgent = _remainingSeconds <= 5;

    return WillPopScope(
      onWillPop: () async => false, // Cannot dismiss without action
      child: Scaffold(
        backgroundColor: AppTheme.backgroundColor,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                // Header
                const SizedBox(height: 16),
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor
                            .withOpacity(0.1 + _pulseController.value * 0.1),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(
                            color: AppTheme.primaryColor.withOpacity(0.5)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.notifications_active,
                              color: AppTheme.primaryColor, size: 18),
                          SizedBox(width: 8),
                          Text(
                            'YENİ SİPARİŞ TEKLİFİ',
                            style: TextStyle(
                              color: AppTheme.primaryColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                const SizedBox(height: 32),

                // Countdown circle
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 120,
                      height: 120,
                      child: CustomPaint(
                        painter: _CountdownPainter(
                          progress: progress,
                          isUrgent: isUrgent,
                        ),
                      ),
                    ),
                    Column(
                      children: [
                        Text(
                          '$_remainingSeconds',
                          style: TextStyle(
                            color:
                                isUrgent ? AppTheme.primaryColor : Colors.white,
                            fontSize: 42,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          'saniye',
                          style: TextStyle(
                            color: AppTheme.textGrey,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Offer details card
                Expanded(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.cardColor,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Restaurant name
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryColor.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                '🍔',
                                style: TextStyle(fontSize: 28),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.offer.restaurantName,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    '${widget.offer.itemCount} ürün',
                                    style: const TextStyle(
                                        color: AppTheme.textGrey,
                                        fontSize: 13),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        const Divider(color: Color(0xFF444444)),
                        const SizedBox(height: 16),

                        // Info rows
                        _offerInfoRow(
                          '📍',
                          'Mesafe',
                          '${widget.offer.distance.toStringAsFixed(1)} km',
                          Colors.lightBlue,
                        ),
                        const SizedBox(height: 14),
                        _offerInfoRow(
                          '💰',
                          'Kazanç',
                          '${widget.offer.earnings.toStringAsFixed(0)} TL',
                          AppTheme.goldColor,
                          isHighlight: true,
                        ),
                        const SizedBox(height: 14),
                        _offerInfoRow(
                          '🏪',
                          'Alış Adresi',
                          widget.offer.restaurantAddress.isNotEmpty
                              ? widget.offer.restaurantAddress
                              : 'Restoran adresi',
                          AppTheme.textGrey,
                        ),
                        const SizedBox(height: 14),
                        _offerInfoRow(
                          '🏠',
                          'Teslimat Adresi',
                          widget.offer.customerAddress.isNotEmpty
                              ? widget.offer.customerAddress
                              : 'Müşteri adresi',
                          AppTheme.textGrey,
                        ),

                        // Items list
                        if (widget.offer.items.isNotEmpty) ...[
                          const SizedBox(height: 16),
                          const Divider(color: Color(0xFF444444)),
                          const SizedBox(height: 10),
                          ...widget.offer.items.map(
                            (item) => Padding(
                              padding: const EdgeInsets.only(bottom: 4),
                              child: Row(
                                children: [
                                  const Icon(Icons.circle,
                                      size: 6, color: AppTheme.textGrey),
                                  const SizedBox(width: 8),
                                  Text(
                                    '${item.quantity}x ${item.name}',
                                    style: const TextStyle(
                                      color: AppTheme.textGrey,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Action buttons
                Row(
                  children: [
                    // Reject
                    Expanded(
                      flex: 2,
                      child: SizedBox(
                        height: 54,
                        child: OutlinedButton.icon(
                          onPressed: _isProcessing ? null : _reject,
                          icon: const Text('❌', style: TextStyle(fontSize: 16)),
                          label: const Text(
                            'REDDET',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.primaryColor,
                            side: const BorderSide(
                                color: AppTheme.primaryColor, width: 1.5),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Accept
                    Expanded(
                      flex: 3,
                      child: SizedBox(
                        height: 54,
                        child: ElevatedButton.icon(
                          onPressed: _isProcessing ? null : _accept,
                          icon: _isProcessing
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text('✅',
                                  style: TextStyle(fontSize: 18)),
                          label: const Text(
                            'KABUL ET',
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.5,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.onlineColor,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14)),
                            elevation: 4,
                            shadowColor:
                                AppTheme.onlineColor.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _offerInfoRow(
      String emoji, String label, String value, Color valueColor,
      {bool isHighlight = false}) {
    return Row(
      children: [
        Text(emoji, style: const TextStyle(fontSize: 18)),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                    color: AppTheme.textGrey, fontSize: 11),
              ),
              Text(
                value,
                style: TextStyle(
                  color: valueColor,
                  fontSize: isHighlight ? 22 : 14,
                  fontWeight: isHighlight ? FontWeight.w900 : FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _CountdownPainter extends CustomPainter {
  final double progress;
  final bool isUrgent;

  _CountdownPainter({required this.progress, required this.isUrgent});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 6;

    // Background circle
    final bgPaint = Paint()
      ..color = const Color(0xFF3A3A3A)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8;
    canvas.drawCircle(center, radius, bgPaint);

    // Progress arc
    final progressPaint = Paint()
      ..color = isUrgent ? AppTheme.primaryColor : AppTheme.onlineColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -math.pi / 2,
      2 * math.pi * progress,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CountdownPainter oldDelegate) =>
      oldDelegate.progress != progress || oldDelegate.isUrgent != isUrgent;
}
