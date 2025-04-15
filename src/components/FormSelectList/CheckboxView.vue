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
    "emitArray"
  ],
  data() {
    return {
      selected: []
    };
  },
  watch: {
    value(value) {
      this.selected = value instanceof Array ? value : [];
    }
  },
  mounted() {
    this.selected = this.value instanceof Array ? this.value : [];
  }
};
</script>
