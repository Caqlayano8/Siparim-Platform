#!/bin/bash
# Siparim — Sunucu İlk Kurulum Scripti (Ubuntu 22.04)
# Kullanım: sudo bash setup-server.sh

set -e
echo "🚀 Siparim sunucu kurulumu başlıyor..."

# Docker kur
apt-get update -qq
apt-get install -y -qq docker.io docker-compose-plugin git curl

# Docker başlat
systemctl enable docker
systemctl start docker

# Proje klasörü
mkdir -p /opt/siparim
cd /opt/siparim

# .env dosyası oluştur (düzenle!)
if [ ! -f .env ]; then
cat > .env << 'EOF'
POSTGRES_DB=siparim_db
POSTGRES_USER=siparim
POSTGRES_PASSWORD=GUCLU_SIFRE_BURAYA
REDIS_PASSWORD=REDIS_SIFRE_BURAYA
JWT_SECRET=COK_GUCLU_SECRET_BURAYA
IYZICO_API_KEY=iyzico_api_key
IYZICO_SECRET_KEY=iyzico_secret
EOF
echo "⚠️  /opt/siparim/.env dosyasını düzenle!"
fi

# SSL sertifikası al
echo "📜 SSL sertifikası alınıyor..."
docker run --rm \
  -v /opt/siparim/certbot/certs:/etc/letsencrypt \
  -v /opt/siparim/certbot/webroot:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d siparim.com.tr -d siparim.com -d www.siparim.com.tr -d www.siparim.com \
  --email admin@siparim.com.tr \
  --agree-tos --no-eff-email

echo "✅ Kurulum tamamlandı!"
echo "📝 Sıradaki adımlar:"
echo "   1. /opt/siparim/.env dosyasını düzenle"
echo "   2. GitHub repo'yu clone'la: git clone https://github.com/Caqlayano8/siparim ."
echo "   3. docker compose -f docker-compose.prod.yml up -d"
