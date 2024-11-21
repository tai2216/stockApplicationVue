// // src/main.js
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router'; // 引入 router
// import googleAuth from './googleAuth.js';

// createApp(App)
//     .use(router) // 使用 router
//     .use(googleAuth)
//     .mount('#app');
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import googleAuth from './googleAuth.js';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret)
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (localStorage.getItem('username') != null && localStorage.getItem('token') != null) {
            // console.log('已登入')
            next();
        } else {
            // console.log('未登入');
            next({
                path: '/'
            });
            // console.log('將導入至首頁登入');
        }
    } else {
        next();
    }
})
const app = createApp(App);
//後端的url全域變數
app.config.globalProperties.$backendUrlPrefix = 'http://localhost:8081';
app.config.globalProperties.$frontendUrlPrefix = 'https://b60c-59-124-224-145.ngrok-free.app';
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
// googleAuth(app); // 使用 googleAuth 插件
app.mount('#app');