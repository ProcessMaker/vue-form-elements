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
    :name="name"
    :disabled="disabled"
    class="form-control"
    :class="classList"
    @input="updateValue">
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
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
  ],
  computed:{
    classList(){
      let classList = {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error, 
      }
      if(this.controlClass){
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