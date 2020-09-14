<template>
  <div class="form-group">
    <multiselect
        v-uni-id="name"
        :options="options"
        :multiple="emitArray"
        v-model="valueProxy"
        :name="name"
        :track-by="optionValue"
        :label="optionContent"
        :class="classList"
        :placeholder="placeholder ? placeholder : $t('type here to search')"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>

    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import {createUniqIdsMixin} from 'vue-uniq-ids'
import ValidationMixin from '../mixins/validation'

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    Multiselect
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  props: [
    'value',
    'optionValue',
    'optionContent',
    'options',
    'label',
    'error',
    'helper',
    'name',
    'controlClass',
    'placeholder',
    'emitObjects',
    'emitArray',
  ],
  computed: {
    valueProxy: {
      get() {
        return this.toMultiSelectFormat(this.value, this.optionValue, this.options, this.emitArray, this.emitObjects);
      },
      set(val) {
          const valueToEmit = this.convertForEmit(val, this.optionValue, this.emitArray, this.emitObjects);
          this.$emit('input', valueToEmit);
       }
    },

    classList() {
      return {
        'is-invalid border border-danger': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      }
    },
  },
  methods: {
    convertForEmit(value, keyField, asArray, asObject) {
      // MultiSelect always uses objects so no conversion is needed,
      if (asArray && asObject) { return value ? value : []; }
      if (asArray && !asObject) {return value ? value.map(x => x[keyField]) : [];}
      if (!asArray && asObject) { return value ? value : null;}
      if (!asArray && !asObject) {return value ? value[keyField] : null;}
    },

    toMultiSelectFormat(value, keyField, options, asArray, asObject) {
      const isEmpty = value === null || typeof value === "undefined";
      const isArray = Array.isArray(value);
      const isObject = isArray && value.length > 0 ? typeof value[0] === 'object' : typeof value === 'object';

      if (isEmpty) {return null;}
      if (isArray && value.length === 0) {return asArray ? []: null;}
      if (isArray !== asArray) {return null;}
      if (isObject !== asObject) {return null;}

      if (isArray && isObject) {return value;}
      if (isArray && !isObject) {
        return options.filter(option => {
          const normalizedOption = option[keyField] ? option[keyField] : null;
          return value.findIndex(inputVal => inputVal === normalizedOption) >= 0 && normalizedOption !== null;
        });
      }

      if (!isArray && isObject) {return value;}
      if (!isArray && !isObject) {
        const founds = options.filter(option => {
          const normalizedOption = option[keyField] ? option[keyField] : null;
          return value == normalizedOption && normalizedOption !== null;
        });
        return founds.length > 0 ? founds[0] : [];
      }
    },
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
