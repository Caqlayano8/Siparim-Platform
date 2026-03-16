import 'package:socket_io_client/socket_io_client.dart' as io;
import '../config/api_config.dart';

typedef OrderUpdateCallback = void Function(Map<String, dynamic> data);
typedef CourierLocationCallback = void Function(double lat, double lng);

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
          .setAuth({'token': token})
          .build(),
    );

    _socket!.connect();

    _socket!.onConnect((_) {
      _isConnected = true;
    });

    _socket!.onDisconnect((_) {
      _isConnected = false;
    });

    _socket!.onError((data) {
      _isConnected = false;
    });
  }

  void listenToOrderUpdates(String orderId, OrderUpdateCallback callback) {
    _socket?.on('order:$orderId:update', (data) {
      if (data is Map<String, dynamic>) {
        callback(data);
      }
    });
  }

  void listenToCourierLocation(String orderId, CourierLocationCallback callback) {
    _socket?.on('order:$orderId:courier-location', (data) {
      if (data is Map) {
        final lat = (data['lat'] as num?)?.toDouble();
        final lng = (data['lng'] as num?)?.toDouble();
        if (lat != null && lng != null) callback(lat, lng);
      }
    });
  }

  void stopListeningToOrder(String orderId) {
    _socket?.off('order:$orderId:update');
    _socket?.off('order:$orderId:courier-location');
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.destroy();
    _socket = null;
    _isConnected = false;
  }
}
