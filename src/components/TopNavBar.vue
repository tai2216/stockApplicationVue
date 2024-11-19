<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div style="margin-left: 5%;"></div>
        <a class="navbar-brand" href="http://localhost:8080/"> <img alt="" src="@/assets/img/landmark-solid.svg" width="30"
                height="30">StockPanda - 股票模擬交易平台</a>
        <nav class="top-nav-bar">
            <ul class="nav-list">
                <li><router-link to="/stocks">查看股票</router-link></li>
                <li><router-link to="/portfolio">我的投資組合</router-link></li>
                <li><router-link to="/transactions">交易歷史</router-link></li>
                <li>帳戶餘額: $ {{ accountBalance }}</li>
            </ul>
        </nav>
        <div class="navbar-container">    
            <div class="navbar" id="navbarNav">
                <ul class=navbar-nav>
                    <li class="nav-item">
                        <img v-if="googlePictureUrl!=''" alt="Google User Picture" class="user-icon" :src="googlePictureUrl">
                        <img v-if="googlePictureUrl==''" alt="Default User Picture" class="user-icon" src="@/assets/img/user-tie-solid.svg">                       
                    </li>
                    <li class="nav-item username" v-if="username != ''">
                        <form>
                            {{ username }}
                            <button type="submit" class="btn btn-outline-dark " @click.prevent="logout">登出</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </nav> 
    <hr class="divider"/>

</template>


<script>
    import axios from 'axios';
    const defAxios = axios.create({
        baseURL: 'http://localhost:8081',
        timeout: 10000
    });
    export default {
        data() {
            return {
                userId:0,
                username: '', // 可以從登入資訊中獲取使用者名稱
                accountBalance:'',
                googlePictureUrl:''
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
                    // console.log(JSON.stringify(response.data));
                    this.accountBalance = response.data.data.balance!=null? Number(response.data.data.balance).toLocaleString():'0';
                }).catch((error)=>{
                    console.log('error:'+JSON.stringify(error.response));
                    // let err = error.response.error;
                    // this.accountBalance = error.response.message + (err!=null? err.toString():'');
                });
            }
        },
        created() {
            document.title = "StockPanda - 股票模擬交易平台";
            this.userId = localStorage.getItem('userId');
            this.username = localStorage.getItem('username');
            this.googlePictureUrl = localStorage.getItem('googlePictureUrl');
            // 監聽 localStorage 的變化
            window.addEventListener('storage', (event) => {
                if (event.key === 'logout') {
                    this.$router.push('/'); // 返回登入頁面
                }
            });
            this.refreshAccountBalance();
        },
        beforeUnmount() {
            // 移除事件監聽器
            window.removeEventListener('storage', this.handleStorageEvent);
        }
    }

</script>
<style scoped>
.navbar{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}
.navbar-nav{
    list-style: none;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
}
.navbar-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.nav-item {
    margin-left: 20px;
}
.nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
.top-nav-bar {
    display: flex;
    justify-content: flex-start;
    flex-grow: 1;
}

.user-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #007bff;
    margin-right: 10px;
}
.username {
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #333;
}

.logout-button {
    margin-left: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.logout-button:hover {
    background-color: #0056b3;
}
.divider {
    margin-top: 70px; /* 確保橫線不會被導航欄遮擋 */
    border: 0;
    height: 1px;
    background: #333; /* 設置橫線顏色 */
    /* background-image: linear-gradient(to right, #ccc, #333, #ccc); 添加漸變效果 */
}
</style>