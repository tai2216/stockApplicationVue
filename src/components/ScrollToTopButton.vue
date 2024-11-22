<template>
  <button class="scroll-to-top" @click="scrollToTop">TOP</button>
</template>

<script>
export default {
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ff69b4; /* 使用粉紅色背景 */
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 15px; /* 調整字體大小 */
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.3s;
}

.scroll-to-top:hover {
  background-color: #ff1493; /* 使用深粉紅色背景 */
  transform: scale(1.1); /* 放大效果 */
}
</style>