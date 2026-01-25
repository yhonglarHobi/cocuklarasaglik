# 🎨 Vertex AI Imagen Kurulum Rehberi

**Amaç:** Sitenizde AI ile otomatik görsel oluşturma özelliğini aktif hale getirmek.

**Süre:** ~15-20 dakika  
**Maliyet:** İlk 100 görsel ücretsiz, sonrası ~$0.02/görsel

---

## 📋 ÖN HAZIRLIK

### Gereksinimler:
- ✅ Google Cloud hesabı (Gmail ile ücretsiz açılır)
- ✅ Kredi kartı (doğrulama için, ilk $300 ücretsiz kredi verilir)
- ✅ Bilgisayarınızda terminal erişimi

---

## 🚀 ADIM 1: Google Cloud Projesi Oluşturma

### 1.1 Google Cloud Console'a Giriş
1. Tarayıcınızda şu adresi açın: https://console.cloud.google.com
2. Gmail hesabınızla giriş yapın
3. Sağ üstteki **"Select a project"** → **"New Project"** tıklayın

### 1.2 Proje Bilgileri
- **Project Name:** `cocuklarasaglik-ai` (veya istediğiniz isim)
- **Project ID:** Otomatik oluşur (örn: `cocuklarasaglik-ai-123456`)
- **CREATE** butonuna basın

**⏱️ Not:** Proje ID'nizi bir yere not edin, sonra lazım olacak.

---

## 🔧 ADIM 2: Vertex AI API'yi Aktif Etme

### 2.1 API Library'ye Git
1. Sol menüden **"APIs & Services"** → **"Library"** tıklayın
2. Arama kutusuna **"Vertex AI API"** yazın
3. **"Vertex AI API"** sonucuna tıklayın
4. **"ENABLE"** butonuna basın

### 2.2 Imagen API'yi Aktif Et
1. Tekrar arama kutusuna **"Cloud AI Platform"** yazın
2. **"Cloud AI Platform API"** sonucuna tıklayın
3. **"ENABLE"** butonuna basın

**⏱️ Not:** API'lerin aktif olması 1-2 dakika sürebilir.

---

## 🔑 ADIM 3: Service Account Oluşturma

### 3.1 Service Account Sayfasına Git
1. Sol menüden **"IAM & Admin"** → **"Service Accounts"** tıklayın
2. Üstteki **"+ CREATE SERVICE ACCOUNT"** butonuna basın

### 3.2 Service Account Detayları
**Adım 1: Service account details**
- **Service account name:** `vertex-imagen-bot`
- **Service account ID:** Otomatik doldurulur
- **Description:** `AI görsel oluşturma için bot hesabı`
- **CREATE AND CONTINUE** butonuna basın

**Adım 2: Grant this service account access to project**
- **Role** dropdown'ından şunu seçin:
  - `Vertex AI` → **"Vertex AI User"**
- **CONTINUE** butonuna basın

**Adım 3: Grant users access (opsiyonel)**
- Bu adımı boş bırakın
- **DONE** butonuna basın

---

## 📥 ADIM 4: JSON Key Dosyasını İndirme

### 4.1 Key Oluşturma
1. Oluşturduğunuz service account'un satırında **3 nokta (⋮)** → **"Manage keys"** tıklayın
2. **"ADD KEY"** → **"Create new key"** seçin
3. **Key type:** `JSON` seçili olsun
4. **CREATE** butonuna basın

**⬇️ Dosya otomatik indirilecek:** `cocuklarasaglik-ai-123456-abc123def456.json`

### 4.2 Dosyayı Proje Klasörüne Taşıma

**Windows (PowerShell):**
```powershell
# İndirilenler klasöründen proje klasörüne taşı
Move-Item "$env:USERPROFILE\Downloads\cocuklarasaglik-ai-*.json" "c:\YASAR\aistudio\antigravity\cocuklarasaglik\google-credentials.json"
```

**Mac/Linux (Terminal):**
```bash
mv ~/Downloads/cocuklarasaglik-ai-*.json ~/path/to/cocuklarasaglik/google-credentials.json
```

**⚠️ ÖNEMLİ:** Dosya adını tam olarak `google-credentials.json` yapın!

---

## 🔐 ADIM 5: Environment Variables Ayarlama

### 5.1 Yerel Geliştirme (.env dosyası)

`.env` dosyanız zaten var, şu satırları kontrol edin:

```bash
# Vertex AI Imagen Configuration
VERTEX_PROJECT_ID="cocuklarasaglik-ai-123456"  # ← Kendi Project ID'nizi yazın
VERTEX_REGION="us-central1"
GOOGLE_APPLICATION_CREDENTIALS="./google-credentials.json"
```

**Project ID'nizi bulmak için:**
- Google Cloud Console → Sol üstteki proje adına tıklayın
- Açılan pencerede **Project ID** sütununa bakın

### 5.2 Vercel (Canlı Site) Ayarları

1. https://vercel.com/dashboard adresine gidin
2. `cocuklarasaglik` projesine tıklayın
3. **Settings** → **Environment Variables** sekmesine gidin
4. Şu değişkenleri ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `VERTEX_PROJECT_ID` | `cocuklarasaglik-ai-123456` | Production, Preview, Development |
| `VERTEX_REGION` | `us-central1` | Production, Preview, Development |

**⚠️ Credentials Dosyası İçin:**

`google-credentials.json` dosyasının içeriğini kopyalayıp Vercel'e ekleyin:

1. Dosyayı bir metin editöründe açın
2. Tüm içeriği kopyalayın (baştan sona `{...}` dahil)
3. Vercel'de yeni bir environment variable ekleyin:
   - **Name:** `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value:** Kopyaladığınız JSON içeriği
   - **Environment:** Production, Preview, Development

4. `src/lib/vertex-imagen.ts` dosyasını güncelleyin (ben yapacağım):

---

## ✅ ADIM 6: Test Etme

### 6.1 Yerel Test
```bash
npm run dev
```

1. http://localhost:3000/admin/wizard adresine gidin
2. Bir makale oluşturun
3. Makaleyi inceleyin
4. **"AI Yenile"** butonuna basın
5. ~10-15 saniye sonra görsel oluşmalı

### 6.2 Hata Kontrolü

Terminal'de şu mesajları görmeli siniz:
```
🔐 Getting Vertex AI access token...
🎨 Generating image with Vertex AI Imagen: ...
✅ Vertex AI image saved: /generated/vertex-...
```

**Hata alırsanız:**
- `❌ Token error:` → Service Account izinlerini kontrol edin
- `❌ Vertex AI API Error: 403` → API'lerin aktif olduğundan emin olun
- `❌ Credentials file not found` → Dosya yolunu kontrol edin

---

## 💰 MALİYET BİLGİSİ

**Vertex AI Imagen Fiyatlandırması:**
- İlk 100 görsel: **ÜCRETSIZ** (aylık)
- 101-1000 görsel: **$0.02/görsel**
- 1000+ görsel: **$0.015/görsel**

**Örnek Hesaplama:**
- Ayda 50 makale × 1 görsel = 50 görsel → **$0** (ücretsiz)
- Ayda 200 makale × 1 görsel = 200 görsel → **$2** (100 ücretsiz + 100×$0.02)

**💡 İpucu:** İlk ay ücretsiz $300 krediniz var, rahatça test edebilirsiniz.

---

## 🔒 GÜVENLİK NOTLARI

### ✅ Yapılması Gerekenler:
1. **`.gitignore` kontrolü:** `google-credentials.json` dosyası GitHub'a yüklenmemeli (zaten ignore edilmiş)
2. **Key Rotation:** Her 90 günde bir yeni key oluşturun, eskisini silin
3. **Minimum İzinler:** Service Account'a sadece "Vertex AI User" rolü verin

### ❌ Yapılmaması Gerekenler:
1. Credentials dosyasını asla GitHub'a yüklemeyin
2. JSON içeriğini public bir yerde paylaşmayın
3. Service Account'a "Owner" veya "Editor" rolü vermeyin

---

## 🆘 SORUN GİDERME

### Sorun 1: "Permission Denied" Hatası
**Çözüm:**
1. IAM & Admin → Service Accounts
2. `vertex-imagen-bot` hesabına tıklayın
3. **PERMISSIONS** sekmesi → **GRANT ACCESS**
4. Role: `Vertex AI User` ekleyin

### Sorun 2: "Quota Exceeded" Hatası
**Çözüm:**
1. Aylık ücretsiz kotayı aştınız
2. Google Cloud Console → Billing → Enable billing
3. Veya bir sonraki ay başını bekleyin

### Sorun 3: Görsel Oluşmuyor Ama Hata Yok
**Çözüm:**
1. Terminal'de log'lara bakın
2. `public/generated` klasörünün var olduğundan emin olun
3. Dosya yazma izinlerini kontrol edin

---

## 📞 DESTEK

**Daha fazla yardım için:**
- Google Cloud Docs: https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview
- Vertex AI Pricing: https://cloud.google.com/vertex-ai/pricing

**Sorun yaşarsanız:**
- Terminal çıktısını kopyalayın
- `google-credentials.json` dosyasının varlığını kontrol edin
- Project ID'nin doğru olduğundan emin olun

---

## ✨ BAŞARILI KURULUM SONRASI

Kurulum başarılı olduktan sonra:
1. ✅ AI otomatik görsel oluşturacak
2. ✅ Her makale için özel, ilgili görseller
3. ✅ Manuel yüklemeye gerek kalmayacak
4. ✅ SEO için alt text otomatik oluşacak

**Tebrikler! 🎉 Artık AI destekli görsel sisteminiz hazır.**
