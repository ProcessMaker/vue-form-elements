<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <input
    v-uni-id="name"
    :required="required"
    :value="value"
    :placeholder="placeholder"
    :type="type ? type : 'text'"
    :minlength="minlength"
    :maxlength="maxlength"
    :max="max"
    :min="min"
    :name="name"
    :disabled="disabled"
    class="form-control"
    :class="classList"
    @input="updateValue">
      <template v-if="validator && validator.errorCount">
        <div class="invalid-feedback" v-for="(errors, index) in validator.errors.all()" :key="index">
          <div v-for="(error, subIndex) in errors" :key="subIndex">
            {{error}}
          </div>
        </div>
      </template>
      <div class="invalid-feedback" v-if="error">{{error}}</div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>


<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin()
export default {
  mixins: [uniqIdsMixin, ValidationMixin],
  props: [
    'label',
    'error',
    'helper',
    'type',
    'name',
    'minlength',
    'maxlength',
    'required',
    'disabled',
    'placeholder',
    'value',
    'controlClass',
    'max',
    'min'
  ],
  computed:{
    classList(){
      let classList = {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
      }
      if(this.controlClass) {
        classList[this.controlClass] = true
      }
      return classList
    }
  },
  data() {
    return {
      content: '',
      validator: null
    }
  },
  methods: {
   updateValue(e) {
      this.content = e.target.value;
      this.$emit('input', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
