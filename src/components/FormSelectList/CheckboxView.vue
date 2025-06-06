<template>
  <div>
    <div :class="divClass" :key="getOptionValue(option)" v-for="(option, index) in options">
      <input
          :class="inputClass"
          type="checkbox"
          v-uni-id="getOptionId(option, index)"
          :name="`${name}`"
          :value="emitObjects ? option : getOptionValue(option)"
          v-model="selected"
          v-bind="$attrs"
          :disabled="isReadOnly"
          :aria-label="getOptionAriaLabel(option)"
          @change="$emit('input', selected)"
      >
      <label :class="labelClass" v-uni-for="getOptionId(option, index)">
        {{getOptionContent(option)}}
      </label>
    </div>
  </div>
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
    'optionAriaLabel',
    'options',
    'optionsExtra',
    'error',
    'helper',
    'name',
    'controlClass',
    'emitObjects',
    'emitArray',
  ],
  data() {
    return {
      selected:[]
    }
  },
  mounted() {
    this.selected = this.value instanceof Array ? this.value : [];
  },
  watch: {
    value(value) {
      this.selected = value instanceof Array ? value : [];
    },
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
      let ariaLabel = '';
      if (this.optionsExtra?.length) {
        const optionExtra = this.optionsExtra.find(extra => 
          extra.hasOwnProperty(this.optionValue) && 
          extra[this.optionValue] === option[this.optionValue]);
        if (optionExtra) {
          ariaLabel = optionExtra[this.optionAriaLabel || "ariaLabel"] ?? '';
        }
      } else {
         ariaLabel = option[this.optionAriaLabel || "ariaLabel"] ?? '';
      }
      return (!ariaLabel || ariaLabel === "") ? this.getOptionContent(option) : ariaLabel;
    },
    getOptionId(option, index) {
      return `${this.name}-${this.getOptionValue(option)}-${index}`;
    }
  }
}
</script>
