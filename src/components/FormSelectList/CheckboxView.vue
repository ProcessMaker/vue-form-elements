<template>
  <div>
    <div :class="divClass" :key="getOptionValue(option)" v-for="option in options">
      <input
          :class="inputClass"
          type="checkbox"
          v-uni-id="getOptionId(option)"
          :name="`${name}`"
          :value="emitObjects ? option : getOptionValue(option)"
          v-model="seleccionados"
      >
      <label :class="labelClass" v-uni-for="getOptionId(option)">
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
    'options',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'emitObjects',
    'emitArray',
  ],
  data() {
    return {
      seleccionados:[]
    }
  },
  mounted() {
  },
  watch: {
    value(val) {
      this.seleccionados = val;
    },
    seleccionados() {
      this.$emit('input', this.seleccionados);
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
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    },
  },
  methods: {
    getOptionValue(option) {
      return option[this.optionValue || 'value'];
    },
    getOptionContent(option) {
      return option[this.optionContent || 'content'];
    },
    getOptionId(option) {
      return `${this.name}-${this.getOptionValue(option)}`;
    }
  }
}
</script>
