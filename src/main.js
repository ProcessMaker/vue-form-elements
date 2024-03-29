require('bootstrap')
import Vue from 'vue';
import i18next from 'i18next';
import VueI18Next from '@panter/vue-i18next';
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { Multiselect } from "@processmaker/vue-multiselect";

import 'bootstrap/dist/css/bootstrap.css'

import DemoApp from './DemoApp'

// Allow strings to be wrapped in $t(...) for translating
// outside this package. This standalone app just returns
// the English string
Vue.use(VueI18Next)
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
i18next.init({lng: 'en'})
Vue.mixin({ i18n: new VueI18Next(i18next) })
Vue.component('Multiselect', Multiselect);

new Vue({
    el: '#app',
    render: h => h(DemoApp)
})
