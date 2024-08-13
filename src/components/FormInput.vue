<template>
  <div class="form-group">
    <required-asterisk /><label v-uni-for="name">{{label}}</label>
    <input
      v-bind="$attrs"
      v-uni-id="name"
      :value="value"
      @input="handleInput"
      :name="name"
      class="form-control"
      :class="classList"
      v-on:blur="formatFloatValue()"
    />
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if="helper" class="form-text text-muted" v-html="helper"/>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import DataFormatMixin from './mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors';
import RequiredAsterisk from './common/RequiredAsterisk';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
    RequiredAsterisk,
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'value',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'validateKeyStrokes',
  ],
  data() {
    return {
      validator: null,
    }
  },
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    }
  },
  methods: {
    handleInput(event) {
      if (this.validateKeyStrokes) {
        const allowedVariableRegex = new RegExp(this.validateKeyStrokes);
        if (!allowedVariableRegex.test(event.target.value)) {
          this.$emit("input", this.value);
          event.target.value = this.value;
          return;
        }
      }
      this.$emit("input", event.target.value);
    }
  }
};
</script>
