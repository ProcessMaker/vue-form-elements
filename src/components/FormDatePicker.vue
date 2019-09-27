<template>
  <div class="form-group position-relative">
    <label v-uni-for="name">{{label}}</label>
    <date-picker
      :config="config"
      v-model="date"
      :disabled="disabled"
      :placeholder="placeholder"
      :data-test="dataTest"
    />
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
        <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
        <div v-if="error">{{error}}</div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
  </div>
</template>


<script>
  /* global ProcessMaker*/
  import {createUniqIdsMixin} from 'vue-uniq-ids';
  import ValidationMixin from './mixins/validation';
  import DataFormatMixin from "./mixins/DataFormat";
  import datePicker from 'vue-bootstrap-datetimepicker';
  import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
  import moment from 'moment-timezone';

  const uniqIdsMixin = createUniqIdsMixin();

  const datetimeStdFormat = 'YYYY-MM-DDThh:mm:ssZZ';
  const dateStdFormat = 'YYYY-MM-DD';

  export default {
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
      value: String,
      inputClass: {type: [String, Array, Object], default: 'form-control'},
      dataTest: String,
      disabled: null,
    },
    data() {
      return {
        date: null,
        config: {
          format: datetimeStdFormat,
          timeZone: '',
          locale: '',
          useCurrent: false,
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
    watch: {
      dataFormat: {
        immediate: true,
        handler() {
          this.config.format = this.dataFormat === 'datetime' ? this.getUserDateTimeFormat() : this.getUserDateFormat();
          this.date = this.stdValue(this.value);
        }
      },
      value(value) {
        this.date = this.stdValue(value);
      },
      date() {
        if (typeof this.date === "string") {
          this.stdValue(this.value) !== this.stdValue(this.date) ? this.$emit('input', this.stdValue(this.date)) : null;
        }
      }
    },
    methods: {
      getUserDateFormat() {
        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
          return ProcessMaker.user.datetime_format.replace(/ |H|:|m|s|z|Z/g, '');
        } else {
          return "MM/DD/YYYY";
        }
      },
      getUserDateTimeFormat() {
        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
          return ProcessMaker.user.datetime_format;
        } else {
          return "MM/DD/YYYY HH:SS A";
        }
      },
      stdValue (value) {
        return moment(value).format(this.dataFormat === 'datetime' ? datetimeStdFormat : dateStdFormat);
      },
      setTimezone() {
        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
          this.config.timeZone = ProcessMaker.user.timezone || 'local';
        }
      },
      setLang() {
        if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
          this.config.locale = ProcessMaker.user.lang || 'en';
        }
      }
     },
     mounted() {
       this.setTimezone();
       this.setLang();
       this.setDate();
     }
  };
</script>
<style>
  .inspector-container .bootstrap-datetimepicker-widget.dropdown-menu {
    font-size: 11px;
  }
</style>

