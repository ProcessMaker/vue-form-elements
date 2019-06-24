<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <select
    v-uni-id="name"
    class="form-control"
    :class="classList"
    :multiple='multiple'
    :disabled='disabled'
    :required='required'
    :name='name'
    :size='size'
    @change="updateValue">
        <option
        :selected="option.value == value"
        :value="option.value"
        :key="index"
        v-for="(option, index) in options">
        {{option.content}}
        </option>
    </select>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>


<script>
import ValidationMixin from './mixins/validation'
import { createUniqIdsMixin } from 'vue-uniq-ids'
import DataFormatMixin from './mixins/DataFormat';

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin()

export default {
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'label',
    'error',
    'selected',
    'value',
    'options',
    'helper',
    'disabled',
    'required',
    'size',
    'name',
    'controlClass',
    'multiple'
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
  mounted() {
    // Check to see if we already have a value set, if not, set it to first option
    // Also check if we have at least one option available
    if(!this.value && this.options) {
      this.content = this.options[0].value;
      this.$emit('input', this.content)
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
