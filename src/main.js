import Vue from 'vue';
import underscore from 'vue-underscore';
import moment from 'moment';
import VueMomentJS from 'vue-momentjs';
import VueLocalForage from 'vue-localforage';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import './registerServiceWorker';

Vue.use(BootstrapVue);

Vue.use(VueLocalForage);
Vue.use(VueMomentJS, moment);
Vue.use(underscore);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
  .$storageConfig({
    driver: VueLocalForage.INDEXEDDB,
    name: 'dailyCurrencyRates',
  });
