<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <select
      v-bind="$attrs"
      v-uni-id="name"
      class="form-control"
      :class="classList"
      :name='name'
      @change="$emit('input', $event.target.value)"
    >
      <option
        v-for="(option, index) in options"
        :selected="option.value == value"
        :value="option.value"
        :key="index"
      >
        {{option.content}}
      </option>
    </select>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import ValidationMixin from './mixins/validation';
import { createUniqIdsMixin } from 'vue-uniq-ids';
import DataFormatMixin from './mixins/DataFormat';

const uniqIdsMixin = createUniqIdsMixin()

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'label',
    'error',
    'value',
    'options',
    'helper',
    'name',
    'controlClass',
  ],
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  mounted() {
    // Check to see if we already have a value set, if not, set it to first option
    // Also check if we have at least one option available
    if (!this.value && this.options) {
      this.content = this.options[0].value;
      this.$emit('input', this.content);
    }

  },
}
</script>
