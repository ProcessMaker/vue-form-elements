<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <date-picker :config="config"
                 v-model="date"
                 :disabled="$attrs.disabled"
                 :placeholder="placeholder"
                 :data-test="$attrs['data-test']"
    ></date-picker>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
        <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
        <div v-if="error">{{error}}</div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>


<script>
  /* global ProcessMaker*/
  import {createUniqIdsMixin} from 'vue-uniq-ids';
  import ValidationMixin from './mixins/validation';
  import {Datetime} from 'vue-datetime';
  import 'vue-datetime/dist/vue-datetime.css'
  import DataFormatMixin from "./mixins/DataFormat";

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
    components: {
      datetime: Datetime
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
    },
    data() {
      return {
        date: null,
        config: {
          format: '',
          timeZone: '',
          locale: '',
          useCurrent: false,
          showClear: true,
          showClose: true,
          widgetParent: '.page',
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
      dataFormat() {
        this.updateFormat();
      },
      value() {
        this.setDate();
      },
      date() {
        if (typeof this.date === "string") {
          this.$emit('input', this.date);
        }
      }
    },
    methods: {
      updateFormat() {
        if (this.dataFormat === 'datetime') {
          this.config.format = 'MM/DD/YYYY h:mm A';
        } else  {
          this.config.format = 'MM/DD/YYYY';
        }

        if (typeof this.phrases === "object") {
          try {
            return this.phrases;
          } catch (e) {
            // Ignore string, use default prop
          }
        }

        return {ok: 'Continue', cancel: 'Exit'};
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
      },
      setDate() {
        this.date = moment(this.value);
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

