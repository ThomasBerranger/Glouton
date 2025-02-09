import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useTokenStore } from "@/stores/token"

const routes: RouteRecordRaw[] = [
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
        // meta: { requiresAuth: true }
    },
    {
        path: '/scan-2',
        component: () => import('@/views/Scan2.vue'),
        // meta: { requiresAuth: true }
    },
    {
        path: '/product/:id',
        name: 'product.details',
        component: () => import('@/views/Products/Details.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/shopping-list',
        component: () => import('@/views/Products/ShoppingList.vue'),
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
        path: '/:catchAll(.*)',
        component: () => import('@/views/NotFound.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const tokenStore = useTokenStore()

    if (to.matched.some(record => (record.meta).requiresAuth)) {
        if (tokenStore.token) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router