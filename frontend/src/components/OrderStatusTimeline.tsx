import { OrderStatus, StatusHistory } from '@/types';

const STEPS: { status: OrderStatus; label: string; icon: string; description: string }[] = [
  { status: 'pending', label: 'Sipariş Alındı', icon: '📋', description: 'Siparişiniz restorana iletildi' },
  { status: 'accepted', label: 'Onaylandı', icon: '✅', description: 'Restoran siparişinizi kabul etti' },
  { status: 'preparing', label: 'Hazırlanıyor', icon: '👨‍🍳', description: 'Yemeğiniz hazırlanıyor' },
  { status: 'ready', label: 'Hazır', icon: '🎉', description: 'Siparişiniz teslimata hazır' },
  { status: 'on_way', label: 'Yolda', icon: '🛵', description: 'Kurye siparişinizi teslim ediyor' },
  { status: 'delivered', label: 'Teslim Edildi', icon: '🏠', description: 'Siparişiniz teslim edildi' },
];

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusHistory?: StatusHistory[];
}

function getStatusIndex(status: OrderStatus): number {
  if (status === 'cancelled' || status === 'rejected') return -1;
  return STEPS.findIndex((s) => s.status === status);
}

export default function OrderStatusTimeline({
  currentStatus,
  statusHistory = [],
}: OrderStatusTimelineProps) {
  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'cancelled' || currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
        <span className="text-3xl">❌</span>
        <div>
          <p className="font-bold text-red-700">
            {currentStatus === 'cancelled' ? 'Sipariş İptal Edildi' : 'Sipariş Reddedildi'}
          </p>
          <p className="text-sm text-red-500 mt-0.5">
            {currentStatus === 'cancelled'
              ? 'Siparişiniz iptal edildi.'
              : 'Restoran siparişinizi reddetti.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200" />
      <div
        className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-500"
        style={{ height: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
      />

      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const isDone = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const historyEntry = statusHistory.find((h) => h.status === step.status);

          return (
            <div key={step.status} className="relative flex items-start gap-4 py-2">
              {/* Circle */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isDone
                    ? isCurrent
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                      : 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <span className="text-xl">{step.icon}</span>
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring opacity-30" />
                )}
              </div>

              <div className="flex-1 pt-2.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`font-semibold text-sm ${
                      isDone ? (isCurrent ? 'text-primary' : 'text-gray-700') : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {historyEntry && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(historyEntry.timestamp).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
