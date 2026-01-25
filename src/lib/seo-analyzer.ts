/**
 * SEO Analyzer - İçerik SEO Skorlama Motoru
 * Başlık, meta, içerik uzunluğu, kelime yoğunluğu ve okunabilirlik analizi
 */

export interface SEOAnalysisResult {
    score: number; // 0-100
    title: SEOCheckResult;
    metaDescription: SEOCheckResult;
    contentLength: SEOCheckResult;
    keywordDensity: SEOCheckResult;
    headings: SEOCheckResult;
    readability: SEOCheckResult;
    imageAltText: SEOCheckResult;
    recommendations: string[];
}

export interface SEOCheckResult {
    status: 'good' | 'warning' | 'error';
    message: string;
    score: number; // 0-100 for this specific check
    details?: any;
}

/**
 * Ana SEO Analiz Fonksiyonu
 */
export function analyzeSEO(
    title: string,
    metaDescription: string,
    content: string,
    focusKeyword?: string,
    imageUrl?: string | null,
    imageAltText?: string
): SEOAnalysisResult {
    const results: SEOAnalysisResult = {
        score: 0,
        title: checkTitle(title),
        metaDescription: checkMetaDescription(metaDescription),
        contentLength: checkContentLength(content),
        keywordDensity: checkKeywordDensity(content, focusKeyword),
        headings: checkHeadings(content),
        readability: checkReadability(content),
        imageAltText: checkImageAltText(imageUrl, imageAltText),
        recommendations: []
    };

    // Genel skoru hesapla (ortalama)
    const scores = [
        results.title.score,
        results.metaDescription.score,
        results.contentLength.score,
        results.keywordDensity.score,
        results.headings.score,
        results.readability.score,
        results.imageAltText.score
    ];

    results.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Öneriler oluştur
    results.recommendations = generateRecommendations(results);

    return results;
}

/**
 * Başlık Kontrolü (50-60 karakter ideal)
 */
export function checkTitle(title: string): SEOCheckResult {
    const length = title.length;

    if (length === 0) {
        return {
            status: 'error',
            message: 'Başlık boş!',
            score: 0,
            details: { length: 0, ideal: '50-60' }
        };
    }

    if (length >= 50 && length <= 60) {
        return {
            status: 'good',
            message: `Başlık uzunluğu mükemmel (${length}/60)`,
            score: 100,
            details: { length, ideal: '50-60' }
        };
    }

    if (length >= 40 && length < 50) {
        return {
            status: 'warning',
            message: `Başlık biraz kısa (${length}/60)`,
            score: 70,
            details: { length, ideal: '50-60' }
        };
    }

    if (length > 60 && length <= 70) {
        return {
            status: 'warning',
            message: `Başlık biraz uzun (${length}/60)`,
            score: 70,
            details: { length, ideal: '50-60' }
        };
    }

    return {
        status: 'error',
        message: length < 40 ? `Başlık çok kısa (${length}/60)` : `Başlık çok uzun (${length}/60)`,
        score: 30,
        details: { length, ideal: '50-60' }
    };
}

/**
 * Meta Açıklama Kontrolü (150-160 karakter ideal)
 */
export function checkMetaDescription(meta: string): SEOCheckResult {
    const length = meta.length;

    if (length === 0) {
        return {
            status: 'error',
            message: 'Meta açıklama boş!',
            score: 0,
            details: { length: 0, ideal: '150-160' }
        };
    }

    if (length >= 150 && length <= 160) {
        return {
            status: 'good',
            message: `Meta açıklama mükemmel (${length}/160)`,
            score: 100,
            details: { length, ideal: '150-160' }
        };
    }

    if (length >= 120 && length < 150) {
        return {
            status: 'warning',
            message: `Meta açıklama biraz kısa (${length}/160)`,
            score: 70,
            details: { length, ideal: '150-160' }
        };
    }

    if (length > 160 && length <= 180) {
        return {
            status: 'warning',
            message: `Meta açıklama biraz uzun (${length}/160)`,
            score: 70,
            details: { length, ideal: '150-160' }
        };
    }

    return {
        status: 'error',
        message: length < 120 ? `Meta çok kısa (${length}/160)` : `Meta çok uzun (${length}/160)`,
        score: 30,
        details: { length, ideal: '150-160' }
    };
}

/**
 * İçerik Uzunluğu Kontrolü (Min. 400 kelime)
 */
export function checkContentLength(content: string): SEOCheckResult {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText.split(' ').filter(w => w.length > 0).length;

    if (wordCount === 0) {
        return {
            status: 'error',
            message: 'İçerik boş!',
            score: 0,
            details: { wordCount: 0, minimum: 400 }
        };
    }

    if (wordCount >= 400) {
        return {
            status: 'good',
            message: `İçerik uzunluğu yeterli (${wordCount} kelime)`,
            score: 100,
            details: { wordCount, minimum: 400 }
        };
    }

    if (wordCount >= 300) {
        return {
            status: 'warning',
            message: `İçerik biraz kısa (${wordCount}/400 kelime)`,
            score: 60,
            details: { wordCount, minimum: 400 }
        };
    }

    return {
        status: 'error',
        message: `İçerik çok kısa (${wordCount}/400 kelime)`,
        score: 20,
        details: { wordCount, minimum: 400 }
    };
}

/**
 * Anahtar Kelime Yoğunluğu (%1-3 ideal)
 */
export function checkKeywordDensity(content: string, focusKeyword?: string): SEOCheckResult {
    if (!focusKeyword || focusKeyword.trim() === '') {
        return {
            status: 'warning',
            message: 'Odak anahtar kelime belirtilmedi',
            score: 50,
            details: { density: 0, ideal: '1-3%' }
        };
    }

    const plainText = content.replace(/<[^>]*>/g, ' ').toLowerCase();
    const keyword = focusKeyword.toLowerCase();
    const wordCount = plainText.split(/\s+/).filter(w => w.length > 0).length;

    if (wordCount === 0) {
        return {
            status: 'error',
            message: 'İçerik boş',
            score: 0,
            details: { density: 0, ideal: '1-3%' }
        };
    }

    // Anahtar kelime geçme sayısı
    const regex = new RegExp(keyword, 'gi');
    const matches = plainText.match(regex);
    const occurrences = matches ? matches.length : 0;
    const density = (occurrences / wordCount) * 100;

    if (density >= 0.5 && density <= 2.5) {
        return {
            status: 'good',
            message: `Kelime yoğunluğu ideal (%${density.toFixed(1)})`,
            score: 100,
            details: { density: density.toFixed(1), occurrences, ideal: '0.5-2.5%' }
        };
    }

    if (density > 0 && density < 0.5) {
        return {
            status: 'warning',
            message: `Kelime yoğunluğu biraz düşük (%${density.toFixed(1)}) - İdeal: %0.5`,
            score: 80, // Puanı biraz artırdım, çok büyük bir sorun değil
            details: { density: density.toFixed(1), occurrences, ideal: '0.5-2.5%' }
        };
    }

    if (density > 2.5 && density <= 4) {
        return {
            status: 'warning',
            message: `Kelime yoğunluğu yüksek (%${density.toFixed(1)})`,
            score: 60,
            details: { density: density.toFixed(1), occurrences, ideal: '0.5-2.5%' }
        };
    }

    if (density === 0) {
        return {
            status: 'error',
            message: 'Odak kelime içerikte hiç kullanılmamış!',
            score: 0,
            details: { density: 0, occurrences: 0, ideal: '1-3%' }
        };
    }

    return {
        status: 'error',
        message: `Kelime yoğunluğu çok yüksek (%${density.toFixed(1)})`,
        score: 20,
        details: { density: density.toFixed(1), occurrences, ideal: '1-3%' }
    };
}

/**
 * Başlık Yapısı Kontrolü (H2, H3 varlığı)
 */
export function checkHeadings(content: string): SEOCheckResult {
    const h2Count = (content.match(/<h2/gi) || []).length;
    const h3Count = (content.match(/<h3/gi) || []).length;

    if (h2Count === 0) {
        return {
            status: 'error',
            message: 'H2 başlık bulunamadı!',
            score: 30,
            details: { h2: h2Count, h3: h3Count }
        };
    }

    if (h2Count >= 2 && h3Count >= 1) {
        return {
            status: 'good',
            message: `Başlık yapısı mükemmel (H2: ${h2Count}, H3: ${h3Count})`,
            score: 100,
            details: { h2: h2Count, h3: h3Count }
        };
    }

    if (h2Count >= 1) {
        return {
            status: 'warning',
            message: `Başlık yapısı iyi (H2: ${h2Count}, H3: ${h3Count})`,
            score: 70,
            details: { h2: h2Count, h3: h3Count }
        };
    }

    return {
        status: 'warning',
        message: 'Daha fazla alt başlık ekleyin',
        score: 50,
        details: { h2: h2Count, h3: h3Count }
    };
}

/**
 * Okunabilirlik Skoru (Basitleştirilmiş Flesch Reading Ease)
 */
export function checkReadability(content: string): SEOCheckResult {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = plainText.split(/\s+/).filter(w => w.length > 0);

    if (sentences.length === 0 || words.length === 0) {
        return {
            status: 'error',
            message: 'İçerik analiz edilemedi',
            score: 0,
            details: { level: 'unknown' }
        };
    }

    const avgWordsPerSentence = words.length / sentences.length;

    // Basitleştirilmiş skorlama
    let level = '';
    let status: 'good' | 'warning' | 'error' = 'good';
    let score = 100;

    if (avgWordsPerSentence <= 15) {
        level = 'Çok Kolay';
        status = 'good';
        score = 100;
    } else if (avgWordsPerSentence <= 20) {
        level = 'Kolay';
        status = 'good';
        score = 90;
    } else if (avgWordsPerSentence <= 25) {
        level = 'Orta';
        status = 'warning';
        score = 70;
    } else {
        level = 'Zor';
        status = 'warning';
        score = 50;
    }

    return {
        status,
        message: `Okunabilirlik: ${level} (ort. ${Math.round(avgWordsPerSentence)} kelime/cümle)`,
        score,
        details: { level, avgWordsPerSentence: Math.round(avgWordsPerSentence) }
    };
}

/**
 * Görsel Alt Text Kontrolü
 */
export function checkImageAltText(imageUrl?: string | null, altText?: string): SEOCheckResult {
    // Görsel yoksa kontrol etme
    if (!imageUrl) {
        return {
            status: 'good',
            message: 'Görsel yok (kontrol edilmedi)',
            score: 100, // Görsel yoksa skor düşürme
            details: { hasImage: false }
        };
    }

    // Görsel var, alt text var mı?
    if (!altText || altText.trim() === '') {
        return {
            status: 'error',
            message: 'Görsel alt text eksik!',
            score: 0,
            details: { hasImage: true, hasAltText: false }
        };
    }

    const length = altText.length;

    if (length >= 10 && length <= 125) {
        return {
            status: 'good',
            message: `Alt text mükemmel (${length} karakter)`,
            score: 100,
            details: { hasImage: true, hasAltText: true, length }
        };
    }

    if (length < 10) {
        return {
            status: 'warning',
            message: `Alt text çok kısa (${length} karakter)`,
            score: 60,
            details: { hasImage: true, hasAltText: true, length }
        };
    }

    return {
        status: 'warning',
        message: `Alt text biraz uzun (${length} karakter)`,
        score: 80,
        details: { hasImage: true, hasAltText: true, length }
    };
}

/**
 * Öneriler Oluştur
 */
function generateRecommendations(results: SEOAnalysisResult): string[] {
    const recommendations: string[] = [];

    if (results.title.status !== 'good') {
        recommendations.push(results.title.message);
    }

    if (results.metaDescription.status !== 'good') {
        recommendations.push(results.metaDescription.message);
    }

    if (results.contentLength.status !== 'good') {
        const needed = 400 - (results.contentLength.details?.wordCount || 0);
        if (needed > 0) {
            recommendations.push(`En az ${needed} kelime daha ekleyin`);
        }
    }

    if (results.keywordDensity.status !== 'good' && results.keywordDensity.details?.occurrences !== undefined) {
        recommendations.push('Odak anahtar kelimeyi doğal bir şekilde kullanın');
    }

    if (results.headings.status !== 'good') {
        recommendations.push('Daha fazla H2 ve H3 başlık ekleyin');
    }

    if (results.readability.status === 'warning') {
        recommendations.push('Cümleleri kısaltarak okunabilirliği artırın');
    }

    if (results.imageAltText.status === 'error') {
        recommendations.push('Görsel için alt text ekleyin');
    }

    if (recommendations.length === 0) {
        recommendations.push('SEO optimizasyonu mükemmel! 🎉');
    }

    return recommendations;
}
