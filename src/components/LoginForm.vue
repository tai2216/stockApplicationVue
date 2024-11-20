<template>
    <div class="login-container">
        <form @submit.prevent="handleSubmit" class="login-form">
            <h2><img alt="" src="@/assets/img/landmark-solid.svg" width="30" height="30"/> 歡迎來到Stock Panda！</h2>
            <p>開啟您的投資旅程</p>
            <div>
                <img alt="" src="@/assets/img/user-solid.svg" width="20" height="20"/>
                <input type="text" autocomplete="username" placeholder="帳號" v-model="username" required class="input-field">
            </div>
            <div>
                <img alt="" src="@/assets/img/key-solid.svg" width="20" height="20"/>
                <input type="password" autocomplete="current-password" placeholder="密碼" v-model="password" required class="input-field"/>
            </div>
            <button @click="login" class="login-button">登入</button>
            <router-link to="/forgotPassword">忘記密碼?</router-link>
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
                <div id="googleButton" @click.prevent="googleLoginModal"></div>
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
        googleLoginModal(){
            window.google.accounts.id.prompt();
        },
        initializeGoogleSettings(){
            // window.onload = () => {
                window.google.accounts.id.initialize({
                    client_id: '226163930899-b80tlo68hu6bluhoochdipg2eb8du7cj.apps.googleusercontent.com', // required
                    callback: this.onLogin, // invoke while user login in the popup
                    cancel_on_tap_outside: true, // optional
                    context: "signin", // optional
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleButton"),{ theme: "outline", size: "large" } // customization attributes
                );
                // window.google.accounts.id.prompt(); // show one-tap popup
            // };
        },
        onLogin(res){
            // 顯示 loading modal
            this.isLoading = true;
            defAxios.post('/googleLogin', {
                clientId:res.clientId,
                client_id:res.client_id,
                credential:res.credential,
                select_by:res.select_by
            },{
                headers: {
                    'Accept': 'application/json'
                },
            }).then((response) => {
                console.log('google 登入成功: '+JSON.stringify(response.data));
                if(response.status==200){
                    localStorage.clear();
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('googlePictureUrl',response.data.googlePictureUrl);
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
        try{
            this.initializeGoogleSettings();
        }catch(error){
            console.log(error);
        }
    },
    mounted(){
        try{
            this.initializeGoogleSettings();
        }catch(error){
            console.log(error);
        }
    }
};
</script>

