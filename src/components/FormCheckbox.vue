<template>
  <div class="form-group">
  <div class="form-check">
    <input
    v-uni-id="name"
    type="checkbox"
    class="form-check-input"
    :class="{'is-invalid': error, classList}"
    :name="name"
    :disabled="disabled"
    :required='required'
    :checked="checked"
    :crop="crop"
    @change="updateValue">
    <label class="form-check-label" v-uni-for="name">
    {{label}}</label>
    <div v-if="error" class="invalid-feedback">{{error}}</div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
// Create the mixin
const uniqIdsMixin = createUniqIdsMixin()
export default {
  mixins: [uniqIdsMixin],
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: [
    'error',
    'checked',
    'options',
    'disabled',
    'required',
    'label',
    'crop',
    'name',
    'helper',
    'controlClass'
  ],
  computed:{
    classList(){
      let classList = {}
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
  methods: {
    updateValue(e) {
      this.content = e.target.checked;
      this.$emit('change', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>