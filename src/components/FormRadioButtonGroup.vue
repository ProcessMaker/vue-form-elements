<template>
    <div class="form-group">
        <label>{{label}}</label>
        <div :class="divClass" :key="index" v-for="(option, index) in options">
            <input
              type="radio"
              :class="inputClass"
              :name="name"
              :value="option.value"
              :checked="option.value === value"
              v-bind="$attrs"
              v-uni-id="name + option.value"
              @change="updateValue"
            >
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
    inheritAttrs: false,
    mixins: [uniqIdsMixin],
    props: [
      'name',
      'label',
      'error',
      'value',
      'options',
      'helper',
      'controlClass',
      'toggle'
    ],
    computed: {
      divClass() {
        return this.toggle ? 'custom-control custom-radio' : 'form-check';
      },
      labelClass() {
        return this.toggle ? 'custom-control-label': 'form-check-label';
      },
      inputClass() {
        return [
          { [this.controlClass]: !!this.controlClass },
          { 'is-invalid': (this.validator && this.validator.errorCount) || this.error },
          this.toggle ? 'custom-control-input' : 'form-check-input'
        ];
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
    },
  }
</script>
