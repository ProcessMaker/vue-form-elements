<template>
  <div class="form-group position-relative">
    <label v-uni-for="name">{{label}}</label>
    <date-picker
      v-model="date"
      :config="config"
      :disabled="disabled"
      :placeholder="placeholder"
      :data-test="dataTest"
      :aria-label="$attrs['aria-label']"
      :tabindex="$attrs['tabindex']"
    />
    <div v-if="errors.length > 0" class="invalid-feedback d-block">
      <div v-for="(error, index) in errors" :key="index">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import ValidationMixin from './mixins/validation';
import DataFormatMixin from "./mixins/DataFormat";
import datePicker from 'vue-bootstrap-datetimepicker';
import moment from 'moment-timezone';
import { getLang, getUserDateFormat, getUserDateTimeFormat } from '../dateUtils';
import Mustache from 'mustache';
let Validator = require('validatorjs');

const uniqIdsMixin = createUniqIdsMixin();
const checkFormats = ['YYYY-MM-DD', moment.ISO_8601];

Validator.register('date_or_mustache', function(value, requirement, attribute) {
  let rendered = null;
  try {
    // Clear out any mustache statements
    rendered = Mustache.render(value, {});
  } catch (e) {
    rendered = value;
  }

  if (value !== rendered) {
    // contains mustache, so just give them the benefit of the doubt here
    return true;
  }

  if (value === '') {
    // Empty is ok, it just disables min/max
    return true;
  }

  if (moment(value, checkFormats, true).isValid()) {
    return true;
  }

  return false;

}, 'Must be YYYY-MM-DD, ISO8601, or mustache syntax');

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
    value: [String, Boolean, Date],
    inputClass: {type: [String, Array, Object], default: 'form-control'},
    dataTest: String,
    disabled: null,
    minDate: { type: [String, Boolean], default: false },
    maxDate: { type: [String, Boolean], default: false },
  },
  data() {
    return {
      validatorErrors: [],
      date: null,
    }
  },
  computed: {
    errors() {
      if (this.error) {
        return [...this.validatorErrors, this.error];
      }

      return this.validatorErrors;
    },
    config() {
      return {
        format: this.dataFormat === 'datetime' ? getUserDateTimeFormat() : getUserDateFormat(),
        locale: getLang(),
        useCurrent: false,
        showClose: true,
        minDate: this.parseDate(this.minDate),
        maxDate: this.parseDate(this.maxDate),
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
      };
    },
  },
  watch: {
    validator: {
      deep: true,
      handler() {
        this.validatorErrors = this.validator && this.validator.errors.get(this.name)
          ? this.validator.errors.get(this.name)
          : [];
      },
    },
    date() {
      if (this.value && !this.date) {
        this.$emit('input', '');
      }

      if (this.isDateAndValueTheSame()) {
        return;
      }

      const newDate = this.dataFormat === 'date' ? moment.utc(this.date, this.config.format) : moment(this.date, this.config.format);

      this.$emit('input', newDate.toISOString());
    },
    value() {
      if (!this.value) {
        this.date = '';
        return;
      }

      const newDate = this.generateDate(this.value);

      if (!this.isDateAndValueTheSame()) {
        this.date = newDate.format(this.config.format);
      }
    },
    dataFormat: {
      immediate: true,
      handler() {
        this.date = this.value
          ? this.generateDate().format(this.config.format)
          : '';
      }
    },
  },
  methods: {
    parseDate(val) {
      let date = false;

      if (typeof val === 'string' && val !== '') {

        try {
          date = Mustache.render(val, this.validationData);
        } catch (error) {
          date = val;
        }

        date = moment(date, checkFormats, true);
        if (!date.isValid()) {
          date = false;
        }
      }

      return date;
    },
    isDateAndValueTheSame() {
      if (!this.date && !this.value) {
        return true;
      }

      const currentDate = moment(this.date, this.config.format);
      const currentValue = this.value ? moment(this.value) : null;
      const comparatorString = this.dataFormat !== 'datetime' ? 'day' : null;

      return currentDate.isSame(currentValue, comparatorString);
    },
    generateDate(value = this.value) {
      let date = moment(value);

      if (!date.isValid()) {
        date = moment();
      }

      return date;
    },
  },
};
</script>

<style>
  @import '~pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

  .inspector-container .bootstrap-datetimepicker-widget.dropdown-menu {
    font-size: 11px;
  }
</style>
