<template>
  <div class="form-group">
    <label>{{label}}</label>
    <div :class="divClass" :key="option.value" v-for="option in options">
      <input
        v-bind="$attrs"
        type="radio"
        :class="inputClass"
        :value="option.value"
        :checked="option.value === selectedValue"
        v-uni-id="name + option.value"
        @change="$emit('input', $event.target.value)"
      >
      <label :class="labelClass" v-uni-for="name + option.value">{{option.content}}</label>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import {createUniqIdsMixin} from 'vue-uniq-ids'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin],
  props: [
    'name',
    'label',
    'error',
    'value',
    'options',
    'helper',
    'controlClass',
    'toggle'
  ],
  computed: {
    selectedValue() {
      if (!this.value && this.options.length > 0) {
        return this.options[0].value;
      }

      return this.value;
    },
    divClass() {
      return this.toggle ? 'custom-control custom-radio' : 'form-check';
    },
    labelClass() {
      return this.toggle ? 'custom-control-label': 'form-check-label';
    },
    inputClass() {
      return [
        { [this.controlClass]: !!this.controlClass },
        { 'is-invalid': (this.validator && this.validator.errorCount) || this.error },
        this.toggle ? 'custom-control-input' : 'form-check-input'
      ];
    }
  },
}
</script>
