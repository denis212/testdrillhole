import Vue from 'vue'
import router from './router';
import App from './components/App.vue';
import axios from 'axios';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all';

Vue.config.productionTip = false;

Vue.use({
  install(Vue){
    Vue.prototype.$api = axios.create({
      baseURL: 'http://localhost:8081/api'
    })
  }
});

new Vue({
	router,
  render: h => h(App)
}).$mount('#app');
