import type { Product } from '@/interfaces/product';

export interface Recipe {
    name: string;
    description: string | null;
    duration: string | undefined;
    products: Product[];
}