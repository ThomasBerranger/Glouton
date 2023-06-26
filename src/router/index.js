import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import firebase from 'firebase/compat/app';
import 'firebase/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
            meta: {requiresAuth: true}
        },
        {
            path: "/login",
            component: () => import("../views/Authentication/Login.vue"),
        },
        {
            path: "/register",
            component: () => import("../views/Authentication/Register.vue"),
        },
        {
            path: "/account",
            component: () => import("../views/Authentication/Account.vue"),
            meta: {requiresAuth: true}
        },
    ]
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const currentUser = firebase.auth().currentUser;

    if (requiresAuth && !currentUser) {
        next('/login');
    } else {
        next();
    }
});

export default router
