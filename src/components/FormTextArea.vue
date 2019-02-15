<template>
  <div class='form-group'>
  <label v-uni-for='label'>{{label}}</label>
    <textarea
    ref="field"
    v-uni-id='label'
    :placeholder='placeholder'
    class='form-control'
    :class="classList"
    :rows='rows'
    :cols='cols'
    :required='required'
    :maxlength='maxlength'
    :name='name'
    :wrap='wrap'
    :disabled="disabled"
    @input='updateValue'
    :value.prop="value"></textarea>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if='helper' class='form-text text-muted'>{{helper}}</small>
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
    'rows',
    'cols',
    'name',
    'wrap',
    'required',
    'placeholder',
    'maxlength',
    'value',
    'helper',
    'disabled',
    'controlClass'
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
    }
  },
  watch: {
    value() {
      this.$refs.field.value = this.value;
      return this.value;
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

<style lang='scss' scoped>

</style>
