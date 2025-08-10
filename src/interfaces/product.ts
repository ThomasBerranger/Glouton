import type { ExpirationDate } from '@/interfaces/expiration-date.ts';
import type { Recipe } from '@/interfaces/recipe.ts';
import type { Category } from "@/interfaces/category.ts";

export type Nutriscore = 'A' | 'B' | 'C' | 'D' | 'E';
export type Ecoscore = 'A' | 'B' | 'C' | 'D' | 'E';
export type NovaGroup = 1 | 2 | 3 | 4;

export interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | undefined;
    finishedAt: string | null;
    addedToListAt: string | null;
    barcode: string | undefined;
    nutriscore: Nutriscore | null;
    novagroup: NovaGroup | null;
    ecoscore: Ecoscore | null;
    expirationDates: ExpirationDate[];
    scanned: boolean;
    recipes: Recipe[];
    closestExpirationDate: string | null;
    category: number | Category;
}

export function isValidNutriscore(value: string): value is Nutriscore {
    return ['a', 'b', 'c', 'd', 'e'].includes(value);
}

export function isValidNovaGroup(value: number): value is NovaGroup {
    return [1, 2, 3, 4].includes(value);
}

export function isValidEcoscore(value: string): value is Ecoscore {
    return ['a', 'b', 'c', 'd', 'e', 'f'].includes(value);
}