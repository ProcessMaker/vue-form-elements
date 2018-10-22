require('bootstrap')
import Vue from 'vue';

import 'bootstrap/dist/css/bootstrap.css'

import DemoApp from './DemoApp'

new Vue({
    el: '#app',
    render: h => h(DemoApp)

})