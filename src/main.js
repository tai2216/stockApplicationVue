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
import googleAuth from './googleAuth.js';

const app = createApp(App);

app.use(router);
googleAuth(app); // 使用 googleAuth 插件
app.mount('#app');