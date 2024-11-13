<template>
    <div class="login-container">
        <h2>歡迎來到虛擬股票平台！</h2>
        <p>開啟您的投資旅程</p>
        <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="用戶名" v-model="username" required />
            <input type="password" placeholder="密碼" v-model="password" required />
            <button @click="login">登入</button>
            <div v-if="message" :style="{color:'red'}">{{ message }}</div>
        </form>
        <p class="footer-text">
            還沒有帳號？<router-link to="/register">立即註冊</router-link>
        </p>
        <!-- Modal 視窗 -->
        <div v-if="isLoading" class="modal">
            <div class="modal-content">
                <div class="spinner"></div>
                <p>正在處理，請稍候...</p>
            </div>
        </div>
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
import axios from 'axios';
const defAxios = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});
export default {
    data() {
        return {
            username: '',
            password: '',
            message:'',
            isLoading: false, // 控制 modal 顯示
        };
    },
    methods: {
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
            // 處理登入邏輯
            await defAxios.post('/login', {
                username: this.username,
                password: this.password
            }).then((response) => {
                console.log('登入成功，回應訊息: '+JSON.stringify(response.data));
                if(response.status==200){
                    localStorage.clear();
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('role', response.data.role);
                }
                this.isLoading = false;
                // 假設登入成功
                this.$router.push('/dashboard'); // 導航到 Dashboard 頁面
            }).catch((error) => {
                if(error!='AxiosError: Network Error'){
                    console.error('登入失敗: '+JSON.stringify(error));
                    this.isLoading = false;
                    this.message='登入失敗，請重新檢查帳號密碼是否正確';
                }else{
                    this.isLoading = false;
                    this.message ='目前伺服器無回應，請稍後在試';
                }
            });
            
        },
    },
    created() {
        if(localStorage.getItem('username')!='' && localStorage.getItem('token')!='' ){
            this.$router.push('/dashboard');
        }
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
