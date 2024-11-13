<template>
    <div class="dashboard">
        <header>
            <h1>歡迎回來，{{ username }}！</h1>
            <button @click="logout">登出</button>
        </header>

        <nav class="navigation">
            <ul>
                <li><router-link to="/stocks">查看股票</router-link></li>
                <li><router-link to="/portfolio">我的投資組合</router-link></li>
                <li><router-link to="/transactions">交易歷史</router-link></li>
            </ul>
        </nav>

        <main>
            <h2>市場概況</h2>
            <p>這裡顯示市場的最新資訊和趨勢。</p>
            <!-- 這裡可以加一些圖表或市場數據 -->
        </main>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            username: '', // 可以從登入資訊中獲取使用者名稱
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
    },
    created() {
        this.username = localStorage.getItem('username');
        // 監聽 localStorage 的變化
        window.addEventListener('storage', (event) => {
            if (event.key === 'logout') {
                this.$router.push('/'); // 返回登入頁面
            }
        });
    },
    beforeUnmount () {
        // 移除事件監聽器
        window.removeEventListener('storage', this.handleStorageEvent);
    }
};
</script>
  
<style scoped>
.dashboard {
    padding: 20px;
    min-height: 100vh;
    /* 確保背景填滿整個視口 */
    background: linear-gradient(to bottom right, rgba(0, 123, 255, 0.5), rgba(255, 255, 255, 0.8)),
        url('https://example.com/your-background-image.jpg') no-repeat center center fixed;
    background-size: cover;
    /* 確保背景圖像覆蓋整個區域 */
    color: #333;
    /* 文字顏色 */
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    /* 頭部背景半透明 */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navigation {
    margin: 20px 0;
}

.navigation ul {
    list-style-type: none;
    padding: 0;
}

.navigation li {
    display: inline;
    margin-right: 15px;
}

button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    /* 過渡效果 */
}

button:hover {
    background-color: #0056b3;
}

main {
    background: rgba(255, 255, 255, 0.8);
    /* 主要內容區域的半透明背景 */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}</style>

  