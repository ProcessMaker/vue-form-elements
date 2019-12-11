<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <input
      v-bind="$attrs"
      v-uni-id="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
    >
      <template v-if="validator && validator.errorCount">
        <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
          <div v-for="(error, subIndex) in errors" :key="subIndex">
            {{error}}
          </div>
        </div>
      </template>
      <div class="invalid-feedback" v-if="error">{{error}}</div>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import DataFormatMixin from './mixins/DataFormat';

const uniqIdsMixin = createUniqIdsMixin()

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
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
  data() {
    return {
      validator: null
    }
  },
}
</script>
