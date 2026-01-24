import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Article {
    id: string;
    title: string;
    summary: string;
    category: "growth" | "nutrition" | "health" | "urgent";
    readTime: string;
    ageGroup: string;
    isDoctorApproved: boolean;
    image?: string;
}

export function ArticleCard({ article }: { article: Article }) {
    // HealthyChildren uses a cleaner, more magazine-like card style.
    return (
        <Link href={`/article/${article.id}`} className="block h-full">
            <div className="group bg-white flex flex-col h-full border-b border-gray-200 pb-4 mb-4 md:mb-0 hover:bg-gray-50 transition-colors p-2 rounded-sm cursor-pointer">

                {/* Category Tag */}
                <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-xs font-bold uppercase tracking-wider text-hc-blue")}>
                        {article.ageGroup}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-serif text-[#333333] mb-2 leading-tight group-hover:text-hc-orange transition-colors">
                    {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-1 font-sans">
                    {article.summary}
                </p>

                {/* Footer Meta */}
                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase">
                        {article.isDoctorApproved && (
                            <div className="flex items-center gap-1 text-hc-green" title="Doktor Onaylı İçerik">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Doctor Approved</span>
                            </div>
                        )}
                    </div>

                    <div className="text-hc-orange group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
