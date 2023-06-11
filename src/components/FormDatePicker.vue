<template>
  <div class="form-group position-relative">
    <required-asterisk /><label v-uni-for="name" class="mr-2">{{ label }}</label>
    <date-pick
      v-model="date"
      v-bind="datePickerConfig"
      :data-test="dataTest"
      :input-attributes="inputAttributes"
      class="datePicker"
      @input="submitDate"
    >
    </date-pick>
    <div v-if="errors.length > 0" class="invalid-feedback d-block">
      <div v-for="(err, index) in errors" :key="index">{{ err }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{
      helper
    }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import moment from "moment-timezone";
import Mustache from "mustache";
import DatePicker from "./DatePicker.vue";
import ValidationMixin from "./mixins/validation";
import DataFormatMixin from "./mixins/DataFormat";
import { getUserDateFormat, getUserDateTimeFormat, getTimezone } from "../dateUtils";
import "vue-date-pick/dist/vueDatePick.css";
import RequiredAsterisk from './common/RequiredAsterisk';

const Validator = require("validatorjs");

const uniqIdsMixin = createUniqIdsMixin();
const checkFormats = ["YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601];

Validator.register(
  "date_or_mustache",
  function (value, requirement, attribute) {
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

    if (value === "") {
      // Empty is ok, it just disables min/max
      return true;
    }

    return moment(value, checkFormats, true).isValid();
  },
  "Must be YYYY-MM-DD, ISO8601, or mustache syntax"
);

export default {
  components: {
    "date-pick": DatePicker,
    RequiredAsterisk,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: {
    name: String,
    placeholder: String,
    label: String,
    error: {
      type: [String, Boolean]
    },
    helper: String,
    dataFormat: String,
    value: {
      type: [String, Object, Boolean, Date]
    },
    ariaLabel: String,
    tabIndex: Number,
    inputClass: { type: [String, Array, Object], default: "form-control" },
    dataTest: {
      type: String,
      default: "date-picker"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    minDate: { type: [String, Boolean], default: false },
    maxDate: { type: [String, Boolean], default: false }
  },
  data() {
    return {
      validatorErrors: [],
      date: "",
      inputAttributes: {
        class: `${this.inputClass}`,
        placeholder: this.placeholder,
        name: this.name,
        "aria-label": this.ariaLabel,
        "tab-index": this.tabIndex,
        disabled: this.disabled,
        readonly: this.readonly
      },
      onChangeDate: ""
    };
  },
  computed: {
    datePickerConfig() {
      return {
        format: this.datepicker ? "MM/DD/YYYY hh:mm a" : "MM/DD/YYYY",
        displayFormat: this.format,
        pickTime: this.datepicker,
        // parseDate: this.parsingInputDate,
        editable: !this.disabled,
        use12HourClock: this.datepicker,
        isDateDisabled: this.checkMinMaxDateDisabled
      };
    },
    datepicker() {
      return this.dataFormat === "datetime";
    },
    format() {
      return this.datepicker ? getUserDateTimeFormat() : getUserDateFormat();
    },
    classList() {
      return {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error
      };
    },
    errors() {
      if (this.error) {
        return [...this.validatorErrors, this.error];
      }
      return this.validatorErrors;
    }
  },
  watch: {
    validator: {
      deep: true,
      handler() {
        this.validatorErrors =
          this.validator && this.validator.errors.get(this.name)
            ? this.validator.errors.get(this.name)
            : [];
      }
    }
  },
  created() {
    Validator.register(
      "after_min_date",
      (value, requirement, attribute) => {
        return (
          this.parseDate(value) >=
          this.parseDate(this.minDate)
        );
      },
      "Must be after or equal Minimum Date"
    );
    // set to the browser's timezone because the vue-date-pick always works
    // with the browser's timezone
    moment.tz.setDefault(getTimezone());
    this.updateValue(this.value);
  },
  methods: {
    /**
     * Updates the defaultValue on re-render or reassignment
     * @param {string|Object} newValue
     * @return {string | void}
     */
    updateValue(newValue) {
      if (!!newValue && newValue.length > 0) {
        const date = moment.tz(newValue, checkFormats, getTimezone());
        console.log(`date${this.datepicker ? 'time' : ''}`, date);
        if (!date.isValid()) return "";
        this.date = date.format(this.format);
      }
    },
    /**
     * Parses the date when is a Mustache string
     * @param {string} val
     * @return {boolean|moment.Moment}
     */
    parseDate(val) {
      let date = false;

      if (typeof val === "string" && val !== "") {
        try {
          date = Mustache.render(val, this.validationData);
        } catch (error) {
          date = val;
        }

        date = moment.tz(date, [...checkFormats,  this.format], true, getTimezone());
        console.log('date', date);
        if (!date.isValid()) {
          date = false;
        }
      }

      return date;
    },
    /**
     * Parses the date for available formats for Min and Max Dates
     * @param {string | MomentInput} val
     * @return {string | boolean | moment.MomentInput | Date}
     */
    parseDateToDate(val) {
      let date = "";

      if (typeof val === "string" && val !== "") {
        try {
          date = Mustache.render(val, this.validationData);
        } catch (error) {
          date = val;
        }

        date = moment(date, checkFormats, true);
        if (!date.isValid()) {
          date = "";
        } else {
          date = date.toDate();
        }
      }

      return date;
    },
    /**
    Function to be used for the DatePicker, to see if minDate and maxDate are
    1. Valid
    2. Within the range
    In the datepicker itself, this goes through a for loop to check if the dates that the user is seeing, are valid and
    acceptable
    @param {string, Date | undefined} date
    @returns {boolean | void}
     */
    checkMinMaxDateDisabled(date) {
      const minDate = !!this.minDate ? this.parseDateToDate(this.minDate) : "";
      const maxDate = !!this.maxDate ? this.parseDateToDate(this.maxDate) : "";
      // If minDate and maxDate are not defined, return. This would be the default case
      if (minDate.length === 0 && maxDate.length === 0) return;
      if (!!minDate && !!maxDate) {
        return !(date >= minDate && date <= maxDate);
      }
      // If minDate is defined but maxDate not defined, block the dates before minDate is defined
      if (!!minDate && maxDate.length === 0) return date < minDate;
      // If maxDate is defined but minDate not defined, block the dates after maxDate is defined
      if (minDate.length === 0 && !!maxDate) return date > maxDate;
    },
    /**
     * Check if the Date and Value in `this` is the same
     * @return {boolean}
     */
    isDateAndValueTheSame() {
      if (!this.date && !this.value) {
        return true;
      }

      const currentDate = moment(this.date, this.datePickerConfig.format);
      const currentValue = this.value ? moment(this.value) : null;
      const comparatorString = this.dataFormat !== "datetime" ? "day" : null;

      return currentDate.isSame(currentValue, comparatorString);
    },
    /**
     * @param {string} value
     * @return {(null|void)}
     */
    submitDate(value) {
      // if default value is defined, trigger an update for the Data Preview
      if (this.value && !this.date) {
        this.$emit("input", "");
      }

      if (this.isDateAndValueTheSame()) return;

      console.log('val', value);

      /** @type {moment.Moment} */

      const parsedDate = this.parseDate(value);

      if (!parsedDate) return;

      if (!parsedDate.isValid()) return;

      // // Check if the date that the user inputted, is valid against the minDate set
      if (parsedDate.isBefore(this.parseDateToDate(this.minDate))) return null;
      // // Check if the date that the user inputted, is valid against the maxDate set
      if (parsedDate.isAfter(moment(this.parseDateToDate(this.maxDate)))) return null;
      if (this.dataFormat === "datetime") {
        this.$emit("input", parsedDate.utc().format());
      } else {
        this.$emit("input", parsedDate.format(this.format));
      }
    }
  }
};
</script>

<style>
.vdpHeadCell {
  padding: 0.3em 0.4em 1.8em;
}
.datePicker {
  display: block !important;
}
.vdpOuterWrap.vdpFloating {
  z-index: 5;
}
</style>
