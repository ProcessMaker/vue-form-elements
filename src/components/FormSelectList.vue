<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <form-plain-multi-select
      v-if="options.renderAs === 'dropdown'"
      option-value="value"
      option-content="content"
      v-uni-id="name"
      v-bind="$attrs"
      v-on="$listeners"
      v-model="dropdownConfig.selectedOptions"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      :options="dropdownConfig.optionsList"
      :class="classList"
      :only-key="dropdownConfig.onlyKey"
      :multiple="dropdownConfig.allowMultiSelect"
      ref="multiselect"
    >
    </form-plain-multi-select>

    <div v-if="options.renderAs === 'checkbox' && options.allowMultiSelect">
      <div :class="divClass" :key="typeof option.value == 'object' ? option.value[optionKey] : option.value" v-for="option in optionsList">
        <input
          v-bind="$attrs"
          :class="inputClass"
          type="checkbox"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :name="`${name}`"
          :checked="selectedOptions.indexOf(option.value)>=0"
          v-model="selectedOptions"
          @change="sendSelectedOptions($event)"
        >
        <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
      </div>
    </div>

    <div v-if="options.renderAs === 'checkbox' && !options.allowMultiSelect">
      <div :class="divClass" :key="typeof option.value == 'object' ? option.value[optionKey] : option.value" v-for="option in optionsList">
        <input
          v-bind="$attrs"
          type="radio"
          :class="inputClass"
          :value="option.value"
          v-uni-id="`${name}-${option.value}`"
          :name="`${name}`"
          v-model="selectedOptions[0]"
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
  import {createUniqIdsMixin} from 'vue-uniq-ids'
  import DataFormatMixin from './mixins/DataFormat';
  import FormPlainMultiSelect from "./FormPlainMultiSelect";
  import Mustache from "mustache";


  const uniqIdsMixin = createUniqIdsMixin()

  function removeInvalidOptions(option) {
    return Object.keys(option).includes('value', 'content') &&
      option.content != null;
  }

  export default {
    inheritAttrs: false,
    components: {
      FormPlainMultiSelect,
    },
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
      'placeholder',
    ],
    data() {
      return {
        //xxx crear métodos que llenan el optionList
        optionsList: [],
        selectedOptions: []
      }
    },
    methods: {
      multiSelectManager : {

      },

    },
    computed: {
      dropdownConfig() {
        return {
          optionsList: this.options.optionsList,
          value: this.options.value,
          content: this.options.content,
          selectedOptions: [],
          onlyKey: false,
          allowMultiSelect: this.options.allowMultiSelect,
        }
      },
      divClass() {
        return this.toggle ? 'custom-control custom-radio' : 'form-check';
      },
      labelClass() {
        return this.toggle ? 'custom-control-label' : 'form-check-label';
      },
      inputClass() {
        return [
          {[this.controlClass]: !!this.controlClass},
          {'is-invalid': (this.validator && this.validator.errorCount) || this.error},
          this.toggle ? 'custom-control-input' : 'form-check-input'
        ];
      },
      classList() {
        return {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
          [this.controlClass]: !!this.controlClass
        }
      },
    },
  }
</script>

