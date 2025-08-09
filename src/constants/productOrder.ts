interface ProductOrderInterface {
    order: string;
    icon: string;
    nextKey: string;
}

export const PRODUCT_ORDER: { [key: string]: ProductOrderInterface } = {
    'all': {
        order: 'all',
        icon: 'fa-solid fa-arrow-down-1-9',
        nextKey: 'all-reverse'
    },
    'all-reverse': {
        order: 'all-reverse',
        icon: 'fa-solid fa-arrow-down-9-1',
        nextKey: 'name'
    },
    'name': {
        order: 'name',
        icon: 'fa-solid fa-arrow-down-a-z',
        nextKey: 'name-reverse'
    },
    'name-reverse': {
        order: 'name-reverse',
        icon: 'fa-solid fa-arrow-down-z-a',
        nextKey: 'all'
    },
};