import { createRouter, createWebHistory } from 'vue-router';
import store from "@/assets/store";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Home.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/products',
            component: () => import('@/views/Products/List.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/scan',
            component: () => import('@/views/Scan.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            component: () => import('@/views/Authentication/Login.vue'),
        },
        {
            path: '/register',
            component: () => import('@/views/Authentication/Register.vue'),
        },
        {
            path: '/account',
            component: () => import('@/views/Authentication/Account.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/product/:id',
            component: () => import('@/views/Product.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/shopping-list',
            component: () => import('@/views/ShoppingList.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/:catchAll(.*)',
            component: () => import('@/views/NotFound.vue'),
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.token) {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router
