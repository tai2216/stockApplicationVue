<template>
    <div class="trade-history">
        <h2 class="title">交易歷史</h2>
        <table class="history-table">
            <thead>
                <tr>
                    <th>交易日期</th>
                    <th>股票名稱</th>
                    <th>股票代碼</th>
                    <th>交易類型</th>
                    <th>數量</th>
                    <th>價格</th>
                    <th>總金額</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="trade in trades" :key="trade.id">
                    <td>{{ trade.date }}</td>
                    <td>{{ trade.name }}</td>
                    <td>{{ trade.symbol }}</td>
                    <td>{{ trade.type }}</td>
                    <td>{{ trade.quantity }}</td>
                    <td>{{ trade.price.toFixed(2) }}</td>
                    <td>{{ (trade.quantity * trade.price).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
        <div>
            <br />
            <BackButton />
        </div>
        <div v-if="trades.length === 0" class="no-results">
            你沒有任何交易歷史
        </div>
    </div>
</template>
  
<script>
import BackButton from '@/components/BackButton.vue';
export default {
    components: {
        BackButton,
    },
    name: 'TradeHistory',
    data() {
        return {
            trades: [
                { id: 1, date: '2024-10-01', name: 'Apple Inc.', symbol: 'AAPL', type: '買入', quantity: 10, price: 140.00 },
                { id: 2, date: '2024-10-02', name: 'Microsoft Corp.', symbol: 'MSFT', type: '賣出', quantity: 5, price: 260.00 },
                { id: 3, date: '2024-10-03', name: 'Google LLC', symbol: 'GOOGL', type: '買入', quantity: 2, price: 2500.00 },
                // 其他交易歷史資料...
            ],
        };
    },
};
</script>
  
<style scoped>
.trade-history {
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

.history-table {
    width: 100%;
    border-collapse: collapse;
    /* 合併邊框 */
}

.history-table th,
.history-table td {
    padding: 12px;
    border: 1px solid #ddd;
    /* 边框颜色 */
    text-align: left;
}

.history-table th {
    background-color: #007bff;
    /* 蓝色背景 */
    color: white;
    /* 白色字 */
}

.history-table td {
    background-color: #ffffff;
    /* 白色背景 */
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
  