<template>
    <div class="form-group position-relative">
        <label v-uni-for="name">{{label}}</label>
        <date-picker
              :config="config"
              :value="date"
              @input="setDate"
              :disabled="disabled"
              :placeholder="placeholder"
              :data-test="dataTest"
        />
        <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
            <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
            <div v-if="error">{{error}}</div>
        </div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids';
import ValidationMixin from './mixins/validation';
import DataFormatMixin from "./mixins/DataFormat";
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import moment from 'moment-timezone';
import {getLang, getTimezone, getUserDateFormat, getUserDateTimeFormat} from '../dateUtils';

const uniqIdsMixin = createUniqIdsMixin();
const datetimeStdFormat = 'YYYY-MM-DDTHH:mm:ssZZ';

export default {
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  components: {
    datePicker
  },
  props: {
    emitIso: Boolean,
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
        timeZone: getTimezone(),
        locale: getLang(),
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
        this.config.format = this.dataFormat === 'datetime'
          ? getUserDateTimeFormat()
          : getUserDateFormat();

        this.date = moment(this.value).tz(this.config.timeZone);
      }
    },
    value(value) {
      this.date = moment(value).tz(this.config.timeZone);
    },
  },
  methods: {
    setDate(date) {
      const currentDate = moment(this.date).tz(this.config.timeZone)
      const newDate = moment.tz(moment(date).format('YYYY-MM-DDTHH:mm:ss'), 'YYYY-MM-DDTHH:mm:ss', this.config.timeZone);

      if (newDate.isSame(currentDate, 'minute')) {
        return;
      }

      this.date = newDate;
      this.$emit('input', this.emitIso ? newDate.toISOString() : newDate.format(this.config.format));
    }
  },
};
</script>

<style>
    .inspector-container .bootstrap-datetimepicker-widget.dropdown-menu {
        font-size: 11px;
    }
</style>
