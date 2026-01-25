import { getAdSenseConfig } from "@/components/ads/actions";
import { CategoryAccordionClient } from "./CategoryAccordionClient";

interface Category {
    name: string;
    slug: string;
}

interface CategoryAccordionProps {
    categories: Category[];
}

export async function CategoryAccordion({ categories }: CategoryAccordionProps) {
    const adsConfig = await getAdSenseConfig();

    return (
        <CategoryAccordionClient
            categories={categories}
            adsConfig={adsConfig}
        />
    );
}
