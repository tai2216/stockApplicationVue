<template>
    <div class="register-container">
        <form class="login-form" @submit.prevent="handleRegister" >
            <h2 class="title">創建新帳號</h2>
            <p class="subtitle">開始您的投資之旅</p>
            <div>
                <img alt="" src="@/assets/img/user-solid.svg" width="20" height="20"/>
                <input type="text" placeholder="用戶名" v-model="username" required class="input-field">
            </div>
            <div>
                <img alt="" src="@/assets/img/key-solid.svg" width="20" height="20"/>
                <input type="password" placeholder="密碼" v-model="password" required class="input-field"/>
            </div>
            <div>
                <img alt="" src="@/assets/img/envelope-solid.svg" width="20" height="20"/>
                <input type="email" placeholder="電子郵件" v-model="email" required class="input-field"/>
            </div>
            <button name="register-button" type="submit" class="register-button">註冊</button>
            <transition name ="fade">
                <div v-if="message" :style="{color:'red'}">{{ message }}</div>
            </transition>
            <p class="footer-text">
                <img alt="" src="@/assets/img/circle-info-solid.svg" width="20"
                height="20">
                已經有帳號了？<router-link to="/">立即登入</router-link>
            </p>
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
        <transition>
            <!-- 註冊成功 Modal 視窗 -->
            <div v-if="showSuccessModal" class="modal">
                <div class="modal-content">
                    <div class="success-icon">✔</div>
                    <!-- <p>註冊成功！</p> -->
                    <div v-if="message" :style="{color:'red'}">{{ message }}</div>
                    <button class="close-button" @click="closeSuccessModal">關閉</button>
                </div>
            </div>
        </transition>
        <transition>
            <!-- 註冊失敗 Modal 視窗 -->
            <div v-if="showErrorModal" class="modal">
                <div class="modal-content">
                    <div class="error-icon">✖</div>
                    <!-- <p>註冊失敗，請稍後再試。</p> -->
                    <div v-if="message" :style="{color:'red'}">{{ message }}</div>
                    <button class="close-button" @click="closeErrorModal">關閉</button>
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
    },
};
</script>
  