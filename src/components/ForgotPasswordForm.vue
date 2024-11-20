<template>
    <div class="forgotPassword-container">
        <form class="forgotPassword-form" >
            <h2 class="title">
                <img alt="" src="@/assets/img/question-solid.svg" width="20" height="20"/>
                忘記密碼
            </h2>
            <p class="subtitle">請輸入註冊時使用的信箱</p>
            <div>
                <img alt="" src="@/assets/img/envelope-solid.svg" width="20" height="20"/>
                <input type="email" placeholder="信箱" v-model="email" required class="input-field"/>
            </div>
            <div v-if="showVerifySection">
                <img alt="" src="@/assets/img/key-solid.svg" width="20" height="20"/>
                <input type="password" autocomplete="current-password" placeholder="新密碼" v-model="password" required class="input-field"/>
            </div>
            <div v-if="showVerifySection">
                <img alt="" src="@/assets/img/certificate-solid.svg" width="20" height="20"/>
                <input type="text" placeholder="驗證碼" v-model="verifyCode" required class="input-field"/>
            </div>
            <button v-if="showVerifySection" class="register-button" @click.prevent="resetPassword">重置密碼</button>
            <button v-if="showVerifySection==false" name="register-button" type="submit" class="register-button" @click.prevent="forgotPassword">送出</button>
            <!-- <transition name ="fade">
                <div v-if="message" :style="{color:'red'}">{{ message }}</div>
            </transition> -->
            <transition name ="fade">
                <div v-if="verifyMessage" :style="{color:'red'}">{{ verifyMessage }}</div>
            </transition>
            <p class="footer-text">
                <img alt="" src="@/assets/img/circle-info-solid.svg" width="20"
                height="20">
                <router-link to="/"> 回到登入頁面</router-link>
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
            <div v-if="showResetSuccessModal" class="modal">
                <div class="modal-content">
                    <div class="success-icon">✔</div>
                    <!-- <p>註冊成功！</p> -->
                    <div v-if="message" :style="{color:'red'}">{{ message }}</div>
                    <button class="close-button" @click="closeSuccessModalToLogin">關閉</button>
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
            verifyCode:'',
            password: '',
            message: '',
            verifyMessage:'',
            isLoading: false, // 控制 modal 顯示
            showSuccessModal: false, // 控制註冊成功 modal
            showResetSuccessModal:false,
            showErrorModal: false, // 控制註冊失敗 modal
            showVerifySection:false //顯示驗證碼輸入欄
        };
    },
    methods: {
        forgotPassword(){
            this.isLoading = true;
            defAxios.get('/forgotPassword',{
                params: {
                    email: this.email
                }
            }).then((res) => {
                this.isLoading = false;
                this.message = res.data.message;
                this.showSuccessModal = true;
                this.showVerifySection = true;
            }).catch((err) => {
                this.isLoading = false;
                this.message = err.response.data.message;
                this.showErrorModal = true;
            });
        },
        async resetPassword(){
            let regex = /^[A-Za-z\d]{8,200}$/;
            if(!regex.test(this.password)){
                this.verifyMessage = '使用者密碼最少必須為 8 個字';
                return;
            }
            this.isLoading = true;
            await defAxios.post('/resetPassword',{
                //request body
                email: this.email,
                verifyCode: this.verifyCode,
                newPassword: this.password
            },{
                //request params
            }).then((res) => {
                this.isLoading = false;
                this.message = res.data.message;
                this.showResetSuccessModal = true;
            }).catch((err) => {
                this.isLoading = false;
                this.message = err.response.data.message;
                this.showErrorModal = true;
            });
        },
        closeSuccessModal() {
            this.showSuccessModal = false;
        },
        closeSuccessModalToLogin(){
            this.showSuccessModal = false;
            this.$router.push('/');
        },
        closeErrorModal() {
            this.showErrorModal = false;
        },
    }
};
</script>
  