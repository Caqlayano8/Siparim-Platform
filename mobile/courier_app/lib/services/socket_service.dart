import 'package:socket_io_client/socket_io_client.dart' as io;
import '../config/api_config.dart';
import '../models/order_offer.dart';

typedef OfferCallback = void Function(OrderOffer offer);
typedef LocationUpdateCallback = void Function(double lat, double lng);

class SocketService {
  io.Socket? _socket;
  bool _isConnected = false;

  bool get isConnected => _isConnected;

  void connect(String token) {
    if (_isConnected) return;

    _socket = io.io(
      socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .disableAutoConnect()
          .setAuth({'token': token, 'role': 'courier'})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      _isConnected = true;
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
    });
  }

  void listenForOrderOffers(OfferCallback callback) {
    _socket?.on('courier:new-offer', (data) {
      if (data is Map<String, dynamic>) {
        callback(OrderOffer.fromJson(data));
      } else if (data is Map) {
        callback(OrderOffer.fromJson(Map<String, dynamic>.from(data)));
      }
    });
  }

  void emitLocation(double lat, double lng) {
    if (_isConnected) {
      _socket?.emit('courier:location', {'lat': lat, 'lng': lng});
    }
  }

  void emitOnlineStatus(bool isOnline) {
    if (_isConnected) {
      _socket?.emit('courier:status', {'isOnline': isOnline});
    }
  }

  void stopListeningForOffers() {
    _socket?.off('courier:new-offer');
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.destroy();
    _socket = null;
    _isConnected = false;
  }
}
