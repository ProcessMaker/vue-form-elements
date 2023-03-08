<template>
  <div class="form-group position-relative">
    <label v-uni-for="name" class="mr-2">{{ label }}</label>
    <date-pick
      v-model="date"
      v-bind="config"
      :format="format"
      :data-test="dataTest"
      :class="classList"
      :input-attributes="inputAttributes"
      @input="submitDate"
    >
      <template v-slot:default="{ open, inputValue, inputAttributes }">
        <input
          type="text"
          v-bind="inputAttributes"
          :value="inputValue"
          class="form-control"
          @focus="onOpen(open)"
          @click="onOpen(open)"
          @change="onChangeHandler($event.target.value)"
        />
        <button
          v-if="date"
          type="button"
          @click="clear"
          class="vdpClearInput"
        ></button>
      </template>
    </date-pick>
    <div v-if="errors.length > 0" class="invalid-feedback d-block">
      <div v-for="(err, index) in errors" :key="index">{{ err }}</div>
    </div>
    <small v-if="helper" v-once class="form-text text-muted">{{
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
import { getUserDateFormat, getUserDateTimeFormat } from "../dateUtils";
import "vue-date-pick/dist/vueDatePick.css";

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
    "date-pick": DatePicker
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: {
    name: String,
    placeholder: String,
    label: String,
    error: String,
    helper: String,
    dataFormat: String,
    value: [String, Boolean, Date],
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
    minDate: { type: [String, Boolean], default: false },
    maxDate: { type: [String, Boolean], default: false }
  },
  data() {
    return {
      validatorErrors: [],
      date:
        !!this.value && this.value.length > 0
          ? this.parsingInputDate(this.value)
          : "",
      inputAttributes: {
        class: `${this.inputClass}`,
        placeholder: this.placeholder,
        name: this.name,
        "aria-label": this.ariaLabel,
        "tab-index": this.tabIndex
      },
      onChangeDate: ""
    };
  },
  computed: {
    config() {
      return {
        format: this.format,
        displayFormat: this.format,
        pickTime: this.datepicker,

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
          this.parseDate(value, checkFormats) >=
          this.parseDate(this.minDate, checkFormats)
        );
      },
      "Must be after or equal Minimum Date"
    );
  },
  methods: {
    parseDate(val, format) {
      let date = false;

      if (typeof val === "string" && val !== "") {
        try {
          date = Mustache.render(val, this.validationData);
        } catch (error) {
          date = val;
        }

        date = moment(date, format, true);
        if (!date.isValid()) {
          date = false;
        }
      }

      return date;
    },
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
    parsingInputDate(val) {
      debugger;
      const date = moment(val, this.format, true);
      // Check if user is typing, if the date is not valid, let the user continue
      if (!date.isValid()) return "";
      return date.toDate();
    },
    /*
    Function to be used for the DatePicker, to see if minDate and maxDate are
    1. Valid
    2. Within the range
    In the datepicker itself, this goes through a for loop to check if the dates that the user is seeing, are valid and
    acceptable
    @param {string, Date} date
    @returns {boolean}
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
    isDateAndValueTheSame() {
      if (!this.date && !this.value) {
        return true;
      }

      const currentDate = moment(this.date, this.config.format);
      const currentValue = this.value ? moment(this.value) : null;
      const comparatorString = this.dataFormat !== "datetime" ? "day" : null;

      return currentDate.isSame(currentValue, comparatorString);
    },
    submitDate() {
      if (this.onChangeDate !== "") {
        this.date = this.onChangeDate;
      }
      if (this.value && !this.date) {
        this.$emit("input", "");
      }

      if (this.isDateAndValueTheSame()) return;
      const newDate =
        this.dataFormat === "date"
          ? moment.utc(this.date, this.config.format)
          : moment(this.date, this.config.format);
      // Check if the date that the user inputted, is valid against the minDate set
      if (newDate < this.parseDateToDate(this.minDate)) return null;
      // Check if the date that the user inputted, is valid against the maxDate set
      if (this.parseDateToDate(this.maxDate) > newDate) return null;
      this.$emit("input", newDate.toISOString());
    },
    onOpen(open) {
      this.onChangeDate = "";
      if (typeof open === "function") {
        open();
      }
    },
    clear() {
      this.date = "";
    },
    onChangeHandler(userText) {
      if (userText) {
        const userDate = moment(userText, [...checkFormats, this.format], true);
        if (userDate.isValid()) {
          this.onChangeDate = userDate.format(this.format);
          this.submitDate();
        }
      }
    }
  }
};
</script>

<style>
.vdpHeadCell {
  padding: 0.3em 0.4em 1.8em;
}
</style>
