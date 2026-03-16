-- Siparim DB başlangıç scripti
-- TypeORM synchronize:true ile otomatik tablo oluşturur,
-- bu dosya sadece ek indexler ve ilk ayarlar içindir.

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- fuzzy search için

-- Performans indexleri (TypeORM tablolar oluştuktan sonra)
-- Bu indexler uygulama başladıktan sonra manuel çalıştırılabilir:
-- CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
-- CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
-- CREATE INDEX IF NOT EXISTS idx_couriers_online ON couriers(is_online);
