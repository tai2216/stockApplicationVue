<template>
    <div class="register-container">
        <h2 class="title">創建新帳號</h2>
        <p class="subtitle">開始您的投資之旅</p>
        <form @submit.prevent="handleRegister">
            <input type="text" placeholder="用戶名" v-model="username" required />
            <input type="email" placeholder="電子郵件" v-model="email" required />
            <input type="password" placeholder="密碼" v-model="password" required />
            <button type="submit">註冊</button>
            <div v-if="message">{{ message }}</div>
        </form>
        <p class="footer-text">
            已經有帳號了？<router-link to="/">立即登入</router-link>
        </p>
        <button @click="loginWithGoogle">使用 Google 登入</button>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            message: '',
        };
    },
    methods: {
        async handleRegister() {
            // 註冊邏輯
            console.log("註冊按鈕被點擊", {
                username: this.username,
                email: this.email,
                password: this.password,
            });
            // 在這裡添加實際的註冊邏輯，例如調用 API
            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: this.email, password: this.password }),
                });

                if (response.ok) {
                    this.message = '註冊成功，請檢查您的電子郵件以驗證帳戶！';
                } else {
                    const errorData = await response.json();
                    this.message = errorData.message || '註冊失敗，請再試一次。';
                }
            } catch (error) {
                this.message = '無法聯繫伺服器，請稍後再試。';
            }
        },
        loginWithGoogle() {
            this.$gAuth.signIn().then(googleUser => {
                const profile = googleUser.getBasicProfile();
                console.log('ID: ' + profile.getId());
                console.log('Full Name: ' + profile.getName());
                console.log('Given Name: ' + profile.getGivenName());
                console.log('Family Name: ' + profile.getFamilyName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());

                const authResponse = googleUser.getAuthResponse();
                console.log('Access Token: ' + authResponse.access_token);
                console.log('ID Token: ' + authResponse.id_token);
                this.username = profile.getName();
                // 這裡可以處理登入後的邏輯，例如將使用者資訊存儲在 Vuex 或本地存儲中
            }).catch(error => {
                console.error(error);
            });
        }
    },
};
</script>
  
<style scoped>
.register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    /* 漸變背景 */
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
    color: #ffffff;
    /* 白色 */
}
</style>
  