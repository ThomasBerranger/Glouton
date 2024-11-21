import type { ExpirationDate } from '@/interfaces/expiration-date'

export interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | undefined;
    finishedAt: string | null;
    addedToListAt: string | null;
    expirationDates: ExpirationDate[];
}