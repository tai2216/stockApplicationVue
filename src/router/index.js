// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue'; // 登入頁面
import RegisterForm from '@/components/RegisterForm.vue'; // 註冊頁面
import DashBoard from '@/components/DashBoard.vue'; // 登入後頁面
import StocksList from '@/components/StocksList.vue'; // 股票頁面
import MyPortfolio from '@/components/MyPortfolio.vue'; // 我的投資組合頁面
import TradeHistory from '@/components/TradeHistory.vue'; // 交易歷史頁面
import AuthCallback from '@/components/AuthCallback.vue'; // 引入 AuthCallback 組件
const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginForm,
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterForm,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashBoard,
    },
    {
        path: '/stocks',
        name: 'stocks-List',
        component: StocksList,
    },
    {
        path: '/portfolio',
        name: 'portfolio-List',
        component: MyPortfolio,
    },
    {
        path: '/transactions',
        name: 'TradeHistory-List',
        component: TradeHistory,
    },
    {
        path: '/auth/callback',
        name: 'AuthCallback',
        component: AuthCallback
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
