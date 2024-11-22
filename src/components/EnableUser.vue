<template>
    <div class="login-container">
        <transition name ="fade">
            <div v-if="message" class="modal">
                <div class="modal-content">
                    <div :style="{color:'red'}">{{ message }}
                        <a href="/login">馬上登入</a>
                    </div>
                </div>
            </div>
        </transition>
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
//   baseURL: 'http://localhost:8081',
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Accept': 'application/json'
  },
});

export default {
    props:['username','remark'],
    data() {
        return {
            message:'',
            isLoading: false, // 控制 modal 顯示
        };
    },
    methods: {
        async enableUser(p1,p2){
            console.log('p1&p2: '+p1+' '+p2);
            // let queryString = window.location.search;
            // console.log('qS: '+queryString);
            // // Parse the query string
            // let urlParams = new URLSearchParams(queryString);
            // console.log('username:'+ urlParams.get('username'));
            // console.log('remark:'+urlParams.get('remark'));
            await defAxios.get('/enableUser/',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params:{
                    username:p1,
                    remark:p2
                }
            }) // 替換為實際的 API URL
            .then(response => {
                console.log(JSON.stringify(response.data));
                this.message = response.data.message;
                this.isLoading=false;
            })
            .catch(error => {
                // console.error('Error:', JSON.stringify(error.response));
                // this.message='啟用失敗';
                let mes = error.response.data.message;
                this.message = (mes==null | mes=='')?error.response.status+error.response.statusText:mes;
                this.isLoading=false;
            });
        }
    },
    created() {
        // console.log('mounted params:'+JSON.stringify(this.$route.params));
        // console.log('uName: '+this.$route.params.username);
        // console.log('uRemark: '+this.$route.params.remark);
        this.isLoading=true;
        this.enableUser(this.$route.params.username,this.$route.params.remark);
    },
    mounted(){
    }
};
</script>