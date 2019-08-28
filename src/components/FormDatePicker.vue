<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <date-picker ref="datePicker"
            v-model="date"
            v-on="$listeners"
            v-bind="$attrs"
            :config="configs" 
            :class="{inputClass, 'is-invalid' : validator}"
            :placeholder="placeholder"
            :change="this.update()"
    ></date-picker>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
        <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
        <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>


<script>
  /* global ProcessMaker*/
  import {createUniqIdsMixin} from 'vue-uniq-ids';
  import ValidationMixin from './mixins/validation';
  import DataFormatMixin from "./mixins/DataFormat";
  import 'bootstrap/dist/css/bootstrap.css';
  import datePicker from 'vue-bootstrap-datetimepicker';
  import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
    components: {
      datePicker
    },
    props: {
      name: String,
      placeholder: String,
      label: String,
      error: String,
      helper: String,
      dataFormat: String,
      inputClass: {type: [String, Array, Object], default: 'form-control'},
    },
    data() {
      return {
        date: null,
        configs: {
          format: '',
          timeZone: '',
          locale: '',
          useCurrent:false,
          showClear: true,
          showClose: true,
          icons: {
            time: 'far fa-clock',
            date: 'far fa-calendar',
            up: 'fas fa-arrow-up',
            down: 'fas fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fas fa-calendar-check',
            clear: 'far fa-trash-alt',
            close: 'far fa-times-circle'
          }
        },
      }
    },
    methods: {
      update() {
        if (this.dataFormat === 'datetime') {
          this.configs.format = 'MM/DD/YYYY h:mm:ss A';
        } else {
          this.configs.format = 'MM/DD/YYYY';
        }

        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
          if (ProcessMaker.user.timezone) {
            this.configs.timeZone = ProcessMaker.user.timezone;
          }  else  {
            this.configs.timeZone = 'local';
          }
          
          if (ProcessMaker.user.app_timezone) {
            this.configs.timeZone = ProcessMaker.user.app_timezone;
          } else  {
            this.configs.timeZone = 'UTC';  
          }
        }

        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.lang) {
          this.configs.locale = ProcessMaker.user.lang;
        } else  {
          this.configs.locale = 'en';
        }
      }
    },
  };
</script>
