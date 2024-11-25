<template>
    <TopNavBar :newAccountBalance="accountBalance"/>
    <ScrollToTopButton />
    <div class="tableContainer">
        <h2 class="title">我的投資組合</h2>
        <table class="portfolio-table">
            <thead>
                <tr>
                    <!-- <th @click="sortStocks('serialNo')">流水號<span v-if="sortKey === 'serialNo' | sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th> -->
                    <th @click="sortStocks('stockCode')">股票代碼<span v-if="sortKey === 'stockCode'| sortKey==''">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('stockName')">股票名稱<span v-if="sortKey === 'stockName'">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('totalQuantity')">持股數量<span v-if="sortKey === 'totalQuantity'">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('priceAverage')">平均持有成本(一股)<span v-if="sortKey === 'priceAverage'">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th @click="sortStocks('totalCost')">總成本<span v-if="sortKey === 'totalCost'">{{ sortOrder === 1 ? '▼' : '▲' }}</span></th>
                    <th>現價(一股)</th>
                    <th>現價(一張)</th>
                    <th>損益</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="stockHolding in stockHoldingPage" :key="stockHolding.serialNo">
                    <!-- <td>{{ stockHolding.serialNo }}</td> -->
                    <td>{{ stockHolding.stockCode }}</td>
                    <td>{{ stockHolding.stockName }}</td>
                    <td>{{ stockHolding.totalQuantity}}</td>
                    <td>{{ stockHolding.priceAverage }}</td>
                    <td>{{ stockHolding.totalCost}}</td>
                    <td>{{ this.stockCurrentPrice[stockHolding.stockCode]/1000 }}</td>
                    <td>{{ this.stockCurrentPrice[stockHolding.stockCode] }}</td>
                    <td :class="getProfitLossClass((this.stockCurrentPrice[stockHolding.stockCode]*stockHolding.totalQuantity)-stockHolding.totalCost)">
                        {{(this.stockCurrentPrice[stockHolding.stockCode]*stockHolding.totalQuantity)-stockHolding.totalCost}}
                    </td>
                    <td>
                        <button class="sell-button" @click="openTradeModal('/sellStock',stockHolding)">賣出</button>
                    </td>
                    <td>
                        <button class="details-button" @click="openDetailsModal(stockHolding.serialNo)">明細</button>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="9">共 {{ stockHoldingObj.totalElements }} 檔股票， 頁面損益: 
                        <span :class="getProfitLossClass(this.stockTotalLoss)">{{ this.stockTotalLoss }}</span>
                         ，總損益:
                         <span :class="getProfitLossClass(this.stockTotalLossAllPage)">{{ this.stockTotalLossAllPage }}</span>
                    </td>
                </tr>
            </tfoot> 
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage <= 0">上一頁</button>
            <span>第 {{ validPage(currentPage)+1 }} 頁，共 {{ totalPages }} 頁</span>
            <button @click="nextPage" :disabled="((currentPage==0&&totalPages==1) | currentPage+1 >= totalPages)">下一頁</button>
            <input type="number" v-model.number="goToPageNumber" min="1" :max="totalPages" placeholder="頁數" />
            <button @click="goToPage">跳轉</button>
        </div>
        <div>
            <br />
            <!-- <BackButton /> -->
        </div>
        <div v-if="stockHoldingPage.length === 0" class="no-results">
            你的投資組合是空的
        </div>
        <!-- 交易視窗 -->
        <div v-if="showTradeModal" class="modal">
            <div class="modal-content">
                <h2>{{buyOrSellUrl=='/buyStock'?'買進':'賣出'}} {{ selectedStock.Code }}</h2>
                <h3>{{ selectedStock.Name }}</h3>
                <input class="input-quantity" type="number" v-model.number="tradeQuantity" @input="validateQuantity" placeholder="輸入數量" :min="1"/>
                <p>金額: {{ tradeQuantity * this.stockCurrentPrice[selectedStock.stockCode]}}</p>
                <p>手續費(0.1425%): {{ countServiceCharge(tradeQuantity * this.stockCurrentPrice[selectedStock.stockCode]) }}</p>
                <p>(單位:1000股 等於一張)</p>
                <p v-if="buyOrSellUrl=='/sellStock'">證券交易稅(0.3%): {{countTax(tradeQuantity * this.stockCurrentPrice[selectedStock.stockCode])  }}</p>
                <button @click="buyOrSellStock(buyOrSellUrl,tradeQuantity,selectedStock.stockCode)">確認</button>
                <button @click="closeTradeModal">取消</button>
            </div>
        </div>
        <div v-if="isLoading" class="modal">
            <div class="modal-content">
                <div class="spinner"></div>
                <p>正在處理，請稍候...</p>
            </div>
        </div>
        <div v-if="isShowDetails" class="modal-stock-details" @click.self="closeDetailsModal">
            <div class="modal-content-stock-details">
                <span class="close" @click="isShowDetails = false">&times;</span>
                <div class="modal-body">
                    <table class="portfolio-table">
                        <thead>
                            <tr>
                                <!-- <th >流水號</th> -->
                                <th >股票代碼</th>
                                <th >股票名稱</th>
                                <th >持股數量</th>
                                <th >交易日期</th>
                                <th >買進價格</th>
                                <th >現價</th>
                                <th >總成本(含手續費)</th>
                                <th>損益</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="stockHoldingDetails in stockHoldingDetailsPage" :key="stockHoldingDetails.serialNo">
                                <!-- <td>{{ stockHoldingDetails.serialNo }}</td> -->
                                <td>{{ stockHoldingDetails.stockCode }}</td>
                                <td>{{ stockHoldingDetails.stockName }}</td>
                                <td>{{ stockHoldingDetails.quantity}}</td>
                                <td>{{ stockHoldingDetails.transactionDate }}</td>
                                <td>{{ stockHoldingDetails.price}}</td>
                                <td>{{ this.stockCurrentPrice[stockHoldingDetails.stockCode] }}</td>
                                <td>{{ stockHoldingDetails.cost}}</td>
                                <td :class="getProfitLossClass((this.stockCurrentPrice[stockHoldingDetails.stockCode]*stockHoldingDetails.quantity)-stockHoldingDetails.cost)">
                                    {{(this.stockCurrentPrice[stockHoldingDetails.stockCode]*stockHoldingDetails.quantity)-stockHoldingDetails.cost}}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="9">共 {{ stockHoldingDetailsObj.totalElements }} 筆明細</td>
                            </tr>
                        </tfoot> 
                    </table>
                </div>
                <button class="close-button" @click="closeDetailsModal()">關閉</button>
                <div class="pagination">
                    <button @click="prevPageDetails" :disabled="currentPageDetails <= 0">上一頁</button>
                    <span>第 {{validPage(currentPageDetails) +1 }} 頁，共 {{ totalPagesDetails }} 頁</span>
                    <button @click="nextPageDetails" :disabled="((currentPageDetails==0&&totalPagesDetails==1) |currentPageDetails+1 >= totalPagesDetails)">下一頁</button>
                    <input type="number" v-model.number="goToPageNumberDetails" min="1" :max="totalPagesDetails" placeholder="頁數" />
                    <button @click="goToPageDetails">跳轉</button>
                </div>
            </div>
        </div>
        <!-- 快閃訊息 -->
        <transition name="fade">
            <div v-if="showFlashMessage" :class="['flash-message', flashMessageType]">
                <!-- <p>{{ refreshMessage }}</p> -->
                <p>{{ flashMessage }}</p>
            </div>
        </transition>
    </div>
</template>
  
<script>
import '@/assets/css/common.css';
import '@/assets/css/globalTable.css';
import TopNavBar from '@/components/TopNavBar.vue';
// import BackButton from '@/components/BackButton.vue';
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import axios from 'axios';
const defAxios = axios.create({
//   baseURL: 'http://localhost:8081',
baseURL: '/api',
  timeout: 10000
});
export default {
    components: {
        // BackButton,
        TopNavBar,
        ScrollToTopButton
    },
    name: 'MyPortfolio',
    data() {
        return {
            currentPage: 0,
            totalPages:0,
            itemsPerPage: 15,
            goToPageNumber: null,
            //
            currentStockHoldingNo:0,
            currentPageDetails: 0,
            totalPagesDetails:0,
            itemsPerPageDetails: 15,
            goToPageNumberDetails: null,
            //
            stockHoldingObj:{},
            stockHoldingPage:[],
            stockCurrentPrice:{},
            stockTotalLoss:0,
            stockTotalLossAllPage:0,
            //
            stockHoldingDetailsObj:{},
            stockHoldingDetailsPage:[],
            //
            sortKey: '',
            sortOrder: 1, // 1 為升序，-1 為降序
            showTradeModal: false,
            selectedStock: null,
            tradeQuantity: 0,
            buyOrSellUrl:'',
            isLoading: false,
            //
            isShowDetails:false,
            //
            showFlashMessage: false,
            flashMessage: '',
            flashMessageType: '',
            // refreshMessage:`三秒後刷新頁面...\n\r`,
        };
    },
    methods:{
        async queryStockHolding(){
            await defAxios.get('/queryStockHolding',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    userId:localStorage.getItem('userId'),
                    page: this.currentPage
                }
            }).then((response)=>{
                // console.log(JSON.stringify(response.data));
                this.stockHoldingObj = response.data.data;
                this.stockHoldingPage = response.data.data.content;
                this.totalPages = response.data.data.totalPages;
                let tempStr = '';
                for(let d of this.stockHoldingPage){
                    // console.log(d);
                    tempStr = tempStr.concat(d.stockCode.toString()+',');
                }
                if (tempStr.endsWith(',')) {
                    tempStr = tempStr.slice(0, -1);
                }
                // console.log(tempStr);
                if(this.stockHoldingPage.length>0){
                    this.getCurrentPrice(tempStr);
                }
                // this.accountBalance = response.data.data.balance!=null? Number(response.data.data.balance).toLocaleString():'0';
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
                // let err = error.response.error;
                // this.accountBalance = error.response.message + (err!=null? err.toString():'');
            })
        },
        getCurrentPrice(stockCodes){
            defAxios.get('/getCurrentPrice',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    stockCodes:stockCodes
                }
            }).then((response)=>{
                // console.log(JSON.stringify(response.data));
                // console.log(JSON.stringify(response.data.data));
                this.stockCurrentPrice = response.data.data;
                this.getTotalLossOnCurrentPage();
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
            })
        },
        async queryStockHoldingDetails(){
            await defAxios.get('/queryStockHoldingDetails',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    stockHoldingNo:this.currentStockHoldingNo,
                    page: this.currentPageDetails
                }
            }).then((response)=>{
                // console.log(JSON.stringify(response.data));
                this.stockHoldingDetailsObj = response.data.data;
                this.stockHoldingDetailsPage = response.data.data.content;
                this.totalPagesDetails = this.stockHoldingDetailsObj.totalPages;
                // this.accountBalance = response.data.data.balance!=null? Number(response.data.data.balance).toLocaleString():'0';
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
                // let err = error.response.error;
                // this.accountBalance = error.response.message + (err!=null? err.toString():'');
            })
        },
        buyOrSellStock(url,quantity,stockCode){
            this.closeTradeModal();
            if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
                this.flashMessage = '數量不得為零或負數且必須為數字正整數';
                this.flashMessageType = 'error';
                this.isLoading = false;
                this.showFlashMessage = true;
                setTimeout(() => {
                    this.showFlashMessage = false;
                }, 1000);
                return;
            }
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
                    stockCode: stockCode
                }
            }
            ).then((response)=>{
                // console.log(JSON.stringify(response.data));
                this.flashMessage = response.data.message;
                this.flashMessageType = 'success';
                this.refreshAccountBalance();
                this.queryStockHolding();
                this.getTotalLoss();
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
            }, 1500);
        },
        //
        openDetailsModal(serialNo){
            this.currentStockHoldingNo = serialNo;
            this.queryStockHoldingDetails();
            this.isShowDetails = true;
        },
        closeDetailsModal() {
            this.isShowDetails = false;
        },
        nextPageDetails() {
            if (this.currentPageDetails < this.totalPagesDetails) {
                this.currentPageDetails++;
                this.queryStockHoldingDetails();
            }
        },
        prevPageDetails() {
            if (this.currentPageDetails >= 1) {
                this.currentPageDetails--;
                this.queryStockHoldingDetails();
            }
        },
        goToPageDetails() {
            let pageNumPattern = /^[1-9]\d*$/;
            if(!pageNumPattern.test(this.goToPageNumberDetails)){
                this.goToPageNumberDetails = 1;
                alert('請輸入正整數');
                return;
            }
            if (this.goToPageNumberDetails !== null && this.goToPageNumberDetails > 0 && this.goToPageNumberDetails <= this.totalPagesDetails) {
                this.currentPageDetails = this.goToPageNumberDetails - 1;
                this.queryStockHoldingDetails();
            }
        },
        //
        openTradeModal(url,stock) {
            this.buyOrSellUrl = url;
            this.selectedStock = stock;
            this.tradeQuantity = stock.totalQuantity;
            this.showTradeModal = true;
        },
        closeTradeModal() {
            this.showTradeModal = false;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.queryStockHolding();
            }
        },
        prevPage() {
            if (this.currentPage >= 1) {
                this.currentPage--;
                this.queryStockHolding();
            }
        },
        goToPage() {
            let pageNumPattern = /^[1-9]\d*$/;
            if(!pageNumPattern.test(this.goToPageNumber)){
                this.goToPageNumber = 1;
                alert('請輸入正整數');
                return;
            }
            if (this.goToPageNumber !== null && this.goToPageNumber > 0 && this.goToPageNumber <= this.totalPages) {
                this.currentPage = this.goToPageNumber - 1;
                this.queryStockHolding();
            }
        },
        sortStocks(key) {
            if (this.sortKey === key) {
                this.sortOrder *= -1; // 切換排序順序
            } else {
                this.sortKey = key;
                this.sortOrder = 1; // 默認升序
            }
            this.stockHoldingPage.sort((a, b) => {
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
        getProfitLossClass(value) {
            // console.log(value);
            return value >= 0 ? 'profit' : 'loss';
        },
        getTotalLossOnCurrentPage(){
            this.stockTotalLoss = 0;
            for(let stockHolding of this.stockHoldingPage){
                // console.log(stockHolding);
                let curPrice = this.stockCurrentPrice[stockHolding.stockCode];
                let q = stockHolding.totalQuantity;
                let totalCost = stockHolding.totalCost;
                let n = (curPrice*q)-totalCost;
                this.stockTotalLoss +=n;
            }
            return this.stockTotalLoss;
        },
        getTotalLoss(){
            this.userId = localStorage.getItem('userId');
            defAxios.get('/getStockHoldingTotalLoss',{
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Accept': 'application/json'
                },
                params: {
                    userId: parseInt(this.userId)
                }
            }).then((response)=>{
                console.log(JSON.stringify(response.data.data));
                let lossObj = response.data.data;
                this.stockTotalLossAllPage=0;
                for(let stockHolding of lossObj.holdingList){
                    // console.log(stockHolding);
                    let curPrice = lossObj.stockNamesAndPrices[stockHolding.stockCode];
                    let q = stockHolding.totalQuantity;
                    let totalCost = stockHolding.totalCost;
                    let n = (curPrice*q)-totalCost;
                    this.stockTotalLossAllPage +=n;
                }
                return this.stockTotalLossAllPage;
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
                // let err = error.response.error;
                // this.accountBalance = error.response.message + (err!=null? err.toString():'');
            });
        },
        validateQuantity() {
            if (typeof this.tradeQuantity != 'number' || isNaN(this.tradeQuantity) || this.tradeQuantity <= 0) {
                this.tradeQuantity = null;
            }else{
                this.tradeQuantity = parseInt(this.tradeQuantity, 10);
            }
        },
        validPage(pageNum){
            if (typeof pageNum != 'number' | isNaN(pageNum) | pageNum <= 0) {
                return 0;
            }else{
                return pageNum;
            }
        },
        countServiceCharge(price){
            let p = (price*0.001425).toFixed();
            return (p<20) ? 20 : p;
        },
        countTax(price){
            return (price*0.003).toFixed();
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
                this.accountBalance = response.data.data.balance!=null? Number(response.data.data.balance).toLocaleString():0;
            }).catch((error)=>{
                console.log('error:'+JSON.stringify(error.response));
                // let err = error.response.error;
                // this.accountBalance = error.response.message + (err!=null? err.toString():'');
            });
        }
    },
    created() {
        this.queryStockHolding();
        this.getTotalLoss();
    }
};
</script>
  
<style scoped>

.profit {
    color: red;
}

.loss {
    color: green;
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

/* Modal 視窗樣式 */
.modal-stock-details {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1100;
}

.modal-content-stock-details {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    max-width:90%;
    max-height: 90%; /* 最大高度為畫面的 90% */
    overflow-y: auto; /* 內容超出時顯示滾動條 */
}

.close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
}

.modal-body {
    margin-top: 20px;
}
</style>
  