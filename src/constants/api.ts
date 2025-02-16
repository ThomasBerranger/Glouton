import type {Product} from '@/interfaces/product.ts'

export const SERVER_URL = 'https://glouton-fd999217b246.herokuapp.com';

export const PRODUCT_URL = `${SERVER_URL}/products` as const;
export const PRODUCT_SHOPPING_LIST_URL = `${SERVER_URL}/products/shopping-list` as const;

export const getProductUrlByType = (product: Product) => {
    return product.scanned ?
        `${SERVER_URL}/scanned-products` :
        `${SERVER_URL}/custom-products`;
}

export const RECIPE_URL = `${SERVER_URL}/recipes` as const;
