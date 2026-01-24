"use client";

import React, { useState } from "react";
import {
    Zap,
    Clock,
    FileText,
    CheckCircle,
    Loader,
    Settings,
    Play,
    Calendar,
    AlertTriangle,
    Target,
    Plus,
    Edit2,
    Menu,
    Users,
    Mail,
    Database,
    X,
    Eye
} from "lucide-react";
import Link from "next/link";

export default function AIWizardPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState("");
    const [selectedTargetCategory, setSelectedTargetCategory] = useState("all");
    const [targetCount, setTargetCount] = useState(5);

    // -- Categori Management State --
    const [categories, setCategories] = useState([
        { id: "nutrition", name: "Beslenme", slug: "/beslenme" },
        { id: "health", name: "Sağlık Sorunları", slug: "/saglik-sorunlari" },
        { id: "development", name: "Yaş ve Gelişim", slug: "/yas-ve-gelisim" },
        { id: "psychology", name: "Çocuk Psikolojisi", slug: "/psikoloji" }
    ]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const [selectedDraft, setSelectedDraft] = useState<any>(null);

    const [drafts, setDrafts] = useState([
        {
            id: 101,
            title: "Çocuklarda Mevsimsel Alerjiler: AAP Rehberi",
            source: "AAP",
            status: "Onay Bekliyor",
            date: "Bugün, 12:05",
            category: "Sağlık Sorunları",
            content: "Bu makalede Amerikan Pediatri Akademisi'nin (AAP) mevsimsel alerjiler konusundaki son rehberini derledik. Polen takvimi, belirtilerin yönetimi ve ilaç kullanımı hakkında ebeveynlere yönelik pratik bilgiler içerir. Özellikle bahar aylarında artan semptomlar için alınabilecek önlemler detaylandırılmıştır."
        },
        {
            id: 102,
            title: "Ek Gıdaya Geçişte 5 Altın Kural",
            source: "Nemours",
            status: "Onay Bekliyor",
            date: "Bugün, 12:05",
            category: "Beslenme",
            content: "Nemours KidsHealth verilerine dayanarak hazırlanan bu içerik, 6. aydan itibaren ek gıdaya geçiş sürecini ele alıyor. 3 gün kuralı, alerjen besinlerin tanıtımı ve püre kıvamları hakkında bilimsel öneriler sunuyor. Ebeveynlerin en sık yaptığı hatalar ve çözümleri madde madde sıralanmıştır."
        },
    ]);

    // -- Simulated AI Category Proposal --
    const [aiProposal, setAiProposal] = useState<{ originalName: string, suggestedName: string, reason: string } | null>(null);

    const startManualGeneration = () => {
        setIsGenerating(true);
        setGenerationStep("Kaynaklar taranıyor (AAP, Nemours, SickKids)...");

        setTimeout(() => setGenerationStep(`Hedef Kategori: ${categories.find(c => c.id === selectedTargetCategory)?.name || 'Karma'} analizi yapılıyor...`), 1500);
        setTimeout(() => setGenerationStep("İçerik sentezleniyor..."), 3000);

        setTimeout(() => {
            setIsGenerating(false);
            const newDrafts = [
                {
                    id: 201,
                    title: "Hedefli İçerik: Ergenlerde Ekran Bağımlılığı",
                    source: "AAP",
                    status: "Onay Bekliyor",
                    date: "Az önce",
                    category: selectedTargetCategory === 'all' ? "Çocuk Psikolojisi" : (categories.find(c => c.id === selectedTargetCategory)?.name || "Genel"),
                    content: "Ergenlerin ekran başında geçirdiği sürenin ruh sağlığına etkileri ve ebeveynlerin uygulayabileceği dijital detoks yöntemleri."
                },
                {
                    id: 202,
                    title: "Hedefli İçerik: Okul Öncesi Beslenme",
                    source: "Nemours",
                    status: "Onay Bekliyor",
                    date: "Az önce",
                    category: "Beslenme",
                    content: "Okul öncesi dönemdeki çocukların günlük kalori ihtiyaçları ve sağlıklı beslenme çantası örnekleri."
                },
            ];
            setDrafts([...newDrafts, ...drafts]);

            // Simulate AI proposing a weird category
            if (Math.random() > 0.5) {
                setAiProposal({
                    originalName: "Adolescent Mental Wellness",
                    suggestedName: "Ergen Ruh Sağlığı",
                    reason: "Sistemdeki 'Çocuk Psikolojisi' kategorisi bu içerik için çok genel kalıyor."
                });
            }

        }, 5000);
    };

    const handleCreateCategory = () => {
        if (newCategoryName) {
            setCategories([...categories, { id: newCategoryName.toLowerCase(), name: newCategoryName, slug: `/${newCategoryName.toLowerCase()}` }]);
            setNewCategoryName("");
            setShowCategoryModal(false);
        }
    };

    const handleReview = (draft: any) => {
        setSelectedDraft(draft);
    };

    const handlePublish = (id: number) => {
        // In a real app, this would make an API call to publish the article
        setDrafts(drafts.filter(d => d.id !== id));
        alert("İçerik başarıyla yayınlandı! 🎉\n(Canlı sitede Makaleler bölümüne eklendi)");
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] font-sans p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-3">
                            <Zap className="w-8 h-8 text-hc-orange" fill="currentColor" />
                            AI İçerik Sihirbazı
                        </h1>
                        <p className="text-gray-500 mt-2 ml-1">Otonom içerik üretim merkezi ve kategori yönetimi.</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Admin Navigation */}
                        <Link href="/admin/menu" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Menü Yönetimi">
                            <Menu className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/users" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Kullanıcı Yönetimi">
                            <Users className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/newsletter" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Bülten Yönetimi">
                            <Mail className="w-5 h-5" />
                        </Link>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <Link href="/admin/import" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="WordPress İçe Aktar (Import)">
                            <Database className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/settings" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Ayarlar">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Generation Controls */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Targeted Generation Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
                            <h2 className="text-xl font-sans font-bold text-gray-900 mb-6 flex items-center gap-2 tracking-tight">
                                <Target className="w-5 h-5 text-hc-blue" />
                                Hedefli İçerik Üretimi
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Hangi Kategoriden Üretilsin?</label>
                                    <select
                                        value={selectedTargetCategory}
                                        onChange={(e) => setSelectedTargetCategory(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded bg-gray-50 font-medium text-gray-700 focus:border-hc-orange outline-none"
                                    >
                                        <option value="all">🎲 Şansına Bırak (Karma)</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2">Kaç Adet?</label>
                                    <select
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(Number(e.target.value))}
                                        className="w-full p-3 border border-gray-300 rounded bg-gray-50 font-medium text-gray-700 focus:border-hc-orange outline-none"
                                    >
                                        <option value={1}>1 Makale</option>
                                        <option value={3}>3 Makale</option>
                                        <option value={5}>5 Makale</option>
                                        <option value={10}>10 Makale (Bulk)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={startManualGeneration}
                                disabled={isGenerating}
                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg font-bold text-white shadow-md transition-all transform hover:-translate-y-1 ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-hc-orange to-[#f5a623] hover:shadow-lg'}`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        {generationStep}
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" fill="white" />
                                        SİHİRBAZI BAŞLAT
                                    </>
                                )}
                            </button>
                        </div>

                        {/* AI Category Proposal Alert */}
                        {aiProposal && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-yellow-800">Yapay Zeka Yeni Bir Kategori Önerdi!</h3>
                                    <p className="text-sm text-yellow-700 mt-1 mb-3">
                                        AI, <strong>"{aiProposal.originalName}"</strong> konulu bir içerik üretti ancak mevcut kategorilere uymadığını düşünüyor.
                                        Önerisi: <strong>{aiProposal.suggestedName}</strong>.
                                        <br />
                                        <span className="text-xs italic opacity-80">Sebep: {aiProposal.reason}</span>
                                    </p>
                                    <div className="flex gap-3">
                                        <button className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded text-xs font-bold border border-yellow-200 hover:bg-yellow-200">
                                            Kategoriyi Onayla ve Ekle
                                        </button>
                                        <button className="bg-white text-gray-600 px-3 py-1.5 rounded text-xs font-bold border border-gray-200 hover:bg-gray-50">
                                            Yoksay (Genel Kategoriye Ata)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Drafts Queue */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-sans font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    Onay Bekleyen Taslaklar
                                    <span className="bg-hc-blue text-white text-xs px-2 py-0.5 rounded-full">{drafts.length}</span>
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {drafts.map((draft) => (
                                    <div key={draft.id} className="p-4 hover:bg-blue-50/20 transition-colors flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm">{draft.title}</h3>
                                            <div className="flex gap-2 text-xs mt-1">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{draft.category || 'Genel'}</span>
                                                <span className="text-hc-orange font-medium">{draft.source}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-500">{draft.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReview(draft)}
                                                    className="px-3 py-1 text-xs font-bold border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                                                >
                                                    <Eye className="w-3 h-3" /> İncele
                                                </button>
                                                <button
                                                    onClick={() => handlePublish(draft.id)}
                                                    className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                                                >
                                                    <CheckCircle className="w-3 h-3" /> Yayınla
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Category Management */}
                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-sans font-bold text-gray-900 tracking-tight">Kategori Yönetimi</h2>
                                <button
                                    onClick={() => setShowCategoryModal(true)}
                                    className="bg-gray-100 p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 group">
                                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                        <button className="text-gray-400 hover:text-hc-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {showCategoryModal && (
                                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Yeni Kategori Adı</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 p-2 text-sm border border-gray-300 rounded outline-none focus:border-hc-orange"
                                            placeholder="Örn: Ergen Sağlığı"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                        <button
                                            onClick={handleCreateCategory}
                                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            {/* Review Modal */}
            {selectedDraft && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{selectedDraft.title}</h3>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                                    <span className="bg-hc-blue/10 text-hc-blue px-2 py-0.5 rounded">{selectedDraft.category}</span>
                                    <span>•</span>
                                    Kayna: {selectedDraft.source}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDraft(null)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="prose prose-sm max-w-none">
                                <h4 className="font-bold text-gray-700 mb-2">Özet / Taslak İçerik</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {selectedDraft.content}
                                </p>

                                <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-100">
                                    <h5 className="font-bold text-yellow-800 text-xs mb-2 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> AI Analizi
                                    </h5>
                                    <p className="text-xs text-yellow-700">
                                        Bu içerik {selectedDraft.source} veritabanından çekilmiş ve {selectedDraft.category} kategorisine uygun olarak sentezlenmiştir. Doğruluk oranı %98.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setSelectedDraft(null)}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            >
                                Kapat
                            </button>
                            <button
                                onClick={() => {
                                    handlePublish(selectedDraft.id);
                                    setSelectedDraft(null);
                                }}
                                className="px-4 py-2 text-sm font-bold bg-green-600 text-white hover:bg-green-700 rounded shadow-sm hover:shadow transition-all flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Onayla ve Yayınla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
