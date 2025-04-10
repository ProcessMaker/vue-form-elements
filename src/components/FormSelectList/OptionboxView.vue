<template>
  <form>
    <div v-for="(option, index) in options" :key="getOptionValue(option)" :class="divClass">
      <input
        v-model="selected"
        v-uni-id="getOptionId(option, index)"
        :class="inputClass"
        type="radio"
        :name="`${name}`"
        :value="emitObjects ? option : getOptionValue(option)"
        v-bind="$attrs"
        :disabled="isReadOnly"
        :aria-label="getOptionAriaLabel(option)"
      />
      <label v-uni-for="getOptionId(option, index)" :class="labelClass">
        {{ getOptionContent(option) }}
      </label>
    </div>
  </form>
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
    "options",
    "optionsExtra",
    "error",
    "helper",
    "name",
    "controlClass",
    "emitObjects",
    "emitArray",
    "optionAriaLabel"
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
    value(val) {
      this.selected = val;
    },
    selected() {
      this.$emit("input", this.selected);
    }
  },
  mounted() {
    this.selected = this.value;
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
