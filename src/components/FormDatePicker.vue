<template>
  <div class="form-group position-relative">
    <label v-uni-for="name" class="mr-2">{{ label }}</label>
    <date-pick
      v-model="date"
      v-bind="config"
      :placeholder="placeholder"
      :data-test="dataTest"
      :aria-label="$attrs['aria-label']"
      :tabindex="$attrs['tabindex']"
      :class="classList"
    />
    <div v-if="errors.length > 0" class="invalid-feedback d-block">
      <div v-for="(err, index) in errors" :key="index">{{ err }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import DatePick from "vue-date-pick";
import moment from "moment-timezone";
import Mustache from "mustache";
import ValidationMixin from "./mixins/validation";
import DataFormatMixin from "./mixins/DataFormat";
import { getUserDateFormat, getUserDateTimeFormat } from "../dateUtils";
import "vue-date-pick/dist/vueDatePick.css";

const Validator = require("validatorjs");

const uniqIdsMixin = createUniqIdsMixin();
const checkFormats = ["YYYY-MM-DD", moment.ISO_8601];

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
    DatePick
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
    inputClass: { type: [String, Array, Object], default: "form-control" },
    dataTest: String,
    disabled: null,
    minDate: { type: [String, Boolean], default: false },
    maxDate: { type: [String, Boolean], default: false }
  },
  data() {
    return {
      validatorErrors: [],
      date: ""
    };
  },
  computed: {
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
    },
    config() {
      return {
        format:
          this.dataFormat === "datetime"
            ? getUserDateTimeFormat()
            : getUserDateFormat(),
        locale: getLang(),
        useCurrent: false,
        showClose: true,
        minDate: this.parseDate(this.minDate),
        maxDate: this.checkValidMaxDate(),
        icons: {
          time: "far fa-clock",
          date: "far fa-calendar",
          up: "fas fa-arrow-up",
          down: "fas fa-arrow-down",
          previous: "fas fa-chevron-left",
          next: "fas fa-chevron-right",
          today: "fas fa-calendar-check",
          clear: "far fa-trash-alt",
          close: "far fa-times-circle"
        }
      };
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
    },
    date() {
      if (this.value && !this.date) {
        this.$emit("input", "");
      }

      if (this.isDateAndValueTheSame()) {
        return;
      }

      const newDate =
        this.dataFormat === "date"
          ? moment.utc(this.date, this.config.format)
          : moment(this.date, this.config.format);

      this.$emit("input", newDate.toISOString());
    },
    value() {
      if (!this.value) {
        this.date = "";
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
          : "";
      }
    }
  },
  created() {
    Validator.register(
      "after_min_date",
      (value, requirement, attribute) => {
        return this.parseDate(value) >= this.parseDate(this.minDate);
      },
      "Must be after or equal Minimum Date"
    );
  },
  methods: {
    checkValidMaxDate() {
      if (this.minDate === "") {
        return this.parseDate(this.maxDate);
      }
      if (this.parseDate(this.maxDate) >= this.parseDate(this.minDate)) {
        return this.parseDate(this.maxDate);
      }
      return false;
    },
    parseDate(val) {
      let date = false;

      if (typeof val === "string" && val !== "") {
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
      const comparatorString = this.dataFormat !== "datetime" ? "day" : null;

      return currentDate.isSame(currentValue, comparatorString);
    },
    generateDate(value = this.value) {
      let date = moment(value);

      if (!date.isValid()) {
        date = moment();
      }

      return date;
    }
  }
};
</script>
