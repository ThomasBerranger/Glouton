import type {Product} from '@/interfaces/product.ts'

export const PRODUCT_URL = 'http://127.0.0.1:8000/products/' as const;
export const PRODUCT_SHOPPING_LIST_URL = 'http://127.0.0.1:8000/products/shopping-list' as const;

export const getProductUrlByType = (product: Product) => {
    return product.scanned ?
        'http://127.0.0.1:8000/scanned-products' :
        'http://127.0.0.1:8000/custom-products';
}