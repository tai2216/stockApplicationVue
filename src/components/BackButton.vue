<template>
    <button class="back-button" @click="goBack">
        回上一頁
    </button>
</template>
  
<script>
export default {
    name: 'BackButton',
    methods: {
        goBack() {
            this.$router.go(-1); // 返回上一頁
        },
    },
};
</script>
  
<style scoped>
.back-button {
    background-color: #007bff;
    /* 藍色背景 */
    color: white;
    /* 白色字 */
    border: none;
    /* 去除邊框 */
    border-radius: 5px;
    /* 圓角 */
    padding: 10px 20px;
    /* 上下內邊距 */
    font-size: 16px;
    /* 字體大小 */
    cursor: pointer;
    /* 鼠標變為手型 */
    transition: background-color 0.3s;
    /* 背景顏色變化 */
}

.back-button:hover {
    background-color: #0056b3;
    /* 懸停時顏色 */
}</style>
  