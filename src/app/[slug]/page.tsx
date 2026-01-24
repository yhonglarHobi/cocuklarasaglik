
import React from 'react';
import { notFound } from 'next/navigation';
import { categoriesDB, corporateContent } from '@/lib/content-data';
import CategoryView from '@/components/views/CategoryView';
import CorporateView from '@/components/views/CorporateView';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (categoriesDB[slug]) {
        return <CategoryView slug={slug} />;
    }

    if (corporateContent[slug]) {
        return <CorporateView slug={slug} />;
    }

    return notFound();
}
