<template>
    <div class="register-container">
        <h2 class="title">創建新帳號</h2>
        <p class="subtitle">開始您的投資之旅</p>
        <form class="loginForm" @submit.prevent="handleRegister">
            <input type="text" placeholder="用戶名" v-model="username" required />
            <input type="password" placeholder="密碼" v-model="password" required />
            <input type="email" placeholder="電子郵件" v-model="email" required />
            <button name="registerButton" type="submit">註冊</button>
            <div v-if="message" :style="{color:'red'}">{{ message }}</div>
        </form>
        <p class="footer-text">
            已經有帳號了？<router-link to="/">立即登入</router-link>
        </p>
        <button @click="loginWithGoogle">使用 Google 登入</button>
        <!-- Modal 視窗 -->
        <div v-if="isLoading" class="modal">
            <div class="modal-content">
                <div class="spinner"></div>
                <p>正在處理，請稍候...</p>
            </div>
        </div>
        <!-- 註冊成功 Modal 視窗 -->
        <div v-if="showSuccessModal" class="modal">
            <div class="modal-content">
                <div class="success-icon">✔</div>
                <!-- <p>註冊成功！</p> -->
                <div v-if="message" :style="{color:'red'}">{{ message }}</div>
                <button @click="closeSuccessModal">關閉</button>
            </div>
        </div>
        <!-- 註冊失敗 Modal 視窗 -->
        <div v-if="showErrorModal" class="modal">
            <div class="modal-content">
                <div class="error-icon">✖</div>
                <!-- <p>註冊失敗，請稍後再試。</p> -->
                <div v-if="message" :style="{color:'red'}">{{ message }}</div>
                <button @click="closeErrorModal">關閉</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
const defAxios = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Authorization': localStorage.getItem('token'),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            message: '',
            isLoading: false, // 控制 modal 顯示
            showSuccessModal: false, // 控制註冊成功 modal
            showErrorModal: false // 控制註冊失敗 modal
        };
    },
    methods: {
        async handleRegister() {
            let regex = /^[A-Za-z\d]{8,30}$/;
            if (!regex.test(this.username)) {
                this.message = '使用者帳號必須為 8~30 個字';
                return;
            }
            regex = /^[A-Za-z\d]{8,200}$/;
            if(!regex.test(this.password)){
                this.message = '使用者密碼最少必須為 8 個字';
                return;
            }
            // 顯示 loading modal
            this.isLoading = true;
            // 在這裡添加實際的註冊邏輯，例如調用 API
            await defAxios.post('/register', {
                username: this.username,
                email: this.email,
                password: this.password
            }).then((response) => {
                if(response!='AxiosError: Network Error'){
                    // console.log('註冊成功，回應訊息: '+response.data.message);
                    this.message = response.data.message;
                }else{
                    this.message ='目前伺服器無回應，請稍後在試';
                }
                this.isLoading = false;
                this.showSuccessModal = true;
            }).catch((error) => {
                console.log('error: '+error);
                if(error!='AxiosError: Network Error'){
                    console.error('註冊失敗: '+JSON.stringify(error.response));
                    this.message=JSON.stringify(error.response.data.message);
                }else{
                    this.message ='目前伺服器無回應，請稍後在試';
                }
                this.isLoading = false;
                this.showErrorModal = true;
            });
        },
        closeSuccessModal() {
            this.showSuccessModal = false;
            this.$router.push('/');
        },
        closeErrorModal() {
            this.showErrorModal = false;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.success-icon {
  color: green;
  font-size: 40px;
  margin-bottom: 10px;
}

.error-icon {
  color: red;
  font-size: 40px;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  