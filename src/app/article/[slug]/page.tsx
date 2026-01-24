"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Calendar,
    User,
    Share2,
    Printer,
    Volume2,
    Type,
    Facebook,
    Twitter,
    Linkedin,
    Mail
} from "lucide-react";
import { useParams } from "next/navigation";
import { SafeHTML } from "@/components/ui/SafeHTML";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";

// --- Mock Data ---
const articleDB = {
    title: "Bebeklerde Ateş: Ne Zaman Acile Gidilmeli?",
    category: "Sağlık Sorunları",
    categoryLink: "/saglik-sorunlari",
    author: "Çocuklara Sağlık Yayın Kurulu",
    authorTitle: "Otonom İçerik Ajansı",
    authorImage: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png",
    lastUpdated: "Az Önce",
    image: "/article-fever.png",
    content: `
    <p class="lead">Bebeğinizin ateşinin yükselmesi her ebeveyn için korkutucudur. Ancak ateş, aslında vücudun enfeksiyonlarla savaştığının sağlıklı bir işaretidir. Uzman klinik rehberlerine göre hazırlanan bu yazı, panik yapmadan doğru adımları atmanızı sağlayacak.</p>

    <h2>1. Ateş Nedir ve Nasıl Ölçülmelidir?</h2>
    <p>Bebeklerde en doğru ölçüm yöntemi, makattan (rektal) veya koltuk altından yapılan ölçümdür. Kulaktan ölçüm 6 aydan küçük bebeklerde yanıltıcı olabilir.</p>
    <ul>
        <li><strong>Rektal (Makat):</strong> 38.0°C ve üzeri ateştir.</li>
        <li><strong>Koltuk Altı:</strong> 37.2°C ve üzeri ateştir.</li>
    </ul>

    <h2>2. Hangi Durumlar ACİL Müdahale Gerektirir?</h2>
    <p>Ateşin derecesinden çok, çocuğunuzun genel durumu ve yaşı önemlidir. Aşağıdaki durumlarda <strong>vakit kaybetmeden en yakın acil servise</strong> başvurun:</p>
    
    <div class="highlight-box">
       <strong>KRİTİK UYARI:</strong> Bebeğiniz <strong>3 aydan küçükse</strong> ve ateşi ölçüldüyse, başka bir belirti aramaksızın hemen doktora gidin. Yenidoğanlarda bağışıklık sistemi tam gelişmediği için her ateş ciddiye alınmalıdır.
    </div>

    <ul>
      <li>Bebek sürekli ağlıyor ve sakinleştirilemiyorsa</li>
      <li>Uyanmakta zorlanıyor, aşırı halsizse (letarjik)</li>
      <li>Cildinde basınca solmayan mor döküntüler varsa</li>
      <li>Nefes alıp vermesi çok hızlıysa veya hırıltılıysa</li>
      <li>Nöbet geçiriyorsa</li>
    </ul>

    <h2>3. Evde Bakım ve Rahatlatma</h2>
    <p>Eğer genel durumu iyiyse ve yukarıdaki risk faktörleri yoksa, evde şu adımları izleyebilirsiniz:</p>
    <ul>
      <li><strong>Sıvı Takviyesi:</strong> Dehidrasyonu önlemek için sık sık emzirin veya formül mama verin.</li>
      <li><strong>İnce Giydirme:</strong> Bebeği kat kat giydirmekten kaçının, oda sıcaklığını 21-22 derecede tutun.</li>
      <li><strong>Ilık Kompres:</strong> Kesinlikle soğuk su veya sirkeli su kullanmayın; bu titremeye ve ateşin daha da yükselmesine neden olabilir. Ilık suyla ıslatılmış bezle eklem yerlerine kompres yapın.</li>
    </ul>

    <h2>4. İlaç Kullanımı</h2>
    <p>Doktorunuza danışmadan asla aspirin vermeyin (Reye Sendromu riski). Parasetamol veya ibuprofen kullanımı için mutlaka çocuğunuzun kilosuna uygun dozajı doktorunuzdan öğrenin.</p>
  `,
    relatedArticles: [
        { title: "Bebeklerde Ek Gıdaya Geçiş Rehberi", link: "#" },
        { title: "Çocuklarda Göz Sağlığı ve Ekran Kullanımı", link: "#" },
        { title: "Ev Kazalarını Önleme İpuçları", link: "#" },
        { title: "Yaz Aylarında Güneş Koruması", link: "#" }
    ]
};

export default function ArticlePage() {
    const params = useParams();

    // -- Text Size Control --
    const [textSize, setTextSize] = React.useState(1); // 1: normal, 1.2: large, 1.4: x-large
    const handleTextSize = () => {
        setTextSize(prev => prev >= 1.4 ? 1 : prev + 0.2);
    };

    // -- Text to Speech --
    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            } else {
                const utterance = new SpeechSynthesisUtterance(`${articleDB.title}. ${articleDB.content.replace(/<[^>]*>?/gm, '')}`);
                utterance.lang = 'tr-TR';
                window.speechSynthesis.speak(utterance);
            }
        } else {
            alert("Tarayıcınız sesli okuma özelliğini desteklemiyor.");
        }
    };

    return (
        <div className="font-sans text-[#333333] px-4 md:px-0" style={{ fontSize: `${textSize}rem` }}>

            {/* Breadcrumb */}
            <div className="text-[10px] text-hc-orange font-bold uppercase tracking-wide mb-6">
                <Link href="/" className="hover:underline">CocuklaraSaglik</Link>
                <span className="mx-2 text-gray-400">&gt;</span>
                <Link href={articleDB.categoryLink} className="hover:underline uppercase">{articleDB.category}</Link>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="text-gray-600 line-clamp-1">{articleDB.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* MAIN CONTENT (Column 9) */}
                <div className="lg:col-span-9">

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-serif text-[#e45d32] font-normal mb-4 leading-tight">
                        {articleDB.title}
                    </h1>

                    {/* Metadata Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 text-xs text-gray-500 gap-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 font-bold text-[#5c4a3d]">
                                <User className="w-3 h-3" />
                                {articleDB.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Son Güncelleme: {articleDB.lastUpdated}
                            </span>
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-3 no-print">
                            <button onClick={handleSpeak} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Dinle">
                                <Volume2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Dinle/Durdur</span>
                            </button>
                            <button onClick={handleTextSize} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Yazı Boyutu">
                                <Type className="w-4 h-4" />
                                <span className="hidden sm:inline">Yazı Boyutu ({textSize === 1 ? 'N' : textSize > 1.3 ? 'XL' : 'L'})</span>
                            </button>
                            <button onClick={() => window.print()} className="flex items-center gap-1 hover:text-hc-blue transition-colors" title="Yazdır">
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">Yazdır</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Article Image */}
                    {articleDB.image && (
                        <div className="mb-8 rounded-lg overflow-hidden shadow-sm">
                            <img
                                src={articleDB.image}
                                alt={articleDB.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                            <p className="text-[10px] text-gray-400 mt-2 text-right px-2 pb-2">Görsel: AI tarafından makale için özel üretilmiştir.</p>
                        </div>
                    )}

                    {/* Social Share (Top) */}
                    <div className="flex flex-wrap items-center gap-2 mb-8">
                        <span className="text-xs font-bold uppercase text-gray-400 mr-2">Paylaş</span>
                        <button className="w-8 h-8 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:opacity-90">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#1da1f2] text-white flex items-center justify-center hover:opacity-90">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90">
                            <Linkedin className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:opacity-90">
                            <Mail className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Article Body */}
                    <article className="prose md:prose-lg max-w-none text-[#333333] prose-headings:font-serif prose-headings:text-[#5c4a3d] prose-a:text-hc-blue prose-strong:text-[#333333]">
                        {/* We are using dangerouslySetInnerHTML for mock content, in real app sanitize this */}
                        <SafeHTML html={articleDB.content} />

                        {/* In-Article Ad */}
                        <div className="my-8">
                            <AdPlaceholder height="120px" label="İlginizi Çekebilir" />
                        </div>
                    </article>

                    {/* Disclaimer */}
                    <div className="mt-10 p-6 bg-[#fbfbf1] border-l-4 border-hc-orange text-sm text-gray-600 italic">
                        <strong>Yasal Uyarı:</strong> Bu sitedeki bilgiler yalnızca bilgilendirme amaçlıdır ve tıbbi tavsiye yerine geçmez. Çocuğunuzun sağlığı ile ilgili endişeleriniz varsa mutlaka bir doktora danışın.
                    </div>

                </div>

                {/* SIDEBAR (Column 3) */}
                <div className="lg:col-span-3 space-y-8">


                    {/* Author Profile Card */}
                    <div className="bg-white border border-gray-200 p-5 text-center">
                        <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#fbfbf1]">
                            <img
                                src={articleDB.authorImage}
                                alt={articleDB.author}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#5c4a3d] mb-1">
                            {articleDB.author}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-3">
                            {articleDB.authorTitle}
                        </p>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Çocuk sağlığı ve hastalıkları konusunda 15 yıllık tecrübeye sahip uzman doktor.
                        </p>
                        <Link href="/profile" className="text-hc-blue text-xs font-bold uppercase hover:underline">
                            Yazarın Profili
                        </Link>
                    </div>
                    {/* Related Articles */}
                    <div className="bg-white border border-gray-200 p-5">
                        <h3 className="text-hc-orange font-bold uppercase text-sm border-b border-gray-200 pb-2 mb-4">
                            İlgili İçerikler
                        </h3>
                        <ul className="space-y-3">
                            {articleDB.relatedArticles.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={item.link} className="text-sm text-gray-700 hover:text-hc-blue hover:underline block leading-snug">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Ad */}
                    <div className="bg-[#eef6fc] p-5 border-t-4 border-hc-blue">
                        <h3 className="text-hc-blue font-serif text-lg mb-2">Haftalık Bülten</h3>
                        <p className="text-xs text-gray-600 mb-3">Çocuğunuzun gelişimi için en güncel bilgiler e-postanızda.</p>
                        <input type="email" placeholder="E-posta" className="w-full px-3 py-2 text-sm border border-gray-300 mb-2" />
                        <button className="bg-hc-blue text-white w-full py-1.5 text-xs font-bold uppercase">ABONE OL</button>
                    </div>

                </div>

            </div>

            {/* Styles for Prose Content (Tailwind Typography overrides can go here or in globals) */}
            <style jsx global>{`
        .lead {
            font-size: 1.25rem;
            line-height: 1.8;
            color: #555;
            margin-bottom: 2rem;
            font-weight: 500;
        }
        .highlight-box {
            background-color: #F1F8E9;
            padding: 1.5rem;
            border-radius: 4px;
            margin: 2rem 0;
            border-left: 5px solid #6cbe45;
        }
        
        /* Typography Overrides */
        .prose h2 {
            font-family: var(--font-serif);
            color: #e45d32;
            font-size: 1.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .prose h3 {
            font-family: var(--font-serif);
            color: #5c4a3d;
            font-size: 1.25rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }
        .prose ul {
            list-style-type: none;
            padding-left: 0;
            margin-bottom: 1.5rem;
        }
        .prose ul li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.5rem;
            line-height: 1.7;
        }
        .prose ul li::before {
            content: "•";
            color: #e45d32;
            font-weight: bold;
            display: inline-block;
            width: 1rem;
            margin-left: -1rem;
            font-size: 1.2rem;
        }
        .prose p {
            line-height: 1.8;
            margin-bottom: 1.25rem;
            color: #333;
        }
        
        @media print {
            .no-print, header, footer, nav {
                display: none !important;
            }
            body { 
                background: white; 
            }
            .prose {
                font-size: 12pt;
                line-height: 1.4;
            }
        }
      `}</style>
        </div>
    );
}
