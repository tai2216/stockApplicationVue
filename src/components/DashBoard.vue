<template>
    <TopNavBar></TopNavBar>
    <div class="dashboard">
        <main>
            <h2>市場概況</h2>
            <p>這裡顯示市場的最新資訊和趨勢。</p>
            <!-- 這裡可以加一些圖表或市場數據 -->
            <div id="stock-chart" style="width: 100%; height: 400px;"></div>
        </main>
    </div>
</template>
  
<script>
import TopNavBar from './TopNavBar.vue';
import * as echarts from 'echarts';
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
            username: '', // 可以從登入資訊中獲取使用者名稱
            stockData: []
        };
    },
    components: {
        TopNavBar
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
        fetchStockData() {
            defAxios.get('/getTWIndexCurrentMonth',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
            }) // 替換為實際的 API URL
            .then(response => {
                // console.log(JSON.stringify(response.data.data));
                this.stockData = response.data.data;
                // console.log(JSON.stringify(tObj))
                this.renderChart();
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
            });
        },
        renderChart() {
            const chartDom = document.getElementById('stock-chart');
            const myChart = echarts.init(chartDom);
            const option = {
                title: {
                    show:true,
                    text: '台股當月走勢圖'
                },
                // legend:{
                //     data:['月']
                // },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    name:'日期',
                    type: 'category',
                    data: this.stockData.map(item => item.date)
                },
                yAxis: {
                    show:true,
                    type: 'value'
                },
                series: [{
                    name:'價格',
                    data: this.stockData.map(item => item.price.replaceAll(',','')),
                    type: 'bar'
                }]
            };
            myChart.setOption(option);
            const resize = () => myChart.resize();
            window.addEventListener('resize', resize, { passive: true });
        }
    },
    created() {
        this.username = localStorage.getItem('username');
        // 監聽 localStorage 的變化
        window.addEventListener('storage', (event) => {
            if (event.key === 'logout') {
                this.$router.push('/'); // 返回登入頁面
            }
        });
        // TopNavBar.data.apply(TopNavBar.methods.refreshAccountBalance());
        // TopNavBar.methods.refreshAccountBalance();
    },
    mounted() {
        this.fetchStockData();
    },
    beforeUnmount () {
        // 移除事件監聽器
        window.removeEventListener('storage', this.handleStorageEvent);
        window.removeEventListener('resize', this.handleResize);
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

  