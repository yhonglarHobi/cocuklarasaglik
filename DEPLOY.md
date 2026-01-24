# Projeyi Hostinge Yükleme Rehberi

Bu proje bir **Next.js** uygulamasıdır. Klasik PHP/HTML siteler gibi FTP ile dosya atarak çalışmaz (Static Export hariç). Bir Node.js sunucusuna ihtiyaç duyar.

İşte en popüler 2 yükleme yöntemi:

---

## YÖNTEM 1: Vercel (En Kolay & Önerilen) 🚀

Next.js'in yapımcıları tarafından sunulan bu servis, projenizi en performanslı ve ücretsiz (hobi için) şekilde barındırır.

### Adımlar:
1.  **GitHub'a Yükleyin:**
    -   Projenizi GitHub'da bir repoya yükleyin (`git push`).
2.  **Vercel Hesabı Açın:**
    -   [vercel.com](https://vercel.com) adresine gidin.
    -   "Continue with GitHub" diyerek giriş yapın.
3.  **Projeyi Bağlayın:**
    -   Dashboard'da **"Add New Project"** butonuna basın.
    -   GitHub'daki `cocuklarasaglik` reponuzu seçin ve "Import" deyin.
4.  **Ayarlar:**
    -   Framework Preset: `Next.js` (Otomatik seçilir).
    -   Root Directory: `./` (Değiştirmeyin).
    -   **Environment Variables:** Eğer veritabanı şifresi veya API anahtarı varsa buraya ekleyin.
5.  **Deploy:**
    -   **"Deploy"** butonuna basın. 1-2 dakika içinde siteniz `https://cocuklarasaglik.vercel.app` gibi bir adreste yayına girecektir.

---

## YÖNTEM 2: VPS / Sanal Sunucu (Profesyonel) 💻

Eğer bir VPS'iniz varsa (DigitalOcean, Turhost, Hetzner vb.) ve tam kontrol istiyorsanız. Node.js kurulu olmalıdır.

### Adımlar:
1.  **Sunucuya Dosyaları Atın:**
    -   Projeyi sunucuya kopyalayın (`git clone` ile).
2.  **Kurulum:**
    ```bash
    npm install
    npm run build
    ```
3.  **PM2 ile Çalıştırma (Sürekli Açık Kalması İçin):**
    -   `pm2` aracını kurun: `npm install -g pm2`
    -   Projeyi başlatın:
    ```bash
    pm2 start npm --name "cocuklarasaglik" -- start
    ```
4.  **Nginx Ayarı (Domain Bağlama):**
    -   80 portunu (Domain) 3000 portuna (Next.js) yönlendirmek için Nginx Reverse Proxy ayarı yapmanız gerekir.

---

## YÖNTEM 3: cPanel / Paylaşımlı Hosting (Zorunluysa) ⚠️

Standart hostinglerde Node.js desteği yoksa **çalışmaz**. Eğer Node.js desteği varsa:

1.  cPanel'de "Setup Node.js App" menüsüne gidin.
2.  Uygulama oluşturun ve dosya yolunu seçin.
3.  Dosyaları yükleyin (node_modules HARİÇ).
4.  Panelden "Run NPM Install" butonuna basın.
5.  Başlatın.

*Not: Eğer hostinginiz sadece HTML destekliyorsa, `next.config.ts` dosyasına `output: 'export'` ekleyip `npm run build` komutuyla statik dosyalar (HTML/CSS) üretebilirsiniz, ancak Giriş/Admin/Dinamik özellikler çalışmayabilir.*
