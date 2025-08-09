import type { ExpirationDate } from '@/interfaces/expiration-date.ts';
import type { Recipe } from '@/interfaces/recipe.ts';
import type { Category } from "@/interfaces/category.ts";

export interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | undefined;
    finishedAt: string | null;
    addedToListAt: string | null;
    barcode: string | undefined;
    nutriscore: string | undefined;
    novagroup: number | undefined;
    ecoscore: string | undefined;
    expirationDates: ExpirationDate[];
    scanned: boolean,
    recipes: Recipe[];
    closestExpirationDate : string | null;
    category: number | Category;
}