import {defineStore} from "pinia";

export const useTokenStore = defineStore('token', {
    state: (): { token: string } => ({
        token: localStorage.getItem('token') || ''
    }),

    actions: {
        setToken(newToken: string): void {
            this.token = newToken;
            localStorage.setItem('token', newToken);
        },
    }
})
