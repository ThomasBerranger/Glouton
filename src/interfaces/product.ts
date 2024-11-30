import type { ExpirationDate } from '@/interfaces/expiration-date'

export interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | undefined;
    finishedAt: string | null;
    addedToListAt: string | null;
    nutriscore: string | undefined;
    novagroup: number | undefined;
    ecoscore: string | undefined;
    expirationDates: ExpirationDate[];
    closestExpirationDate : Date | null;
}