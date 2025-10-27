<template>
  <div :aria-label="$attrs['aria-label']">
    <div v-for="(option, index) in options" :key="getOptionValue(option)" :class="divClass" role="radio">
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
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import ValidationMixin from "../mixins/validation";
import checkbox from "../mixins/checkbox";

const uniqIdsMixin = createUniqIdsMixin();

export default {
  mixins: [uniqIdsMixin, ValidationMixin, checkbox],
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
    "emitArray",
    "allowMultiselect"
  ],
  data() {
    return {
      selected: []
    };
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
  }
};
</script>
