<template>
  <div class="form-group">
sell2
    <label v-uni-for="name">{{label}}</label>
    <select
      v-if="options.renderAs === 'dropdown'"
      v-bind="$attrs"
      v-uni-id="name"
      class="form-control"
      :class="classList"
      :name='name'
      v-model="selectedOptions[0]"
      @change="sendSelectedOptions($event)"
    >
      <option :value="null">Select</option>
      <option
        v-for="(option, index) in selectOptions"
        :selected="option.value==='red'"
        :value="option.value"
        :key="index"
      >
        {{option.content}}
      </option>
    </select>


    <div v-if="options.renderAs === 'checkbox'">
      <div :class="divClass" :key="option.value" v-for="option in selectOptions">
        <input
          v-bind="$attrs"
          type="checkbox"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :name="`${name}`"
          :checked="selectedOptions.indexOf(option.value)"
          v-model="selectedOptions"
          @change="sendSelectedOptions($event)"
        >
        <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
      </div>
   </div>


    <div v-if="options.renderAs === 'radio'">
      <div :class="divClass" :key="option.value" v-for="option in selectOptions">
        <input
          v-bind="$attrs"
          type="radio"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :name="`${name}`"
          :checked="selectedOptions.indexOf(option.value)"
          v-model="selectedOptions"
          @change="sendSelectedOptions($event)"
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
  data() {
    return {
      selectedOptions: [],
      renderAs: 'checkbox'
    };
  },
  mounted() {
    this.selectedOptions = this.options.selectedOptions;
    this.renderAs = this.options.renderAs;
    console.log('FormSelect-mount-opciones seleccionadas');
    console.log(this.options);
    console.log('FormSelect-mount-Datoos');
    console.log(this.data);
    console.log('FormSelect-mount-Data Format');
    console.log(this.dataFormat);
  },
  methods: {
    sendSelectedOptions(event) {
      let valueToSend = (this.selectedOptions.constructor === Array) 
                        ? this.selectedOptions
                        : [this.selectedOptions];

      console.log('FormSelect - sendSelectedOptions - selectedOptions constructor');
      console.log(this.selectedOptions.constructor);
      console.log('FormSelect - sendSelectedOptions - selectedOptions');
      console.log(this.selectedOptions);
      console.log('FormSelect - sendSelectedOptions - valueToSend');
      console.log(valueToSend);
      this.$emit('input', valueToSend);
      //$emit('input', $event.target.value)
    }
  },
  computed:{
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
    },
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
      console.log('FormSelect - optionsFromDataSource - options');
      console.log(this.options);
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
