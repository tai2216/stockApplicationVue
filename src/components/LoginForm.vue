<template>
    <div class="login-container">
        <h2>歡迎來到虛擬股票平台！</h2>
        <p>開啟您的投資旅程</p>
        <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="用戶名" v-model="username" required />
            <input type="password" placeholder="密碼" v-model="password" required />
            <button type="submit">登入</button>
        </form>
        <p class="footer-text">
            還沒有帳號？<router-link to="/register">立即註冊</router-link>
        </p>
        <!-- Google 登入按鈕 -->
        <div class="google-login">
            <p>或使用</p>
            <button @click="loginWithGoogle" class="google-button">
                Google 登入
            </button>
            <button @click="loginWithGoogleBackend" class="google-button">
                Google 登入(後端測試)
            </button>
        </div>
    </div>
</template>


<script>
// import axios from 'axios';
export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async handleSubmit() {
            // 在此處處理登入邏輯（例如 API 認證請求）
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: this.username, password: this.password }),
                });

                if (response.ok) {
                    // 登入成功，處理成功邏輯
                    console.log('登入成功！');
                } else {
                    // 處理錯誤邏輯
                    console.error('登入失敗！');
                }
            } catch (error) {
                console.error('網絡錯誤：', error);
            }
        },
        loginWithGoogleBackend(){
            const loginWindow = window.open('http://localhost:8081/oauth2/authorization/google', 'google-login', 'location=center,width=500,height=600');
            loginWindow.addEventListener('message', (event) => {
                if (event.origin !== 'http://localhost:8081') {
                    console.log('不信任的來源: ',event.origin);
                    return;
                }
                const userInfo = event.data;
                console.log('使用者資訊: '+userInfo);
                this.router.push('/dashboard'); 
            },{once: true});
            // axios.get('http://localhost:8081/oauth2/authorization/google', {
            // })
            // .then(response => console.log(response.json()))
            // .error(error => console.error('Error', error));
        },
        async loginWithGoogle() {
            try {
                const googleUser = await this.$gAuth.signIn();
                const profile = googleUser.getBasicProfile();
                console.log('ID: ' + profile.getId());
                console.log('Full Name: ' + profile.getName());
                console.log('Given Name: ' + profile.getGivenName());
                console.log('Family Name: ' + profile.getFamilyName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
            } catch (error) {
                console.error('Google 登入失敗：', error);
            }
        },
        async login() {
            // 處理登入邏輯
            // 假設登入成功
            this.$router.push('/dashboard'); // 導航到 Dashboard 頁面
        },
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    /* 漸變色 */
}

.title {
    font-size: 2.5rem;
    /* 大字體 */
    font-weight: bold;
    /* 粗體 */
    color: #ffffff;
    /* 白色 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    /* 文字陰影 */
}

.subtitle {
    font-size: 1.5rem;
    /* 中字體 */
    color: #ffffff;
    /* 白色 */
    margin-bottom: 20px;
    /* 底部間距 */
}

form {
    display: flex;
    flex-direction: column;
    width: 300px;
}

input {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

.footer-text {
    margin-top: 20px;
    color: #555;
}

.google-login {
    margin-top: 20px;
    text-align: center;
}

.google-button {
    padding: 10px;
    background-color: #4285F4;
    /* Google 的藍色 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.google-button:hover {
    background-color: #357ae8;
    /* 深一點的藍色 */
}
</style>
