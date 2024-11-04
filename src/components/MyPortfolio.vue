<template>
    <div class="my-portfolio">
        <h2 class="title">我的投資組合</h2>
        <table class="portfolio-table">
            <thead>
                <tr>
                    <th>股票名稱</th>
                    <th>股票代碼</th>
                    <th>持有數量</th>
                    <th>購買價格</th>
                    <th>當前價格</th>
                    <th>總價值</th>
                    <th>變動 (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="stock in portfolioStocks" :key="stock.symbol">
                    <td>{{ stock.name }}</td>
                    <td>{{ stock.symbol }}</td>
                    <td>{{ stock.quantity }}</td>
                    <td>{{ stock.purchasePrice.toFixed(2) }}</td>
                    <td>{{ stock.currentPrice.toFixed(2) }}</td>
                    <td>{{ (stock.quantity * stock.currentPrice).toFixed(2) }}</td>
                    <td :class="{ 'positive': stock.change >= 0, 'negative': stock.change < 0 }">
                        {{ stock.change.toFixed(2) }}%
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <br />
            <BackButton />
        </div>
        <div v-if="portfolioStocks.length === 0" class="no-results">
            你的投資組合是空的
        </div>
    </div>
</template>
  
<script>
import BackButton from '@/components/BackButton.vue';
export default {
    components: {
        BackButton,
    },
    name: 'MyPortfolio',
    data() {
        return {
            portfolioStocks: [
                { name: 'Apple Inc.', symbol: 'AAPL', quantity: 10, purchasePrice: 140.00, currentPrice: 150.00, change: 7.14 },
                { name: 'Microsoft Corp.', symbol: 'MSFT', quantity: 5, purchasePrice: 260.00, currentPrice: 280.00, change: 7.69 },
                { name: 'Google LLC', symbol: 'GOOGL', quantity: 2, purchasePrice: 2500.00, currentPrice: 2700.00, change: 8.00 },
                // 其他投資股票資料...
            ],
        };
    },
};
</script>
  
<style scoped>
.my-portfolio {
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

.portfolio-table {
    width: 100%;
    border-collapse: collapse;
    /* 合併邊框 */
}

.portfolio-table th,
.portfolio-table td {
    padding: 12px;
    border: 1px solid #ddd;
    /* 边框颜色 */
    text-align: left;
}

.portfolio-table th {
    background-color: #007bff;
    /* 蓝色背景 */
    color: white;
    /* 白色字 */
}

.portfolio-table td {
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

.no-results {
    color: #666;
    /* 灰色字 */
    text-align: center;
    /* 中心对齐 */
    margin-top: 20px;
    /* 上边距 */
}
</style>
  