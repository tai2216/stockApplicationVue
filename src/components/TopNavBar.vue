<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light ">
        <a class="navbar-brand" href="http://localhost:8080/"> <img alt="" src="@/assets/landmark-solid.svg" width="30"
                height="30"> 虛擬股票交易平台</a>
        <nav class="top-nav-bar">
            <ul class="nav-list">
                <li><router-link to="/stocks">查看股票</router-link></li>
                <li><router-link to="/portfolio">我的投資組合</router-link></li>
                <li><router-link to="/transactions">交易歷史</router-link></li>
                <li>帳戶餘額: {{ accountBalance }}</li>
            </ul>
        </nav>
        <div style="margin-left: auto; margin-right: 30px;">

            <div class="navbar" id="navbarNav">
                <!-- <img alt="尚未上傳照片" style="width: 40px; height: 40px; margin-right: 10px; font-size: xx-small;"
                    src="http://localhost:8081/iMedical/Backstage/downloadImage/${loginSession[0].id}"><img /> -->
                <ul class=navbar-nav>
                    <ins v-if="username != ''" style="vertical-align:bottom; margin-right: 20px;">您好! :
                        <b style="color: red; font: bolder;">
                            {{ username }}
                            <!-- <sec:authentication property="name" /> -->
                        </b> </ins>
                    <li class="nav-item">
                        <form>
                            <!-- <sec:csrfInput /> -->
                            <button type="submit" class="btn btn-outline-dark " @click.prevent="logout">登出</button>
                        </form>
                    </li>
                </ul>


            </div>


        </div>
    </nav>
</template>


<script>
    // import VueCookies from 'vue-cookies'
    // import router from '@/router';
    import axios from 'axios';
    import { EventBus } from '@/assets/js/event-bus';
    const defAxios = axios.create({
        baseURL: 'http://localhost:8081',
        timeout: 10000
    });
    export default {
        data() {
            return {
                userId:0,
                username: '', // 可以從登入資訊中獲取使用者名稱
                accountBalance:''
            };
        },
        methods: {
            handleStorageEvent(event) {
                if (event.key === 'logout') {
                    this.$router.push('/'); // 返回登入頁面
                }
            },
            logout() {
                // 處理登出邏輯
                localStorage.clear();
                localStorage.setItem('logout', Date.now());
                this.$router.push('/'); // 返回登入頁面
            },
            refreshAccountBalance(){
                this.userId = localStorage.getItem('userId');
                defAxios.get('/getAccountBalance',{
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'Accept': 'application/json'
                    },
                    params: {
                        userId: parseInt(this.userId)
                    }
                }).then((response)=>{
                    console.log(JSON.stringify(response.data));
                    this.accountBalance = response.data.data.balance!=null? Number(response.data.data.balance).toLocaleString():'0';
                }).catch((error)=>{
                    console.log('error:'+JSON.stringify(error.response));
                    // let err = error.response.error;
                    // this.accountBalance = error.response.message + (err!=null? err.toString():'');
                });
            }
        },
        created() {
            this.userId = localStorage.getItem('userId');
            this.username = localStorage.getItem('username');
            // 監聽 localStorage 的變化
            window.addEventListener('storage', (event) => {
                if (event.key === 'logout') {
                    this.$router.push('/'); // 返回登入頁面
                }
            });
            this.refreshAccountBalance();
            EventBus.on('refreshAccountBalance', this.refreshAccountBalance);
        },
        beforeUnmount() {
            // 移除事件監聽器
            window.removeEventListener('storage', this.handleStorageEvent);
            EventBus.off('refreshAccountBalance', this.refreshAccountBalance);
        }
    }

</script>
<style scoped>
.top-nav-bar {
    background-color:auto;
    padding: 10px;
}

.nav-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex; /* 使用 flexbox 來橫向排列 */
}

.nav-list li {
    margin-right: 20px; /* 設置每個項目之間的間距 */
}

.nav-list li a {
    color: rgb(5, 5, 5);
    text-decoration: none;
}

.nav-list li a:hover {
    text-decoration: underline;
}
</style>