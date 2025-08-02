import {defineStore} from "pinia";
import {PRODUCT_ORDER} from "@/constants/productOrder.ts";

export const useProductOrderStore = defineStore('productOrder', {
    state: (): { productOrderKey: string } => ({
        productOrderKey: localStorage.getItem('productOrderKey') || Object.keys(PRODUCT_ORDER)[0]
    }),

    actions: {
        setProductOrder(key: string): void {
            this.productOrderKey = key;
            localStorage.setItem('productOrderKey', key);
        },
    }
})
