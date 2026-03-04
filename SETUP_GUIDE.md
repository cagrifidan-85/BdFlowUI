# BdFlow - MongoDB & Cloudinary Entegrasyonu 

## ✅ Tamamlanan İşlemler

### Backend
- ✅ Express server kurulumu
- ✅ MongoDB model ve connection
- ✅ CRUD API endpoints (products)
- ✅ Cloudinary image upload/delete API
- ✅ Environment variables yapılandırması
- ✅ Seed script (mevcut ürünleri DB'ye aktarma)

### Frontend
- ✅ RTK Query API servisleri
- ✅ Products component API entegrasyonu
- ✅ Loading ve error state'leri
- ✅ Environment variables

---

## 🚀 Kurulum Adımları

### 1. Backend Kurulumu

```bash
# Backend dizinine git
cd server

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
copy .env.example .env
```

`.env` dosyasını düzenle ve şu bilgileri ekle:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/bdflow
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

### 2. MongoDB Atlas Hesabı Oluştur

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Ücretsiz hesap aç
2. Yeni cluster oluştur (Free tier seç - 512MB)
3. Database user oluştur (username/password kaydet)
4. Network Access'de IP whitelisting yap:
   - Development için: `0.0.0.0/0` (tüm IP'ler)
   - Production için: Sunucu IP'nizi ekleyin
5. Connect butonuna tıkla → "Connect your application" seç
6. Connection string'i kopyala ve `.env` dosyasına yapıştır

### 3. Cloudinary Hesabı Oluştur

1. [Cloudinary](https://cloudinary.com/) - Ücretsiz hesap aç (10GB)
2. Dashboard'dan şu bilgileri al:
   - Cloud Name
   - API Key
   - API Secret
3. `.env` dosyasına ekle

### 4. Veritabanına İlk Verileri Yükle

```bash
# server dizinindeyken
node scripts/seedProducts.js
```

Bu komut mevcut 12 ürünü MongoDB'ye aktaracak.

### 5. Server'ı Başlat

```bash
# Development mode (otomatik restart)
npm run dev

# Production mode
npm start
```

Server `http://localhost:5000` adresinde çalışacak.

### 6. Frontend'i Başlat

Yeni bir terminal aç:

```bash
# Ana dizine dön
cd ..

# React uygulamasını başlat
npm start
```

---

## 📋 API Test

Server çalıştıktan sonra test edin:

```bash
# Health check
curl http://localhost:5000/api/health

# Tüm ürünleri getir
curl http://localhost:5000/api/products
```

---

## 🎨 Cloudinary Image Upload Örneği

Frontend'den resim yüklemek için:

```typescript
const [uploadImage] = useUploadImageMutation();

const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const result = await uploadImage(formData).unwrap();

};
```

---

## 🔧 Sonraki Adımlar

### Admin Panel Geliştirmeleri
1. **Ürün Ekleme**: ProductEdit component'ine create modu ekle
2. **Resim Upload**: Cloudinary entegrasyonunu Edit/Create formlarına ekle
3. **Ürün Silme**: Delete butonu ve confirmation modal
4. **Arama/Filtreleme**: Kategori ve fiyat filtreleri

### Production Deployment
1. **Backend**: Heroku, Railway, veya Render
2. **Frontend**: Vercel, Netlify, veya GitHub Pages
3. **Environment Variables**: Production değerlerini ayarla

---

## 📁 Proje Yapısı

```
BdFlowUI/
├── server/                    # Backend API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary setup
│   ├── models/
│   │   └── Product.js        # Product schema
│   ├── routes/
│   │   ├── products.js       # Product CRUD endpoints
│   │   └── upload.js         # Image upload endpoints
│   ├── scripts/
│   │   └── seedProducts.js   # Initial data seed
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js             # Main server file
│
├── src/
│   └── apis/
│       ├── index.ts          # RTK Query base API
│       └── products/
│           └── index.ts      # Products API endpoints
│
└── .env                      # Frontend environment variables
```

---

## 💡 Önemli Notlar

- ✅ Görseller otomatik 800x800px optimize edilir
- ✅ Max dosya boyutu: 5MB
- ✅ Desteklenen formatlar: jpg, jpeg, png, webp
- ✅ API hatalarında fallback olarak hardcoded data gösterilir
- ✅ CORS tüm origin'lere açık (production'da kısıtlayın)

---

## 🐛 Sorun Giderme

**Server başlamıyor:**
- `.env` dosyasının doğru yapılandırıldığından emin olun
- MongoDB Atlas'ta IP whitelisting yapıldığından emin olun
- `npm install` komutunu tekrar çalıştırın

**Frontend API'ye bağlanamıyor:**
- Server'ın çalıştığından emin olun (`http://localhost:5000/api/health`)
- `.env` dosyasında `REACT_APP_API_URL` doğru mu kontrol edin
- React uygulamasını restart edin (env değişiklikleri için gerekli)

**Cloudinary upload çalışmıyor:**
- Cloudinary credentials'ı kontrol edin
- File size 5MB'dan küçük olduğundan emin olun
- Desteklenen format kullanıldığından emin olun

---

## 📞 Yardım

Herhangi bir sorun için:
1. Server loglarını kontrol edin
2. Browser console'u kontrol edin
3. Network tab'de API isteklerini inceleyin

Başarılar! 🎉
