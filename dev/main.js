import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import DemoApp from './DemoApp.vue';
import VueFormElements from '@/entry.esm';

import 'bootstrap/dist/css/bootstrap.min.css';

require('bootstrap');

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next);
Vue.use(VueFormElements);

i18next.init({ lng: 'en' });
Vue.mixin({ i18n: new VueI18Next(i18next) });

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(DemoApp)
}).$mount('#app');
