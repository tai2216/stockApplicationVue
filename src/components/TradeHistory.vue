<template>
    <TopNavBar></TopNavBar>
    <div class="trade-history">
        <h2 class="title">交易歷史</h2>
        <table class="history-table">
            <thead>
                <tr>
                    <th>流水號</th>
                    <th>股票代碼</th>
                    <th>數量</th>
                    <th>價格</th>
                    <th>交易日期</th>
                    <th>交易類型</th>
                    <!-- <th>股票名稱</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="trans in transactionHistoryPage" :key="trans.serialNumber">
                    <td>{{ trans.serialNumber }}</td>
                    <td>{{ trans.stockCode }}</td>
                    <td>{{ trans.quantity }}</td>
                    <td>{{ trans.price }}</td>
                    <td>{{ trans.transactionDate }}</td>
                    <td>{{ trans.transactionType }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="8">共 {{ transactionHistoryObj.totalElements }} 筆交易歷史紀錄</td>
                </tr>
            </tfoot> 
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage <= 0">上一頁</button>
            <span>第 {{ currentPage+1 }} 頁，共 {{ totalPages }} 頁</span>
            <button @click="nextPage" :disabled="((currentPage==0&&totalPages==1) | currentPage+1 >= totalPages)">下一頁</button>
            <input type="number" v-model.number="goToPageNumber" min="1" :max="totalPages" placeholder="頁數" />
            <button @click="goToPage">跳轉</button>
        </div>
        <div>
            <br />
            <BackButton />
        </div>
        <div v-if="transactionHistoryPage.length === 0" class="no-results">
            你沒有任何交易歷史
        </div>
    </div>
</template>
  
<script>
import '@/assets/css/common.css';
import '@/assets/css/globalTable.css';
import TopNavBar from '@/components/TopNavBar.vue';
import BackButton from '@/components/BackButton.vue';
import axios from 'axios';
const defAxios = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000
});
export default {
    components: {
        BackButton,
        TopNavBar
    },
    name: 'TradeHistory',
    data() {
        return {
            transactionHistoryObj:{},
            transactionHistoryPage:[],
            currentPage: 0,
            totalPages:0,
            itemsPerPage: 15,
            goToPageNumber: null,
        };
    },
    methods:{
        async getTransactionHistory(){
            await defAxios.get('/getTransactionHistory',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    userId:localStorage.getItem('userId'),
                    page: this.currentPage
                }
            }).then((response)=>{
                // console.log(JSON.stringify(response.data.data));
                this.transactionHistoryObj = response.data.data;
                this.transactionHistoryPage = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
                // let err = error.response.error;
                // this.accountBalance = error.response.message + (err!=null? err.toString():'');
            })
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.getTransactionHistory();
            }
        },
        prevPage() {
            if (this.currentPage >= 1) {
                this.currentPage--;
                this.getTransactionHistory();
            }
        },
        goToPage() {
            if (this.goToPageNumber !== null && this.goToPageNumber > 0 && this.goToPageNumber <= this.totalPages) {
                this.currentPage = this.goToPageNumber - 1;
                this.getTransactionHistory();
            }
        },
    },
    created(){
        this.getTransactionHistory();
    }
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
  