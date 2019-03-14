<template>
    <div class="form-group">
        <label>{{label}}</label>
        <div :class="divClass" :key="index" v-for="(option, index) in options">
            <input :class="classList"
                   type="radio"
                   :name="name"
                   :disabled="disabled"
                   :required='required'
                   v-uni-id="name + option.value"
                   :value="option.value"
                   @change="updateValue"
                   :checked="options.value = checked">
            <label :class="labelClass" v-uni-for="name + option.value">{{option.content}}</label>
        </div>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<script>
  import {createUniqIdsMixin} from 'vue-uniq-ids'
  // Create the mixin
  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    mixins: [uniqIdsMixin],
    props: [
      'error',
      'checked',
      'value',
      'options',
      'disabled',
      'required',
      'label',
      'name',
      'helper',
      'controlClass',
      'toggle'
    ],
    computed: {
      divClass() {
        return !this.toggle ? 'form-check' : 'custom-control custom-radio';
      },
      labelClass() {
        return !this.toggle ? 'form-check-label' : 'custom-control-label';
      },
      classList() {
        let classList = {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        };
        classList['form-check-input'] = !this.toggle;
        classList['custom-control-input'] = this.toggle;
        if (this.controlClass) {
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
        this.content = e.target.value;
        this.$emit('input', this.content)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>