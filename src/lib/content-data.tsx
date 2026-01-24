import React from "react";

// --- Types & Data for Categories ---

export interface FeaturedArticle {
    title: string;
    url: string;
}

export interface CategorySection {
    title: string;
    description: string;
    featuredArticles: FeaturedArticle[];
    viewListUrl: string;
}

export interface CategoryData {
    title: string;
    slug: string;
    description: string;
    image: string;
    sections: CategorySection[];
    sidebarLinks: { title: string; url: string }[];
}

export const categoriesDB: Record<string, CategoryData> = {
    "saglikli-yasam": {
        title: "Sağlıklı Yaşam",
        slug: "saglikli-yasam",
        description: "Çocuğunuzun fiziksel, zihinsel ve sosyal sağlığını desteklemek için beslenme, egzersiz ve duygusal gelişim.",
        image: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=2069&auto=format&fit=crop",
        sidebarLinks: [
            { title: "Duygusal İyilik Hali", url: "#duygusal" },
            { title: "Fitness", url: "#fitness" },
            { title: "Sağlıklı Büyüme", url: "#buyume" },
            { title: "Beslenme", url: "#beslenme" },
            { title: "Ağız Sağlığı", url: "#agiz" },
            { title: "Uyku", url: "#uyku" },
            { title: "Spor", url: "#spor" }
        ],
        sections: [
            {
                title: "Beslenme",
                description: "Sizin ve çocuğunuzun yaptığı beslenme seçimleri çok önemlidir. İyi beslenme, sağlığın temelidir ve Çocuklara Sağlık Platformu, ebeveynleri beslenme kararlarını birer sağlık kararı olarak düşünmeye teşvik eder.",
                viewListUrl: "/saglikli-yasam/beslenme",
                featuredArticles: [
                    { title: "Yapay Gıda Boyaları Çocuklar İçin Güvenli mi?", url: "#" },
                    { title: "Bütçeyi Sarsmadan Aileyi Doğru Beslemek: Planlama İpuçları", url: "#" },
                    { title: "Çocuklarda Gıda Alerjileri: Nedenler, Belirtiler ve Tedavi", url: "#" }
                ]
            },
            {
                title: "Fitness",
                description: "Çocuğunuzun yapabileceği aktivite sıkıntısı yoktur ve tüm çocukların keyif alacağı bir egzersiz biçimi mutlaka vardır. Çocuğunuzu genç yaşta bu tür aktivitelere ilgi duymasını sağlarsanız, egzersiz ve fitness büyük olasılıkla on yıllar boyu sürecek bir alışkanlık haline gelecektir.",
                viewListUrl: "/saglikli-yasam/fitness",
                featuredArticles: [
                    { title: "Fiziksel Aktivite ve Çocuğunuzun Güvenliği", url: "#" },
                    { title: "Engelli Çocuklar ve Gençler İçin Fiziksel Aktivite", url: "#" }
                ]
            },
            {
                title: "Spor",
                description: "Gençler spor becerilerini bir sırayla geliştirirler, bu nedenle her sıra o çocuk için en üst düzeye çıkarılmalıdır. Her gelişimsel aşama tam olarak oluşursa, aktif çocuğunuz spora katılım konusunda maksimum kapasitesine daha eksiksiz bir şekilde ulaşma yeteneğine sahip olur.",
                viewListUrl: "/saglikli-yasam/spor",
                featuredArticles: [
                    { title: "Spor Muayenesi: Ne Zaman, Nerede, Kim Yapmalı?", url: "#" },
                    { title: "Basketbol & Voleybol: Yaygın Sakatlanmalar Nasıl Önlenir?", url: "#" },
                    { title: "Çocuklar İçin Dövüş Sanatları: Ebeveyn Rehberi", url: "#" }
                ]
            }
        ]
    },
    "yas-ve-gelisim": {
        title: "Yaş ve Gelişim",
        slug: "yas-ve-gelisim",
        description: "Çocuğunuzun her gelişim evresi özeldir.",
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop",
        sidebarLinks: [
            { title: "Hamilelik", url: "#prenatal" },
            { title: "Bebek", url: "#bebek" },
            { title: "Okul Çağı", url: "#okul" }
        ],
        sections: [
            {
                title: "Hamilelik & Doğum Öncesi",
                description: "Sağlıklı bir hamilelik süreci, bebeğinizin hayata en iyi başlangıcı yapmasını sağlar.",
                viewListUrl: "/yas-ve-gelisim/prenatal",
                featuredArticles: [
                    { title: "Doğum Çantası Hazırlığı", url: "#" },
                    { title: "İlk Trimesterde Beslenme", url: "#" }
                ]
            }
        ]
    }
};

// --- Types & Data for Corporate ---

export const corporateContent: Record<string, { title: string; content: React.ReactNode }> = {
    "hakkimizda": {
        title: "Hakkımızda",
        content: (
            <div className="space-y-4">
                <p><strong>CocuklaraSaglik.com</strong>, ebeveynlere çocuk sağlığı konusunda güvenilir, güncel ve uzman onaylı bilgiler sunmak amacıyla kurulmuş Türkiye'nin en kapsamlı pediatri portalıdır.</p>
                <p>Misyonumuz, bilgi kirliliğinin önüne geçerek anne ve babaların çocuklarını büyütürken karşılaştıkları sağlık sorunlarında doğru kararlar vermelerine yardımcı olmaktır. İçeriklerimiz, alanında uzman pediatristler, çocuk gelişim uzmanları ve beslenme uzmanları tarafından titizlikle hazırlanmakta ve denetlenmektedir.</p>
                <h3 className="text-xl font-bold text-hc-blue mt-6 mb-2">Vizyonumuz</h3>
                <p>Türkiye'de çocuk sağlığı okuryazarlığını artırmak ve her çocuğun sağlıklı bir geleceğe adım atmasına katkıda bulunmak.</p>
                <h3 className="text-xl font-bold text-hc-blue mt-6 mb-2">Değerlerimiz</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Bilimsellik ve Kanıta Dayalı Tıp</li>
                    <li>Güvenilirlik ve Şeffaflık</li>
                    <li>Çocuk Haklarına Saygı</li>
                    <li>Ebeveyn Güçlendirme</li>
                </ul>
            </div>
        ),
    },
    "iletisim": {
        title: "İletişim",
        content: (
            <div className="space-y-6">
                <p>Sorularınız, önerileriniz veya iş birliği talepleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-gray-50 p-6 rounded border border-gray-200">
                        <h3 className="font-bold text-hc-blue mb-2">Genel İletişim</h3>
                        <p className="text-sm text-gray-600 mb-1">E-posta:</p>
                        <a href="mailto:info@cocuklarasaglik.com" className="text-hc-orange font-bold hover:underline">info@cocuklarasaglik.com</a>
                        <p className="text-sm text-gray-600 mt-4 mb-1">Telefon:</p>
                        <span className="font-bold text-gray-700">+90 (212) 555 00 00</span>
                    </div>

                    <div className="bg-gray-50 p-6 rounded border border-gray-200">
                        <h3 className="font-bold text-hc-blue mb-2">Adres</h3>
                        <p className="text-gray-600 text-sm">
                            Teknopark İstanbul, Sanayi Mah.<br />
                            Teknoloji Bulvarı No:1<br />
                            Pendik / İstanbul
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-bold text-lg text-hc-blue mb-4">Bize Yazın</h3>
                    <form className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Adınız Soyadınız</label>
                            <input type="text" className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-hc-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">E-posta Adresiniz</label>
                            <input type="email" className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-hc-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mesajınız</label>
                            <textarea rows={4} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-hc-blue"></textarea>
                        </div>
                        <button className="bg-hc-blue text-white px-6 py-2 rounded font-bold hover:bg-blue-800 transition-colors">Gönder</button>
                    </form>
                </div>
            </div>
        ),
    },
    "gizlilik": {
        title: "Gizlilik Politikası",
        content: (
            <div className="space-y-4 text-sm text-gray-600">
                <p className="italic">Son Güncelleme: 23 Ocak 2026</p>
                <p><strong>CocuklaraSaglik.com</strong> olarak ziyaretçilerimizin gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi kullandığınızda hangi bilgilerin toplandığını ve bu bilgilerin nasıl kullanıldığını açıklamaktadır.</p>

                <h3 className="font-bold text-gray-800 text-base mt-4">1. Toplanan Bilgiler</h3>
                <p>Sitemizi ziyaret ettiğinizde, IP adresiniz, tarayıcı türünüz ve ziyaret saatleriniz gibi anonim veriler toplanabilir. Bültenimize kayıt olduğunuzda ise e-posta adresiniz saklanır.</p>

                <h3 className="font-bold text-gray-800 text-base mt-4">2. Çerezler (Cookies)</h3>
                <p>Kullanıcı deneyimini geliştirmek amacıyla çerezler kullanmaktayız. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman engelleyebilirsiniz.</p>

                <h3 className="font-bold text-gray-800 text-base mt-4">3. Üçüncü Taraf Bağlantılar</h3>
                <p>Sitemizde başka web sitelerine bağlantılar bulunabilir. Bu sitelerin gizlilik uygulamalarından CocuklaraSaglik.com sorumlu değildir.</p>
            </div>
        )
    },
    "kullanim-sartlari": {
        title: "Kullanım Şartları",
        content: (
            <div className="space-y-4 text-sm text-gray-600">
                <p>Lütfen sitemizi kullanmadan önce bu kullanım şartlarını dikkatlice okuyunuz.</p>

                <h3 className="font-bold text-gray-800 text-base mt-4">1. Tıbbi Tavsiye Değildir</h3>
                <p className="bg-red-50 p-4 border-l-4 border-red-500 text-red-700 font-medium">Bu sitede yer alan içerikler yalnızca bilgilendirme amaçlıdır. Profesyonel tıbbi tavsiye, teşhis veya tedavi yerine geçmez. Çocuğunuzun sağlığı ile ilgili her türlü durumda mutlaka bir doktora danışınız.</p>

                <h3 className="font-bold text-gray-800 text-base mt-4">2. İçerik Hakları</h3>
                <p>Sitedeki tüm metin, görsel ve tasarımların telif hakları CocuklaraSaglik.com'a aittir. İzinsiz kopyalanamaz.</p>
            </div>
        )
    },
    "editorial": {
        title: "Editoryal İlkeler",
        content: (
            <div className="space-y-4">
                <p>CocuklaraSaglik.com olarak yayınladığımız her içeriğin <strong>doğru, tarafsız ve güncel</strong> olmasına özen gösteriyoruz.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="border p-4 rounded text-center">
                        <div className="text-hc-green text-2xl mb-2">✓</div>
                        <h4 className="font-bold">Uzman Onayı</h4>
                        <p className="text-xs mt-2">Tıbbi içeriklerimiz mutlaka uzman doktorlar tarafından gözden geçirilir.</p>
                    </div>
                    <div className="border p-4 rounded text-center">
                        <div className="text-hc-blue text-2xl mb-2">↻</div>
                        <h4 className="font-bold">Güncellik</h4>
                        <p className="text-xs mt-2">Bilgilerimiz, değişen tıbbi literatüre göre düzenli olarak güncellenir.</p>
                    </div>
                    <div className="border p-4 rounded text-center">
                        <div className="text-hc-orange text-2xl mb-2">⛔</div>
                        <h4 className="font-bold">Bağımsızlık</h4>
                        <p className="text-xs mt-2">Ticari kaygılar, editoryal bağımsızlığımızı etkileyemez.</p>
                    </div>
                </div>
            </div>
        )
    }
};
