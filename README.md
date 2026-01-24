# CocuklaraSaglik.com - Türkiye'nin Kapsamlı Çocuk Sağlığı Portalı

Bu proje, çocuk sağlığı alanında güvenilir, doktor onaylı içerikler sunan modern bir web uygulamasıdır. Next.js, React ve TailwindCSS teknolojileri kullanılarak geliştirilmiştir.

## 🚀 Özellikler

-   **Modern Arayüz:** TailwindCSS ile tasarlanmış, mobil uyumlu (responsive) ve estetik tasarım.
-   **İçerik Yönetimi:** Makaleler, kategoriler ve yazarlar için dinamik yapı.
-   **Admin Paneli:**
    -   **AI İçerik Sihirbazı:** Yapay zeka destekli içerik üretimi ve kategori önerileri.
    -   **Menü Yönetimi:** Site navigasyonunu düzenleme.
    -   **Bülten Yönetimi:** E-posta bültenleri oluşturma ve gönderim simülasyonu.
    -   **Kullanıcı Yönetimi:** Yazar ve uzman başvurularını yönetme.
-   **Sanal Veritabanı:** Demo amaçlı mock data kullanımı (gerçek veritabanına hazır yapı).

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/kullaniciadi/cocuklarasaglik.git
    cd cocuklarasaglik
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🏗️ Dağıtım (Build)

Projeyi üretime hazırlamak için:

```bash
npm run build
npm start
```

## 📂 Admin Paneli Erişimi

Admin paneline erişmek için:
1.  `/login` sayfasına gidin.
2.  "Uzman" sekmesine tıklayın.
3.  Formun altındaki admin linkine tıklayın veya doğrudan `/admin/wizard` adresine gidin.

## 🤝 Katkıda Bulunma

1.  Bu projeyi forklayın.
2.  Yeni bir özellik dalı (feature branch) oluşturun (`git checkout -b ozellik/YeniOzellik`).
3.  Değişikliklerinizi commit yapın (`git commit -m 'Yeni özellik eklendi'`).
4.  Dalınızı pushlayın (`git push origin ozellik/YeniOzellik`).
5.  Bir Pull Request oluşturun.

## 📝 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
