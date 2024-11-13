<template>
    <div class="stocks">
        <h2 class="title">股票列表</h2>
        <form @submit.prevent="searchStock">
            <input type="text" v-model="keyWord" placeholder="搜尋股票..." class="search-input" />
        </form>

        <table class="stocks-table">
            <thead>
                <tr>
                    <!-- <th>股票名稱</th>
                    <th>股票代碼</th>
                    <th>最新價格</th>
                    <th>變動 (%)</th>
                    <th>查看詳情</th> -->
                    <th @click="sortStocks('Code')">股票代碼<span v-if="sortKey === 'Code' | sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('Name')">股票名稱<span v-if="sortKey === 'Name'| sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('PreviousDayPrice')">收盤價(單位:一股)<span v-if="sortKey === 'PreviousDayPrice'| sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('LastTradingDay')">最後交易日<span v-if="sortKey === 'LastTradingDay'| sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                </tr>
            </thead>
            <tbody>
                <!-- <tr v-for="stock in filteredStocks" :key="stock.symbol">
                    <td>{{ stock.name }}</td>
                    <td>{{ stock.symbol }}</td>
                    <td>{{ stock.price.toFixed(2) }}</td>
                    <td :class="{ 'positive': stock.change >= 0, 'negative': stock.change < 0 }">
                        {{ stock.change.toFixed(2) }}%
                    </td>
                    <td>
                        <button class="detail-button" @click="viewDetails(stock)">詳情</button>
                    </td>
                </tr> -->
                <tr v-for="t in twt84u" :key="t.Code">
                    <td>{{ t.Code }}</td>
                    <td>{{ t.Name }}</td>
                    <td>{{ t.PreviousDayPrice }}</td>
                    <td>{{ t.LastTradingDay }}</td>
                    <!-- <td>
                        <button class="detail-button" @click="viewDetails(stock)">詳情</button>
                    </td> -->
                    <td>
                        <button class="buy-button" @click="openTradeModal('/buyStock',t)">買進</button>
                    </td>
                    <td>
                        <button class="sell-button" @click="openTradeModal('/sellStock',t)">賣出</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="8">共 {{ searchMode==false?pageObj.totalElements:pageObj.numberOfElements }} 檔股票</td>
                </tr>
            </tfoot>    
        </table>
        <div v-if="searchMode!=true" class="pagination">
            <button @click="prevPage" :disabled="currentPage <= 0">上一頁</button>
            <span>第 {{ currentPage+1 }} 頁，共 {{ totalPages }} 頁</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages">下一頁</button>
            <input type="number" v-model.number="goToPageNumber" min="1" :max="totalPages" placeholder="頁數" />
            <button @click="goToPage">跳轉</button>
        </div>
        <div>
            <br />
            <BackButton />
        </div>
        <div v-if="message" :style="{color:'red'}">{{ message }}</div>
        <div v-if="twt84u.length === 0" class="no-results">
            沒有找到相關股票
        </div>
            <!-- 交易視窗 -->
            <div v-if="showTradeModal" class="modal">
            <div class="modal-content">
                <h2>{{buyOrSellUrl=='/buyStock'?'買進':'賣出'}} {{ selectedStock.Code }}</h2>
                <h3>{{ selectedStock.Name }}</h3>
                <input type="number" v-model.number="tradeQuantity" placeholder="輸入數量" />(單位:股)
                <button @click="buyOrSellStock(buyOrSellUrl,tradeQuantity,selectedStock.Code,selectedStock.LastTradingDay)">確認</button>
                <button @click="closeTradeModal">取消</button>
            </div>
        </div>
        <div v-if="isLoading" class="modal">
            <div class="modal-content">
                <div class="spinner"></div>
                <p>正在處理，請稍候...</p>
            </div>
        </div>
        <!-- 快閃訊息 -->
        <transition name="fade">
            <div v-if="showFlashMessage" :class="['flash-message', flashMessageType]">
                {{ flashMessage }}
            </div>
        </transition>
    </div>
</template>
  
<script>
import BackButton from '@/components/BackButton.vue';
import axios from 'axios';
const defAxios = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000
});
export default {
    components: {
        BackButton,
    },
    name: 'StocksList',
    data() {
        return {
            searchMode: false,
            message: '',
            twt84u:[],
            sort: 'Code',
            order: 'asc',
            pageObj:{},
            currentPage: 0,
            totalPages:0,
            itemsPerPage: 15,
            goToPageNumber: null,
            sortKey: '',
            sortOrder: 1, // 1 為升序，-1 為降序
            showTradeModal: false,
            selectedStock: null,
            tradeQuantity: 0,
            buyOrSellUrl:'',
            isLoading: false,
            showFlashMessage: false,
            flashMessage: '',
            flashMessageType: ''
        };
    },
    methods: {
        async queryStock(){
            await defAxios.get('/queryStockInfo',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    page: this.currentPage,
                    size: this.itemsPerPage,
                    sort: this.sort,
                    order: this.order
                }
            })
            .then(response => {
                if(response!='AxiosError: Network Error'){
                    // console.log(JSON.stringify(response.data));
                    this.twt84u = response.data.data.content;
                    this.pageObj = response.data.data;
                    this.totalPages = this.pageObj.totalPages;
                    // console.log('註冊成功，回應訊息: '+response.data.message);
                    this.message = response.data.message;
                }else{
                    this.message ='目前伺服器無回應，請稍後在試';
                }
            })
            .catch(error => {
                console.error('Error: '+JSON.stringify(error.response));
            });
        },
        searchStock(){
            if(this.keyWord==''){
                this.queryStock();
                this.searchMode=false;
                return;
            }
            this.searchMode=true;
            defAxios.get('/searchStock',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    keyWord: this.keyWord
                }
            })
            .then(response => {
                if(response!='AxiosError: Network Error'){
                    console.log(JSON.stringify(response.data));
                    this.twt84u = response.data.data.content;
                    this.pageObj = response.data.data;
                    this.totalPages = this.pageObj.totalPages;
                    // console.log('註冊成功，回應訊息: '+response.data.message);
                    this.message = response.data.message;
                }else{
                    this.message ='目前伺服器無回應，請稍後在試';
                }
            })
            .catch(error => {
                console.error('Error: '+JSON.stringify(error.response));
            });
        },
        buyOrSellStock(url,quantity,stockCode,date){
            this.closeTradeModal();
            this.isLoading = true;
            defAxios.post(url,{
                // 在post方法裡面當傳入第三個config Object時，這一塊就是request body須注意
            },{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params:{
                    userId: parseInt(localStorage.getItem('userId')),
                    quantity: quantity,
                    stockCode: stockCode,
                    date: date
                }
            }
            ).then((response)=>{
                console.log(JSON.stringify(response.data));
                this.flashMessage = response.data.message;
                this.flashMessageType = 'success';
            }).catch((error)=>{
                console.error(JSON.stringify(error.response));
                let err = error.response.data.error;
                this.flashMessage = error.response.data.message +' '+ (err!=null? err : '');
                this.flashMessageType = 'error';
            });
            this.isLoading = false;
            this.showFlashMessage = true;
            setTimeout(() => {
                this.showFlashMessage = false;
            }, 1500); // 1.5 秒後隱藏快閃訊息
        },
        openTradeModal(url,stock) {
            this.buyOrSellUrl = url;
            this.selectedStock = stock;
            this.tradeQuantity = 1000;
            this.showTradeModal = true;
        },
        closeTradeModal() {
            this.showTradeModal = false;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.queryStock();
            }
        },
        prevPage() {
            if (this.currentPage >= 1) {
                this.currentPage--;
                this.queryStock();
            }
        },
        goToPage() {
            if (this.goToPageNumber !== null && this.goToPageNumber > 0 && this.goToPageNumber <= this.totalPages) {
                this.currentPage = this.goToPageNumber - 1;
                this.queryStock();
            }
        },
        sortStocks(key) {
            if (this.sortKey === key) {
                this.sortOrder *= -1; // 切換排序順序
            } else {
                this.sortKey = key;
                this.sortOrder = 1; // 默認升序
            }
            this.twt84u.sort((a, b) => {
                if (a[key] < b[key]) return -1 * this.sortOrder;
                if (a[key] > b[key]) return 1 * this.sortOrder;
                return 0;
            });
        },
        getSortClass(key) {
            return {
                'sortable': true,
                'sorted-asc': this.sortKey === key && this.sortOrder === 1,
                'sorted-desc': this.sortKey === key && this.sortOrder === -1
            };
        },
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
        if(this.twt84u.length == 0) {
            this.queryStock();
        }
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
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
    /* 加上陰影 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}

.pagination input {
  width: 50px;
  text-align: center;
  margin: 0 10px;
}

/* .sortable {
    cursor: pointer;
}

.sorted-asc::after {
    content: ' ▲';
}

.sorted-desc::after {
    content: ' ▼';
} */

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
    padding: 5px;
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

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.modal-content input {
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
}

.modal-content button {
    margin: 5px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

.modal-content button:first-of-type {
    background-color: #28a745;
    color: white;
}

.modal-content button:last-of-type {
    background-color: #dc3545;
    color: white;
}

.modal-content-spinner {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.flash-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    z-index: 1000;
    color: white;
    font-size: 18px;
    opacity: 1;
    transition: opacity 1s ease-out;
}

.flash-message.success {
    background-color: #3ac25a;
}

.flash-message.error {
    background-color: #e75766;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
}
</style>
  