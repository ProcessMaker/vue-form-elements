<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <input
      v-bind="$attrs"
      v-uni-id="name"
			:value="internalValue"
			@input="updateInternalValue"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
    >
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import DataFormatMixin from './mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors';
import InputDebounce from '@/components/mixins/InputDebounce';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin, InputDebounce],
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
