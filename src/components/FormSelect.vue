<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>

    <select
      v-if="options.renderAs === 'dropdown'"
      v-bind="$attrs"
      v-uni-id="name"
      class="form-control"
      :class="classList"
      :name='name'
      @change="$emit('input', $event.target.value)"
    >
      <option :value="null">Select</option>
      <option
        v-for="(option, index) in options.jsonData"
        :selected="option.value == value"
        :value="option.value"
        :key="index"
      >
        {{option.content}}
      </option>
    </select>

    <div>
      <div :class="divClass" :key="option.value" v-for="option in options.jsonData">
        <input
          v-bind="$attrs"
          type="checkbox"
          :class="inputClass"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :checked="option.value == selectedValue"
          @change="$emit('input', $event.target.value)"
        >
        <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
      </div>
   </div>


    <div>
      <div :class="divClass" :key="option.value" v-for="option in options.jsonData">
        <input
          v-bind="$attrs"
          type="radio"
          :class="inputClass"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :checked="option.value == selectedValue"
          @change="$emit('input', $event.target.value)"
        >
        <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
      </div>
    </div>

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

const uniqIdsMixin = createUniqIdsMixin()

function removeInvalidOptions(option) {
  return Object.keys(option).includes('value', 'contemnt') &&
    option.content != null;
}

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],
  props: [
    'label',
    'error',
    'value',
    'options',
    'helper',
    'name',
    'controlClass',
    'validationData',
  ],
  computed:{
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    },
    selectOptions() {
      if (Array.isArray(this.options)) {
        return this.options;
      }

      return this.optionsFromDataSource;
    },
    optionsFromDataSource() {
      const { jsonData, key, value, dataName, renderAs } = this.options;

      let options = [];

      const convertToSelectOptions = option => ({
        value: option[key || 'value'],
        content: option[value || 'content'],
      })

      if (jsonData) {
        try {
          options = JSON.parse(jsonData)
            .map(convertToSelectOptions)
            .filter(removeInvalidOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      if (dataName) {
        try {
          options = this.validationData[dataName]
            .map(convertToSelectOptions)
            .filter(removeInvalidOptions);
        } catch (error) {
          /* Ignore error */
        }
      }

      return options;
    },
  },
}
</script>
