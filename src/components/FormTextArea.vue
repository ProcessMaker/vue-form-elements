<template>
  <div class="form-group">
  <label v-uni-for="label">{{label}}</label>
    <textarea
      v-bind="$attrs"
      v-uni-id="label"
      class="form-control"
      :class="classList"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if='helper' class='form-text text-muted'>{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import ValidationMixin from './mixins/validation';
import DataFormatMixin from './mixins/DataFormat';

const uniqIdsMixin = createUniqIdsMixin()

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'label',
    'error',
    'name',
    'value',
    'helper',
    'controlClass'
  ],
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
}
</script>
