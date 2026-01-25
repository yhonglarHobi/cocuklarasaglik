"use client";

import React, { useState } from "react";
import {
    Upload,
    FileText,
    Image as ImageIcon,
    CheckCircle,
    AlertCircle,
    Database,
    Loader,
    ArrowRight,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { importWordpressXmlAction } from "./actions";
import Link from "next/link";

export default function WordpressImportPage() {
    const [step, setStep] = useState(1); // 1: Upload, 2: Analyze, 3: Importing, 4: Done
    const [file, setFile] = useState<File | null>(null);
    const [stats, setStats] = useState({ posts: 0, pages: 0, images: 0, authors: 0 });
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    const analyzeFile = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const content = await readFileContent(file);
            // Basit client-side analiz (Regex)
            const postCount = (content.match(/<wp:post_type>post<\/wp:post_type>/g) || []).length;
            const pageCount = (content.match(/<wp:post_type>page<\/wp:post_type>/g) || []).length;
            const imgCount = (content.match(/<wp:post_type>attachment<\/wp:post_type>/g) || []).length + (content.match(/<img /g) || []).length;

            setStats({
                posts: postCount,
                pages: pageCount,
                images: imgCount,
                authors: 1 // XML her zaman net yazar bilgisi vermez
            });
            setStep(2);
        } catch (error) {
            toast.error("Dosya okunamadı.");
        } finally {
            setLoading(false);
        }
    };

    const startImport = async () => {
        if (!file) return;
        setStep(3);
        setLogs(["Dosya okunuyor...", "Sunucuya gönderiliyor..."]);

        try {
            const content = await readFileContent(file);
            setLogs(prev => [...prev, "İçerik ayrıştırılıyor (bu işlem birkaç saniye sürebilir)..."]);

            const result = await importWordpressXmlAction(content);

            if (result.success) {
                setLogs(prev => [...prev, ...(result.details || [])]);
                setLogs(prev => [...prev, `BAŞARILI: ${result.importedCount} makale aktarıldı.`]);
                setStats(s => ({ ...s, posts: result.importedCount || 0 }));
                setStep(4);
                toast.success("İçe aktarma başarıyla tamamlandı!");
            } else {
                setLogs(prev => [...prev, `HATA: ${result.error}`]);
                toast.error(result.error || "Bir hata oluştu");
                // Hata olsa da logları göster
                // setStep(4); // İsterseniz hata ekranına yönlendirebilirsiniz
            }
        } catch (error: any) {
            setLogs(prev => [...prev, `KRİTİK HATA: ${error.message}`]);
            toast.error("İşlem sırasında hata oluştu.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#5c4a3d] flex items-center gap-3">
                            <Database className="w-8 h-8 text-hc-orange" />
                            WordPress İçe Aktarma (Import)
                        </h1>
                        <p className="text-gray-500 mt-2 ml-1">Eski sitenizdeki içerikleri XML yedeği ile yeni sisteme taşıyın.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                    {/* Progress Steps */}
                    <div className="bg-gray-50 border-b border-gray-200 p-6 flex justify-between items-center px-12">
                        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-hc-blue' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-hc-blue text-white' : 'bg-gray-200'}`}>1</div>
                            <span className="text-xs font-bold uppercase">Yükle</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-hc-blue' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-hc-blue' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-hc-blue text-white' : 'bg-gray-200'}`}>2</div>
                            <span className="text-xs font-bold uppercase">Analiz</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-hc-blue' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-hc-blue' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 3 ? 'bg-hc-blue text-white' : 'bg-gray-200'}`}>3</div>
                            <span className="text-xs font-bold uppercase">Aktar</span>
                        </div>
                        <div className={`flex-1 h-1 mx-4 ${step >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 4 ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>4</div>
                            <span className="text-xs font-bold uppercase">Sonuç</span>
                        </div>
                    </div>

                    <div className="p-10 min-h-[400px] flex flex-col items-center justify-center">

                        {/* STEP 1: UPLOAD */}
                        {step === 1 && (
                            <div className="w-full max-w-lg text-center space-y-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept=".xml"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-20 h-20 bg-blue-100 text-hc-blue rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-700">Yedek Dosyasını Sürükleyin</h3>
                                    <p className="text-gray-500 mt-2 text-sm">veya dosya seçmek için tıklayın (.xml)</p>
                                    <p className="text-xs text-gray-400 mt-4">(WordPress Panel {'>'} Araçlar {'>'} Dışa Aktar adımından aldığınız dosya)</p>
                                </div>

                                {file && (
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center justify-between animate-in fade-in">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-green-600" />
                                            <span className="font-bold text-gray-700 text-sm">{file.name}</span>
                                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button
                                            onClick={analyzeFile}
                                            disabled={loading}
                                            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                            Analiz Et
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 2: ANALYZE */}
                        {step === 2 && (
                            <div className="w-full max-w-2xl animate-in zoom-in-95">
                                <h2 className="text-xl font-bold text-center text-gray-800 mb-8">Yedek Dosyası İçeriği</h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                                        <FileText className="w-8 h-8 text-hc-blue mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-800">{stats.posts}</div>
                                        <div className="text-xs font-bold uppercase text-gray-500">Makale</div>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                                        <FileText className="w-8 h-8 text-hc-orange mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-800">{stats.pages}</div>
                                        <div className="text-xs font-bold uppercase text-gray-500">Sayfa</div>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center">
                                        <ImageIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-800">{stats.images}</div>
                                        <div className="text-xs font-bold uppercase text-gray-500">Görsel</div>
                                    </div>
                                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-800">{stats.authors}</div>
                                        <div className="text-xs font-bold uppercase text-gray-500">Yazar</div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-sm text-yellow-800">
                                    <p className="font-bold flex items-center gap-2 mb-1"><AlertCircle className="w-4 h-4" /> Dikkat Edilmesi Gerekenler:</p>
                                    <ul className="list-disc pl-5 space-y-1 opacity-90">
                                        <li>İçe aktarma işleminden sonra <strong>görsellerin URL'leri</strong> korunur (eski sunucudan çekilir).</li>
                                        <li>Kategori yapısı ve <strong>URL (Slug) yapısı</strong> %100 korunur.</li>
                                    </ul>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <button onClick={() => setStep(1)} className="text-gray-500 font-bold text-sm hover:underline">Geri Dön</button>
                                    <button
                                        onClick={startImport}
                                        className="bg-hc-blue text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-blue-700 shadow-md flex items-center gap-2"
                                    >
                                        <Database className="w-4 h-4" />
                                        İçe Aktarmayı Başlat
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: PROCESSING */}
                        {step === 3 && (
                            <div className="w-full max-w-xl text-center space-y-6 animate-in fade-in">
                                <RefreshCw className="w-16 h-16 text-hc-blue animate-spin mx-auto" />
                                <h2 className="text-xl font-bold text-gray-800">İçerikler Taşınıyor...</h2>

                                <p className="text-sm text-gray-500 font-mono">
                                    Lütfen bekleyin, veritabanına kayıt yapılıyor...
                                </p>

                                <div className="h-48 bg-black text-green-400 font-mono text-xs text-left p-4 rounded-lg overflow-y-auto space-y-1 border border-gray-700 shadow-inner">
                                    {logs.map((log, i) => (
                                        <div key={i}>{'>'} {log}</div>
                                    ))}
                                    <div className="animate-pulse">_</div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: SUCCESS */}
                        {step === 4 && (
                            <div className="text-center space-y-6 animate-in zoom-in">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-serif font-bold text-[#5c4a3d] mb-2">Harika! Taşıma Tamamlandı</h2>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Toplam <strong>{stats.posts} makale</strong> başarıyla yeni sisteminize aktarıldı. Artık içeriklerinizi yönetmeye başlayabilirsiniz.
                                </p>
                                <div className="flex justify-center gap-4 mt-8">
                                    <Link href="/admin/wizard-v2" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded font-bold hover:bg-gray-50">
                                        İçerikleri Yönet
                                    </Link>
                                    <Link href="/" target="_blank" className="bg-hc-blue text-white px-6 py-3 rounded font-bold hover:bg-blue-700 shadow-md">
                                        Sitede Gör
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
