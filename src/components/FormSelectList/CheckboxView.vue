<template>
  <div :aria-label="$attrs['aria-label']">
    <div v-for="(option, index) in options" :key="getOptionValue(option)" :class="divClass" role="checkbox">
      <input
        v-model="selected"
        v-uni-id="getOptionId(option, index)"
        :class="inputClass"
        type="checkbox"
        :name="`${name}`"
        :value="emitObjects ? option : getOptionValue(option)"
        v-bind="$attrs"
        :disabled="isReadOnly"
        :aria-label="getOptionAriaLabel(option)"
        @change="$emit('input', selected)"
      />
      <label v-uni-for="getOptionId(option, index)" :class="labelClass">
        {{ getOptionContent(option) }}
      </label>
    </div>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import ValidationMixin from "../mixins/validation";

const uniqIdsMixin = createUniqIdsMixin();
export default {
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "value",
    "optionValue",
    "optionContent",
    "optionAriaLabel",
    "options",
    "optionsExtra",
    "error",
    "helper",
    "name",
    "controlClass",
    "emitObjects",
    "emitArray"
  ],
  data() {
    return {
      selected: []
    };
  },
  computed: {
    divClass() {
      return this.toggle ? "custom-control custom-radio" : "form-check";
    },
    labelClass() {
      return this.toggle ? "custom-control-label" : "form-check-label";
    },
    inputClass() {
      return [
        { [this.controlClass]: !!this.controlClass },
        { "is-invalid": (this.validator && this.validator.errorCount) || this.error },
        this.toggle ? "custom-control-input" : "form-check-input"
      ];
    }
  },
  watch: {
    value(value) {
      this.selected = value instanceof Array ? value : [];
    }
  },
  mounted() {
    this.selected = this.value instanceof Array ? this.value : [];
  },
  methods: {
    getOptionValue(option) {
      return option[this.optionValue || "value"];
    },
    getOptionContent(option) {
      return option[this.optionContent || "content"];
    },
    getOptionAriaLabel(option) {
      let ariaLabel = "";
      if (this.optionsExtra?.length) {
        const optionExtra = this.optionsExtra.find(
          (extra) => extra.hasOwnProperty(this.optionValue) && extra[this.optionValue] === option[this.optionValue]
        );
        if (optionExtra) {
          ariaLabel = optionExtra[this.optionAriaLabel || "ariaLabel"] ?? "";
        }
      } else {
        ariaLabel = option[this.optionAriaLabel || "ariaLabel"] ?? "";
      }
      return !ariaLabel || ariaLabel === "" ? this.getOptionContent(option) : ariaLabel;
    },
    getOptionId(option, index) {
      return `${this.name}-${this.getOptionValue(option)}-${index}`;
    }
  }
};
</script>
