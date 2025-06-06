<template>
  <form>
    <div :class="divClass" :key="getOptionValue(option)" v-for="(option, index) in options">
      <input
          :class="inputClass"
          type="radio"
          v-uni-id="getOptionId(option, index)"
          :name="`${name}`"
          :value="emitObjects ? option : getOptionValue(option)"
          v-model="selected"
          v-bind="$attrs"
          :disabled="isReadOnly"
          :aria-label="getOptionAriaLabel(option)"
      >
      <label :class="labelClass" v-uni-for="getOptionId(option, index)">
        {{getOptionContent(option)}}
      </label>
    </div>
  </form>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids'
import ValidationMixin from '../mixins/validation'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin],
  props: [
    'value',
    'optionValue',
    'optionContent',
    'options',
    'error',
    'helper',
    'name',
    'controlClass',
    'emitObjects',
    'emitArray',
    'optionAriaLabel'
  ],
  data() {
    return {
      selected:[]
    }
  },
  mounted() {
    this.selected = this.value;
  },
  watch: {
    value(val) {
      this.selected = val;
    },
    selected() {
      this.$emit('input', this.selected);
    }
  },
  computed: {
    divClass() {
      return this.toggle ? 'custom-control custom-radio' : 'form-check';
    },
    labelClass() {
      return this.toggle ? 'custom-control-label' : 'form-check-label';
    },
    inputClass() {
      return [
        {[this.controlClass]: !!this.controlClass},
        {'is-invalid': (this.validator && this.validator.errorCount) || this.error},
        this.toggle ? 'custom-control-input' : 'form-check-input'
      ];
    },
  },
  methods: {
    getOptionValue(option) {
      return option[this.optionValue || 'value'];
    },
    getOptionContent(option) {
      return option[this.optionContent || 'content'];
    },
    getOptionAriaLabel(option) {
      const ariaLabel = option[this.optionAriaLabel || "ariaLabel"];
      return (!ariaLabel || ariaLabel === "") ? this.getOptionContent(option) : ariaLabel;
    },
    getOptionId(option, index) {
      return `${this.name}-${this.getOptionValue(option)}-${index}`;
    }
  }
}
</script>
