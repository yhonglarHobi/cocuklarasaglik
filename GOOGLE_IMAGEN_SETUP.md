# 🎨 Google Vertex AI Imagen Kurulum Rehberi

## 📋 Gereksinimler
Projenizde Google Vertex AI Imagen kullanarak otomatik görsel oluşturmak için şu adımları izleyin:

---

## 1️⃣ Google Cloud Console'da Proje Ayarları

### A. Google Cloud Console'a Giriş
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Mevcut projenizi seçin: **`upbeat-nectar-427221-u3`**

### B. Vertex AI API'yi Aktifleştirin
1. Sol menüden **"APIs & Services"** > **"Library"** bölümüne gidin
2. Arama kutusuna **"Vertex AI API"** yazın
3. **"Vertex AI API"** seçin ve **"ENABLE"** butonuna tıklayın

### C. Imagen API'yi Aktifleştirin  
1. Aynı şekilde **"Generative AI on Vertex AI"** API'sini arayın
2. Bu API'yi de **aktif** edin

---

## 2️⃣ Service Account Oluşturma

### A. Service Account Sayfasına Gitme
1. Sol menüden **"IAM & Admin"** > **"Service Accounts"** seçin
2. **"+ CREATE SERVICE ACCOUNT"** butonuna tıklayın

### B. Service Account Bilgileri
1. **Service account name**: `vertex-imagen-service`
2. **Service account ID**: otomatik oluşturulur
3. **Description**: "Service account for Vertex AI Imagen image generation"
4. **"CREATE AND CONTINUE"** butonuna tıklayın

### C. Rol Verme (Grant Access)
Aşağıdaki rolleri ekleyin:
- **Vertex AI User** (`roles/aiplatform.user`)
- **Storage Object Creator** (`roles/storage.objectCreator`) - *isteğe bağlı, görsel kaydetmek için*

**"CONTINUE"** ve ardından **"DONE"** butonuna tıklayın

---

## 3️⃣ JSON Key Dosyası İndirme

### A. Key Oluşturma
1. Yeni oluşturduğunuz Service Account'a tıklayın
2. Üst menüden **"KEYS"** sekmesine gidin
3. **"ADD KEY"** > **"Create new key"** seçin
4. **JSON** formatını seçin
5. **"CREATE"** butonuna tıklayın

### B. Dosyayı Kaydetme
- Bilgisayarınıza bir JSON dosyası indirilecek
- Dosya adı: `upbeat-nectar-427221-u3-xxxxxx.json` gibi olacak
- **Bu dosyayı projenizin root klasörüne taşıyın**
- Dosya adını **`google-credentials.json`** olarak değiştirin

⚠️ **ÖNEMLİ**: Bu dosyayı GitHub'a yüklemeyin! `.gitignore` dosyanızda olduğundan emin olun.

---

## 4️⃣ Proje Yapılandırması

### A. .gitignore Kontrolü
`.gitignore` dosyanıza şunu ekleyin:
```
# Google Credentials
google-credentials.json
*.json
!package.json
!package-lock.json
!tsconfig.json
```

### B. .env Dosyasını Güncelleme
`.env` dosyanıza şu satırı ekleyin:
```env
# Vertex AI Imagen Configuration
VERTEX_PROJECT_ID="upbeat-nectar-427221-u3"
VERTEX_REGION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"
```

**Eski `VERTEX_API_KEY` satırını silebilirsiniz - artık gerekli değil.**

---

## 5️⃣ Kod Güncellemesi

Sistem otomatik olarak `GOOGLE_APPLICATION_CREDENTIALS` dosyasını kullanacak şekilde güncellenecek.

---

## 🧪 Test Etme

Kurulum tamamlandıktan sonra şu scripti çalıştırın:

```bash
npx tsx scripts/test-vertex-imagen.ts
```

✅ Başarılı olursa, `public/test-images/` klasöründe bir test görseli oluşturulacak.

---

## 🔍 Sorun Giderme

### Hata: "Permission Denied" 
- Service Account rollerini kontrol edin
- Vertex AI API'nin aktif olduğundan emin olun

### Hata: "Invalid Credentials"
- JSON dosyasının doğru konumda olduğunu kontrol edin
- `.env` dosyasındaki yolu kontrol edin

### Hata: "Quota Exceeded"
- Google Cloud Console'da quota limitlerini kontrol edin
- Billing (faturalandırma) aktif olmalıdır

---

## 💡 Notlar

- **Ücretsiz Deneme**: Google Cloud $300 ücretsiz kredi verir
- **Fiyatlandırma**: Imagen her görsel için ~$0.02-0.04 civarı ücret alır
- **Limit**: Varsayılan olarak dakikada 60 istek limitiniz var

---

## 📚 Ek Kaynaklar

- [Vertex AI Pricing](https://cloud.google.com/vertex-ai/pricing)
- [Imagen Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)
