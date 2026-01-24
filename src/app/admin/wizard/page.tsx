"use client";

import React, { useState, useEffect } from "react";
import {
    Zap,
    Clock,
    FileText,
    CheckCircle,
    Loader,
    Target,
    Plus,
    Edit2,
    Menu,
    Users,
    Mail,
    Database,
    Settings,
    X,
    Eye,
    Trash2,
    AlertTriangle,
    RefreshCw, // New Icon
    MessageSquare, // New Icon
    ThumbsUp // New Icon
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    generateArticlesAction,
    getDraftArticlesAction,
    publishArticleAction,
    deleteArticleAction,
    getCategoriesAction,
    createCategoryAction,
    reviseArticleAction // New Action
} from "./actions";

export default function AIWizardPage() {
    // ... (existing state)
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState("");
    const [selectedTargetCategory, setSelectedTargetCategory] = useState("all");
    const [targetCount, setTargetCount] = useState(1);
    const [categories, setCategories] = useState<any[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedDraft, setSelectedDraft] = useState<any>(null);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
    const [aiProposal, setAiProposal] = useState<{ originalName: string, suggestedName: string, reason: string } | null>(null);

    // --- REFINEMENT LOOP STATE ---
    const [feedbackRating, setFeedbackRating] = useState(85);
    const [feedbackNotes, setFeedbackNotes] = useState("");
    const [isRevising, setIsRevising] = useState(false);

    // ... (refreshData, useEffect remain) ...
    async function refreshData() {
        setIsLoadingDrafts(true);
        const dData = await getDraftArticlesAction();
        const formattedDrafts = dData.map((d: any) => ({
            id: d.id,
            title: d.title,
            source: "AI / Gemini",
            status: d.published ? "Yayında" : "Onay Bekliyor",
            date: new Date(d.createdAt).toLocaleDateString("tr-TR", { hour: '2-digit', minute: '2-digit' }),
            category: d.category?.name || "Genel",
            content: d.content,
            image: d.imageUrl // Include image
        }));
        setDrafts(formattedDrafts);
        const cData = await getCategoriesAction();
        setCategories(cData);
        setIsLoadingDrafts(false);
    }

    useEffect(() => { refreshData(); }, []);

    // ... (startManualGeneration, handleCreateCategory remain) ...
    const startManualGeneration = async () => {
        setIsGenerating(true);
        setGenerationStep(`Gemini AI ${targetCount} adet makale üretiyor...`);
        setAiProposal(null);
        try {
            const res = await generateArticlesAction(selectedTargetCategory, targetCount);
            if (res.success) {
                setGenerationStep(`Başarılı! ${res.count} makale veritabanına eklendi.`);
                toast.success(`${res.count} makale üretimi tamamlandı! 🎉`);
                if (res.aiProposal) {
                    setAiProposal(res.aiProposal);
                    toast.info("AI yeni bir kategori önerdi!");
                }
                await refreshData();
            } else {
                toast.error(`Hata: ${res.error}`);
            }
        } catch (err) {
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setIsGenerating(false);
            setGenerationStep("");
        }
    };

    const handleCreateCategory = async (nameOverride?: string) => {
        const nameToCreate = nameOverride || newCategoryName;
        if (!nameToCreate) return;
        try {
            const res = await createCategoryAction(nameToCreate);
            if (res.success) {
                toast.success(`"${nameToCreate}" kategorisi oluşturuldu! ✅`);
                setNewCategoryName("");
                setShowCategoryModal(false);
                setAiProposal(null);
                await refreshData();
            } else {
                toast.error(`Hata: ${res.error}`);
            }
        } catch (error) {
            toast.error("Kategori oluştururken hata oluştu.");
        }
    };

    const handleReview = (draft: any) => {
        setSelectedDraft(draft);
        setFeedbackRating(85); // Reset
        setFeedbackNotes(""); // Reset
    };

    const handlePublish = async (id: string) => {
        if (!confirm("Bu makaleyi canlı sitede yayınlamak istiyor musunuz?")) return;
        const res = await publishArticleAction(id);
        if (res.success) {
            toast.success("İçerik başarıyla yayınlandı! 🎉");
            await refreshData();
            if (selectedDraft?.id === id) setSelectedDraft(null);
        } else {
            toast.error("Yayınlama başarısız oldu.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu taslağı tamamen silmek istiyor musunuz?")) return;
        const res = await deleteArticleAction(id);
        if (res.success) {
            toast.success("Taslak silindi.");
            await refreshData();
            if (selectedDraft?.id === id) setSelectedDraft(null);
        }
    }

    // --- REFINEMENT HANDLER ---
    const handleRefine = async () => {
        if (!selectedDraft) return;
        setIsRevising(true);
        try {
            const res = await reviseArticleAction(selectedDraft.id, feedbackRating, feedbackNotes);
            if (res.success) {
                toast.success("Makale geri bildirimlerinize göre revize edildi! 🚀");

                // Refresh data and keep modal open with new content
                const dData = await getDraftArticlesAction();
                const formattedDrafts = dData.map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    source: "AI / Gemini",
                    status: d.published ? "Yayında" : "Onay Bekliyor",
                    date: new Date(d.createdAt).toLocaleDateString("tr-TR", { hour: '2-digit', minute: '2-digit' }),
                    category: d.category?.name || "Genel",
                    content: d.content,
                    image: d.imageUrl
                }));
                setDrafts(formattedDrafts);

                // Find and update the selected draft view
                const updatedDraft = formattedDrafts.find((d: any) => d.id === selectedDraft.id);
                if (updatedDraft) setSelectedDraft(updatedDraft);

            } else {
                toast.error(`Revize hatası: ${res.error}`);
            }
        } catch (error) {
            toast.error("İyileştirme sırasında hata oluştu.");
        } finally {
            setIsRevising(false);
        }
    }


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

                    {/* Navigation ... */}
                    <div className="flex items-center gap-2">
                        {/* Admin Navigation */}
                        <Link href="/admin/menu" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Menü Yönetimi">
                            <Menu className="w-5 h-5" />
                        </Link>
                        <Link href="/admin/settings" className="p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600" title="Ayarlar">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Generation Controls ... (Same) */}
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
                                        {categories.map((cat: any) => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
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

                        {/* Drafts Queue ... (Same) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-sans font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    Onay Bekleyen Taslaklar
                                    <span className="bg-hc-blue text-white text-xs px-2 py-0.5 rounded-full">{drafts.length}</span>
                                </h2>
                            </div>

                            {isLoadingDrafts ? (
                                <div className="p-8 text-center text-gray-500 text-sm">Veriler yükleniyor...</div>
                            ) : drafts.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">Henüz onay bekleyen taslak yok.</div>
                            ) : (
                                <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                    {drafts.map((draft: any) => (
                                        <div key={draft.id} className="p-4 hover:bg-blue-50/20 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm">{draft.title}</h3>
                                                <div className="flex gap-2 text-xs mt-1">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{draft.category}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-500">{draft.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleDelete(draft.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column ... (Same) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-sans font-bold text-gray-900 tracking-tight">Kategori Yönetimi</h2>
                                <button onClick={() => setShowCategoryModal(true)} className="bg-gray-100 p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {categories.map((cat: any) => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 group">
                                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                        <button className="text-gray-400 hover:text-hc-blue opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="w-3 h-3" /></button>
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
                                            onClick={() => handleCreateCategory()}
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

            {/* Review Drawer (Side Panel Architecture) - REPLACED MODAL TO FIX CACHE/UI ISSUES */}
            {selectedDraft && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedDraft(null)}
                    ></div>

                    {/* Side Drawer Panel */}
                    <div className="relative w-full max-w-6xl h-full bg-[#FAFAFA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{selectedDraft.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{selectedDraft.category}</span>
                                    <span>•</span>
                                    <span>{new Date().toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePublish(selectedDraft.id)}
                                    className="hidden md:flex bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold items-center gap-2 transition-colors shadow-sm"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Yayınla
                                </button>
                                <button
                                    onClick={() => setSelectedDraft(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Split View Content */}
                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                            {/* Left: Article Preview (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white">
                                <div className="max-w-3xl mx-auto">
                                    {selectedDraft.image && (
                                        <div className="mb-8 rounded-xl overflow-hidden shadow-sm aspect-video bg-gray-100 relative group">
                                            <img src={selectedDraft.image} alt={selectedDraft.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <span className="text-white font-medium text-sm">AI Tarafından Üretildi</span>
                                            </div>
                                        </div>
                                    )}

                                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                                        {selectedDraft.title}
                                    </h1>

                                    <div
                                        className="prose prose-lg prose-blue max-w-none 
                                        prose-headings:font-bold prose-headings:text-gray-900 
                                        prose-p:text-gray-600 prose-p:leading-relaxed
                                        prose-img:rounded-xl prose-img:shadow-md
                                        prose-li:text-gray-600"
                                        dangerouslySetInnerHTML={{ __html: selectedDraft.content }}
                                    />
                                </div>
                            </div>

                            {/* Right: AI Refinement Console (Fixed) */}
                            <div className="w-full lg:w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-[40vh] lg:h-auto shrink-0 shadow-[inset_4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                                <div className="p-6 flex-1 overflow-y-auto">
                                    <div className="mb-6">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-hc-orange" fill="currentColor" />
                                            Editör Asistanı
                                        </h4>
                                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 leading-relaxed">
                                            Yazıyı inceleyin ve yapay zekaya geri bildirim verin. Puanınız ve notlarınızla AI bir sonraki yazıda sizi daha iyi anlayacak.
                                        </div>
                                    </div>

                                    {/* Control Group */}
                                    <div className="space-y-6">

                                        {/* Rating */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700">Kalite Puanı</label>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${feedbackRating >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {feedbackRating}/100
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0" max="100" step="5"
                                                value={feedbackRating}
                                                onChange={(e) => setFeedbackRating(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-hc-blue"
                                            />
                                        </div>

                                        {/* Feedback Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Düzeltme Notları</label>
                                            <textarea
                                                className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg focus:border-hc-orange focus:ring-1 focus:ring-hc-orange outline-none resize-none transition-shadow bg-white"
                                                placeholder="Örn: Görseli daha gerçekçi yap. Giriş paragrafını kısalt..."
                                                value={feedbackNotes}
                                                onChange={(e) => setFeedbackNotes(e.target.value)}
                                            />
                                            {/* Quick Actions Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {['Görseli Yenile 🖼️', 'Daha Samimi Ol 🥰', 'Tıbbi Kaynak Ekle 🩺', 'Daha Kısa Yaz ✂️'].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setFeedbackNotes(prev => prev ? `${prev}, ${tag}` : tag)}
                                                        className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-600 hover:border-hc-blue hover:text-hc-blue transition-colors"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                                    <button
                                        onClick={handleRefine}
                                        disabled={isRevising}
                                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {isRevising ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                AI Revize Ediyor...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-4 h-4" />
                                                Yazıyı İyileştir
                                            </>
                                        )}
                                    </button>

                                    {/* Mobile Publish Button */}
                                    <button
                                        onClick={() => handlePublish(selectedDraft.id)}
                                        className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors flex md:hidden items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Onayla ve Yayınla
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
