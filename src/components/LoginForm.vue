<template>
    <div class="login-container">
        <form @submit.prevent="handleSubmit" class="login-form">
            <h2>歡迎來到Stock Panda！</h2>
            <p>開啟您的投資旅程</p>
            <div>
                <img alt="" src="@/assets/img/user-solid.svg" width="20" height="20"/>
                <input type="text" placeholder="用戶名" v-model="username" required class="input-field">
            </div>
            <div>
                <img alt="" src="@/assets/img/key-solid.svg" width="20" height="20"/>
                <input type="password" placeholder="密碼" v-model="password" required class="input-field"/>
            </div>
            <button @click="login" class="login-button">登入</button>
            <transition name ="fade">
                <div v-if="message" :style="{color:'red'}">{{ message }}</div>
            </transition>
            <p class="footer-text">
                <img alt="" src="@/assets/img/circle-info-solid.svg" width="20"
                height="20">
                還沒有帳號？<router-link to="/register">立即註冊</router-link>
            </p>
            <!-- Google 登入按鈕 -->
            <div class="google-login">
                <p>或使用</p>
                <button @click="loginWithGoogle" class="google-button">
                    Google 登入
                </button>
                <!-- <button @click="loginWithGoogleBackend" class="google-button">
                    Google 登入(後端測試)
                </button> -->
            </div>
        </form>
        <!-- Modal 視窗 -->
         <transition name ="fade">
             <div v-if="isLoading" class="modal">
                 <div class="modal-content">
                     <div class="spinner"></div>
                     <p>正在處理，請稍候...</p>
                 </div>
             </div>
         </transition>
    </div>
</template>


<script>
import axios from 'axios';
import '@/assets/css/loginAndRegister.css';
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
                // console.log('登入成功，回應訊息: '+JSON.stringify(response.data));
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

