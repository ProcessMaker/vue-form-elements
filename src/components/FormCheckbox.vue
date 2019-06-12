<template>
    <div class="form-group">
        <div :class="divClass">
            <input v-uni-id="name"
                   type="checkbox"
                   :class="classList"
                   :name="name"
                   :disabled="disabled"
                   :required='required'
                   :checked="isChecked"
                   :crop="crop"
                   @change="updateValue">
            <label :class="labelClass" v-uni-for="name"> {{label}} </label>
            <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
                <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
                <div v-if="error">{{error}}</div>
            </div>

            <small v-if="helper" class="form-text text-muted">{{helper}}</small>
        </div>
    </div>
</template>

<script>
  import ValidationMixin from './mixins/validation'
  import {createUniqIdsMixin} from 'vue-uniq-ids'

  // Create the mixin
  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    mixins: [uniqIdsMixin, ValidationMixin],
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: [
      'error',
      'options',
      'disabled',
      'required',
      'label',
      'crop',
      'name',
      'helper',
      'controlClass',
      'toggle',
      'checked',
      'initiallyChecked',
    ],
    computed: {
      isChecked() {
        return this.checked || this.initiallyChecked;
      },
      divClass() {
        return !this.toggle ? 'form-check' : 'custom-control custom-switch';
      },
      labelClass() {
        return !this.toggle ? 'form-check-label' : 'custom-control-label';
      },
      classList() {
        let classList = {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        }
        classList['form-check-input'] = !this.toggle;
        classList['custom-control-input'] = this.toggle;
        if (this.controlClass) {
          classList[this.controlClass] = true
        }
        return classList
      }
    },
    methods: {
      updateValue(event) {
        this.$emit('change', event.target.checked)
      }
    },
  }
</script>
