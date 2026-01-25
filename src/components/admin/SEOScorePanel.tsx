"use client";

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Wand2 } from 'lucide-react';
import { SEOAnalysisResult, SEOCheckResult } from '@/lib/seo-analyzer';

interface SEOScorePanelProps {
    analysis: SEOAnalysisResult;
    onFix: (type: 'meta' | 'length' | 'keyword') => void;
    isFixing?: boolean; // Yükleniyor durumu için
}

export function SEOScorePanel({ analysis, onFix, isFixing }: SEOScorePanelProps) {
    // Skor rengini belirle
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Status icon'u belirle
    const StatusIcon = ({ check }: { check: SEOCheckResult }) => {
        if (check.status === 'good') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (check.status === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        return <XCircle className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sticky top-24">
            {/* Başlık ve Genel Skor */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-hc-blue" />
                    SEO Skoru
                </h3>
                <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                    <span className="text-sm text-gray-400">/100</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${getProgressColor(analysis.score)}`}
                        style={{ width: `${analysis.score}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                    {analysis.score >= 80 && '🎉 Mükemmel!'}
                    {analysis.score >= 60 && analysis.score < 80 && '👍 İyi, geliştirilebilir'}
                    {analysis.score < 60 && '⚠️ Geliştirilmeli'}
                </p>
            </div>

            {/* Detaylı Kontroller */}
            <div className="space-y-3 mb-6">
                <CheckItem
                    icon={<StatusIcon check={analysis.title} />}
                    label="Başlık Uzunluğu"
                    message={analysis.title.message}
                />

                <CheckItem
                    icon={<StatusIcon check={analysis.metaDescription} />}
                    label="Meta Açıklama"
                    message={analysis.metaDescription.message}
                    action={
                        analysis.metaDescription.status !== 'good' && (
                            <FixButton onClick={() => onFix('meta')} disabled={isFixing} />
                        )
                    }
                />

                <CheckItem
                    icon={<StatusIcon check={analysis.contentLength} />}
                    label="İçerik Uzunluğu"
                    message={analysis.contentLength.message}
                    action={
                        analysis.contentLength.status !== 'good' && (
                            <FixButton onClick={() => onFix('length')} disabled={isFixing} />
                        )
                    }
                />

                <CheckItem
                    icon={<StatusIcon check={analysis.keywordDensity} />}
                    label="Odak Kelime"
                    message={analysis.keywordDensity.message}
                    action={
                        analysis.keywordDensity.status !== 'good' && (
                            <FixButton onClick={() => onFix('keyword')} disabled={isFixing} />
                        )
                    }
                />

                <CheckItem
                    icon={<StatusIcon check={analysis.headings} />}
                    label="Başlık Yapısı"
                    message={analysis.headings.message}
                />
                <CheckItem
                    icon={<StatusIcon check={analysis.readability} />}
                    label="Okunabilirlik"
                    message={analysis.readability.message}
                />
                <CheckItem
                    icon={<StatusIcon check={analysis.imageAltText} />}
                    label="Görsel Alt Text"
                    message={analysis.imageAltText.message}
                />
            </div>

            {/* Öneriler */}
            {analysis.recommendations.length > 0 && (
                <div className={`p-4 rounded-md ${getScoreBgColor(analysis.score)} border ${analysis.score >= 80 ? 'border-green-300' : analysis.score >= 60 ? 'border-yellow-300' : 'border-red-300'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-2 text-gray-700">
                        💡 Öneriler
                    </h4>
                    <ul className="text-xs space-y-1">
                        {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-gray-600 leading-relaxed">
                                • {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Yardımcı Componentler
function CheckItem({ icon, label, message, action }: {
    icon: React.ReactNode;
    label: string;
    message: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2 group">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-700">{label}</p>
                    {action}
                </div>
                <p className="text-xs text-gray-500 leading-snug">{message}</p>
            </div>
        </div>
    );
}

function FixButton({ onClick, disabled }: { onClick: () => void, disabled?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="text-[10px] bg-blue-50 text-hc-blue px-2 py-0.5 rounded border border-blue-100 font-bold hover:bg-hc-blue hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
            title="AI ile Düzelt"
        >
            <Wand2 className="w-3 h-3" />
            Düzelt
        </button>
    )
}
