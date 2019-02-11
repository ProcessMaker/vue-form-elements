<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <v-date-picker :value="content" @input="updateValue" :input-props='{ class: "form-control", placeholder: placeholder, readonly: true }' />
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>


<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import ValidationMixin from "./mixins/validation";
import { setupCalendar, DatePicker} from 'v-calendar'

import "v-calendar/lib/v-calendar.min.css";


setupCalendar();

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();
export default {
  mixins: [uniqIdsMixin, ValidationMixin],
  components: {
    'v-date-picker': DatePicker
  },
  props: [
    "label",
    "error",
    "helper",
    "type",
    "name",
    "minlength",
    "maxlength",
    "required",
    "disabled",
    "placeholder",
    "value",
    "controlClass"
  ],
  computed: {
    classList() {
      let classList = {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error
      };
      if (this.controlClass) {
        classList[this.controlClass] = true;
      }
      return classList;
    }
  },
  data() {
    return {
      content: this.parseDateFromValue(),
      validator: null
    };
  },
  watch: {
    value() {
      this.content = this.parseDateFromValue()
    }
  },
  methods: {
    parseDateFromValue() {
      let value = new Date(this.value)
      // Check if value is a valid date
      if(isNaN(value)) {
        return null
      }
      return value
    },
    updateValue(newDate) {
      this.$emit("input", newDate.toISOString());
    }
  }
};
</script>

<style lang="scss" scoped>
</style>