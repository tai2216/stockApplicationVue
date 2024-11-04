<template>
    <div class="stocks">
        <h2 class="title">股票列表</h2>
        <input type="text" v-model="searchTerm" placeholder="搜尋股票..." @input="filterStocks" class="search-input" />

        <table class="stocks-table">
            <thead>
                <tr>
                    <th>股票名稱</th>
                    <th>股票代碼</th>
                    <th>最新價格</th>
                    <th>變動 (%)</th>
                    <th>查看詳情</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="stock in filteredStocks" :key="stock.symbol">
                    <td>{{ stock.name }}</td>
                    <td>{{ stock.symbol }}</td>
                    <td>{{ stock.price.toFixed(2) }}</td>
                    <td :class="{ 'positive': stock.change >= 0, 'negative': stock.change < 0 }">
                        {{ stock.change.toFixed(2) }}%
                    </td>
                    <td>
                        <button class="detail-button" @click="viewDetails(stock)">詳情</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <br />
            <BackButton />
        </div>
        <div v-if="filteredStocks.length === 0" class="no-results">
            沒有找到相關股票
        </div>
    </div>
</template>
  
<script>
import BackButton from '@/components/BackButton.vue';
export default {
    components: {
        BackButton,
    },
    name: 'StocksList',
    data() {
        return {
            searchTerm: '',
            stocks: [
                { name: 'Apple Inc.', symbol: 'AAPL', price: 150.00, change: 1.5 },
                { name: 'Microsoft Corp.', symbol: 'MSFT', price: 280.00, change: -0.5 },
                { name: 'Google LLC', symbol: 'GOOGL', price: 2700.00, change: 2.3 },
                // 其他股票資料...
            ],
            filteredStocks: [],
        };
    },
    methods: {
        filterStocks() {
            this.filteredStocks = this.stocks.filter(stock =>
                stock.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                stock.symbol.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
        viewDetails(stock) {
            // 可以導航到詳細資訊頁面
            alert(`查看 ${stock.name} 的詳細資訊`);
            // 例如：this.$router.push(`/stocks/${stock.symbol}`);
        },
    },
    created() {
        this.filteredStocks = this.stocks; // 初始化顯示所有股票
    },
};
</script>
  
<style scoped>
.stocks {
    padding: 20px;
    background-color: #f8f9fa;
    /* 淺灰背景 */
    border-radius: 8px;
    /* 邊角圓滑 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    /* 加上陰影 */
}

.title {
    font-size: 24px;
    color: #333;
    /* 深色字 */
    margin-bottom: 20px;
}

.search-input {
    padding: 10px;
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    /* 边框颜色 */
    border-radius: 4px;
    /* 圆角 */
    font-size: 16px;
    /* 字体大小 */
}

.stocks-table {
    width: 100%;
    border-collapse: collapse;
    /* 合并边框 */
}

.stocks-table th,
.stocks-table td {
    padding: 12px;
    border: 1px solid #ddd;
    /* 边框颜色 */
    text-align: left;
}

.stocks-table th {
    background-color: #007bff;
    /* 蓝色背景 */
    color: white;
    /* 白色字 */
}

.stocks-table td {
    background-color: #ffffff;
    /* 白色背景 */
}

.positive {
    color: green;
    /* 正变动显示为绿色 */
}

.negative {
    color: red;
    /* 负变动显示为红色 */
}

.detail-button {
    background-color: #007bff;
    /* 蓝色按钮 */
    color: white;
    /* 白色字 */
    border: none;
    /* 无边框 */
    padding: 8px 12px;
    /* 内边距 */
    border-radius: 4px;
    /* 圆角 */
    cursor: pointer;
    /* 鼠标样式为手指 */
}

.detail-button:hover {
    background-color: #0056b3;
    /* 悬停时更深的蓝色 */
}

.no-results {
    color: #666;
    /* 灰色字 */
    text-align: center;
    /* 中心对齐 */
    margin-top: 20px;
    /* 上边距 */
}
</style>
  