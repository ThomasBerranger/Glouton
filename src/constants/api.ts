import type {Product} from '@/interfaces/product.ts'

export const PRODUCT_URL = 'https://glouton-fd999217b246.herokuapp.com/products/' as const;
export const PRODUCT_SHOPPING_LIST_URL = 'https://glouton-fd999217b246.herokuapp.com/products/shopping-list' as const;

export const getProductUrlByType = (product: Product) => {
    return product.scanned ?
        'https://glouton-fd999217b246.herokuapp.com/scanned-products/' :
        'https://glouton-fd999217b246.herokuapp.com/custom-products/';
}