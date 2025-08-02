import {defineStore} from "pinia";

export const useShoppingListCounterStore = defineStore('shoppingListCount', {
    state: (): { shoppingListCount: number } => ({
        shoppingListCount: localStorage.getItem('shoppingListCount') || 0
    }),

    actions: {
        setShoppingListCount(count: number): void {
            localStorage.setItem('shoppingListCount', count);
        },
        addOne(): void {
            localStorage.setItem('shoppingListCount', this.shoppingListCount++);
        },
        removeOne(): void {
            localStorage.setItem('shoppingListCount', this.shoppingListCount--);
        },
    }
})
