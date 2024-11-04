<template>
    <div>
      <p>正在處理 Google 登入...</p>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      console.log('accessToke: '+accessToken+' state: '+params.get('state'));
      if (accessToken) {
        // 將 access token 發送到後端進行驗證
        this.$http.post('http:localhost:8081/login/oauth2/code/google', { token: accessToken })
          .then(response => {
            console.log('後端回應', response);
            this.$router.push('/dashboard'); // 導航到 Dashboard 頁面
          })
          .catch(error => {
            console.error('Google 登入失敗：', error);
          });
      } else {
        console.error('未獲取到 access token, state: '+params.get('state'));
      }
    }
  };
  </script>