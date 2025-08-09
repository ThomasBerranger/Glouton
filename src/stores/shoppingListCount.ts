import {defineStore} from "pinia";

export const useShoppingListCounterStore = defineStore('shoppingListCount', {
    state: (): { shoppingListCount: number } => ({
        shoppingListCount: parseInt(localStorage.getItem('shoppingListCount') || '0', 10)
    }),

    actions: {
        setShoppingListCount(count: number): void {
            this.shoppingListCount = count;
            localStorage.setItem('shoppingListCount', count.toString());
        },
        addOne(): void {
            this.shoppingListCount++;
            localStorage.setItem('shoppingListCount', this.shoppingListCount.toString());
        },
        removeOne(): void {
            this.shoppingListCount--;
            localStorage.setItem('shoppingListCount', this.shoppingListCount.toString());
        },
    }
})
