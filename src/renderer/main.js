import Vue from 'vue'
import App from './App'
import BootstrapVue from 'bootstrap-vue'

import '@/assets/app.scss'

Vue.use(BootstrapVue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    components: {App},
    template: '<App/>',
}).$mount('#app')
