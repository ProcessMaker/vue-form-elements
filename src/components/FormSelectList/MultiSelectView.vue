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
  mounted() {
  },
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


<!--<template>-->
<!--  <div class="form-group">-->
<!--    <label v-uni-for="name" v-if="label">{{ label }}</label>-->
<!--    <multiselect-->
<!--      v-model="selected"-->
<!--      v-bind="$attrs"-->
<!--      v-on="$listeners"-->
<!--      v-uni-id="name"-->
<!--      :name="name"-->
<!--      :multiple="multiple"-->
<!--      :options="options"-->
<!--      :track-by="optionValue"-->
<!--      :label="optionContent"-->
<!--      :class="{'border border-danger':isError}"-->
<!--      :placeholder="placeholder ? placeholder : $t('type here to search')"-->
<!--    >-->
<!--      <template slot="noResult">-->
<!--        {{ $t('No elements found. Consider changing the search query.') }}-->
<!--      </template>-->
<!--      <template slot="noOptions">-->
<!--        {{ $t('No Data Available') }}-->
<!--      </template>-->
<!--    </multiselect>-->

<!--    <display-errors v-if="isError" :name="name" :error="error" class="d-block"/>-->
<!--    <small v-if="helper" class="form-text text-muted">{{helper}}</small>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import Multiselect from 'vue-multiselect';-->
<!--  import {createUniqIdsMixin} from 'vue-uniq-ids'-->
<!--  import ValidationMixin from './mixins/validation'-->
<!--  import DisplayErrors from './common/DisplayErrors';-->
<!--  import {get} from 'lodash';-->

<!--  const uniqIdsMixin = createUniqIdsMixin();-->

<!--  export default {-->
<!--    inheritAttrs: false,-->
<!--    components: {-->
<!--      Multiselect,-->
<!--      DisplayErrors-->
<!--    },-->
<!--    mixins: [uniqIdsMixin, ValidationMixin],-->
<!--    props: {-->
<!--      value: {type: [String, Array, Object]},-->
<!--      optionValue: String,-->
<!--      optionContent: String,-->
<!--      options: Array,-->
<!--      label: {type: String, default: ''},-->
<!--      error: String,-->
<!--      helper: String,-->
<!--      name: String,-->
<!--      controlClass: {type: [String, Array, Object]},-->
<!--      placeholder: String,-->
<!--      onlyKey: {type: Boolean, default: false},-->
<!--      multiple: {type: Boolean, default: true},-->
<!--    },-->
<!--    data() {-->
<!--      return {-->
<!--        selected: null,-->
<!--        reemitInput: false-->
<!--      };-->
<!--    },-->
<!--    computed: {-->
<!--      classList() {-->
<!--        return {-->
<!--          'is-invalid': (this.validator && this.validator.errorCount) || this.error,-->
<!--          [this.controlClass]: !!this.controlClass-->
<!--        }-->
<!--      },-->
<!--      isError() {-->
<!--        return this.error;-->
<!--      }-->
<!--    },-->
<!--    watch: {-->
<!--      value: {-->
<!--        immediate: true,-->
<!--        handler(value, oldValue) {-->

<!--          if (typeof value === 'undefined' || value === null || !Array.isArray(value) || value.length <= 0) {-->
<!--              return;-->
<!--          }-->

<!--          let firstValToEmit =  typeof value[0] === 'object' ? JSON.stringify(this.valueToUseForEmit(value[0])) : value[0];-->

<!--          let firstVal =  typeof value[0] === 'object' ? JSON.stringify(value[0]) : value[0];-->

<!--          if (firstValToEmit === firstVal && JSON.stringify(value) === JSON.stringify(oldValue) && !this.reemitInput) {-->
<!--            return;-->
<!--          }-->
<!--          this.reemitInput = false;-->

<!--          let selectedArray = [];-->
<!--          value.forEach(item => {-->
<!--            let foundOption = this.options.find(option => JSON.stringify(this.keyValue(option)) === JSON.stringify(this.keyValue(item)));-->
<!--            if (foundOption) {-->
<!--              selectedArray.push(foundOption);-->
<!--            }-->
<!--          });-->

<!--          if (this.multiple) {-->
<!--            let emit = [];-->
<!--            value.map(item => {-->
<!--              emit.push(this.valueToUseForEmit(item));-->
<!--            });-->
<!--            this.$emit('input', emit);-->
<!--            this.selected = selectedArray;-->
<!--          }-->
<!--          else {-->
<!--            this.$emit('input', this.valueToUseForEmit(value[0]));-->
<!--            this.selected = selectedArray.length > 0 ? selectedArray[0] : [];-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--        setReemit: function (value) {-->
<!--          this.reemitInput = value;-->
<!--        },-->
<!--        valueToUseForEmit: function (element) {-->
<!--          if (this.onlyKey) {-->
<!--            if (typeof element.value == 'undefined') {-->
<!--              return element;-->
<!--            }-->
<!--            return (typeof element.value === 'object' ? element.value[this.optionValue] : element.value);-->
<!--          }-->
<!--          else {-->
<!--            return (typeof element.value === 'object' ? element.value : element);-->
<!--          }-->
<!--        },-->

<!--        valueType: function(value) {-->
<!--            if (typeof value != 'object') {-->
<!--              return 'scalar';-->
<!--            }-->

<!--            if (typeof value.value == 'object') {-->
<!--              return 'nested';-->
<!--            }-->
<!--            else {-->
<!--              return 'object';-->
<!--            }-->
<!--        },-->

<!--        keyValue: function (element) {-->
<!--          if (this.onlyKey) {-->
<!--            switch(this.valueType(element))  {-->
<!--              case 'scalar':-->
<!--                return element;-->
<!--              case 'object':-->
<!--                return element[this.optionValue];-->
<!--              case 'nested':-->
<!--                return element.value[this.optionValue];-->
<!--              default:-->
<!--                return element;-->
<!--            }-->
<!--          }-->
<!--          else {-->
<!--            switch(this.valueType(element))  {-->
<!--              case 'scalar':-->
<!--                return null;-->
<!--              case 'object':-->
<!--                return element;-->
<!--              case 'nested':-->
<!--                return element.value;-->
<!--              default:-->
<!--                return element;-->
<!--            }-->
<!--          }-->
<!--        }-->

<!--    }-->
<!--  }-->
<!--</script>-->

<!--<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>-->
