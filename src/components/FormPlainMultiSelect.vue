<template>
  <div class="form-group">
    <label v-uni-for="name" v-if="label">{{ label }}</label>
    <multiselect
      v-model="selected"
      v-bind="$attrs"
      v-on="$listeners"
      v-uni-id="name"
      :name="name"
      :multiple="multiple"
      :options="options"
      :track-by="optionValue"
      :label="optionContent"
      :class="{'border border-danger':isError}"
      :placeholder="placeholder ? placeholder : $t('type here to search')"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>

    <display-errors v-if="isError" :name="name" :error="error" class="d-block"/>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import {createUniqIdsMixin} from 'vue-uniq-ids'
  import ValidationMixin from './mixins/validation'
  import DisplayErrors from './common/DisplayErrors';
  import {get} from 'lodash';

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    components: {
      Multiselect,
      DisplayErrors
    },
    mixins: [uniqIdsMixin, ValidationMixin],
    props: {
      value: {type: [String, Array, Object]},
      optionValue: String,
      optionContent: String,
      options: Array,
      label: {type: String, default: ''},
      error: String,
      helper: String,
      name: String,
      controlClass: {type: [String, Array, Object]},
      placeholder: String,
      onlyKey: {type: Boolean, default: false},
      multiple: {type: Boolean, default: true},
    },
    data() {
      return {
        selected: null,
      };
    },
    computed: {
      classList() {
        return {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
          [this.controlClass]: !!this.controlClass
        }
      },
      isError() {
        return this.error;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(value) {
          if (this.multiple && this.onlyKey) {
            if (this.valueOriginForKeysOnly(value) === 'VueMultiSelect') {
              let emit = [];
              value.map(item => {
                emit.push(item[this.optionValue]);
              });
              this.$emit('input', emit);
            }

            if (this.valueOriginForKeysOnly(value) === 'DirectSet') {
              let selectedArray = [];
              value.forEach(item => {
                let foundOption = this.options.find( option => JSON.stringify(option.value) === JSON.stringify(item));
                if (foundOption) {
                  selectedArray.push(foundOption);
                }
              })
              this.selected = selectedArray;
            }
          }

          if (this.multiple && !this.onlyKey) {
            if (this.valueOriginForObjectsOnly(value) === 'VueMultiSelect') {
              let emit = [];
              value.map(item => {
                emit.push(item.value);
              });
              this.$emit('input', emit);
            }

            if (this.valueOriginForObjectsOnly(value) === 'DirectSet') {
              let selectedArray = [];
              value.forEach(item => {
                let foundOption = this.options.find( option => JSON.stringify(option.value) === JSON.stringify(item));
                if (foundOption) {
                  selectedArray.push(foundOption);
                }
              })
              this.selected = selectedArray;
            }
          }

          if (!this.multiple && this.onlyKey) {
            if (this.valueOriginForKeysOnly(value) === 'VueMultiSelect') {
              this.$emit('input', value[0][this.optionValue]);
            }

            if (this.valueOriginForKeysOnly(value) === 'DirectSet') {
              let selectedArray = [];
              value.forEach(item => {
                let foundOption = this.options.find( option => JSON.stringify(option.value) === JSON.stringify(item));
                if (foundOption) {
                  selectedArray.push(foundOption);
                }
              })
              this.selected = selectedArray.length > 0 ? selectedArray[0] : [];
            }
          }

          if (!this.multiple && !this.onlyKey) {
            if (this.valueOriginForObjectsOnly(value) === 'VueMultiSelect') {
              this.$emit('input', value[0].value);
            }

            if (this.valueOriginForObjectsOnly(value) === 'DirectSet') {
              let selectedArray = [];
              value.forEach(item => {
                let foundOption = this.options.find( option => JSON.stringify(option.value) === JSON.stringify(item));
                if (foundOption) {
                  selectedArray.push(foundOption);
                }
              })
              this.selected = selectedArray.length > 0 ? selectedArray[0] : [];
            }
          }

        }
      }
    },
    methods: {
        valueOriginForObjectsOnly: function (value) {
          if (typeof value === 'undefined' || value === null || !Array.isArray(value) || value.length <= 0) {
            return 'None';
          }

          let firstVal = value[0];
          return (typeof firstVal[this.optionValue] === 'object' ? 'VueMultiSelect' : 'DirectSet');
        },

        valueOriginForKeysOnly: function (value) {
          if (typeof value === 'undefined' || value === null || !Array.isArray(value) || value.length <= 0) {
            return 'None';
          }

          let firstVal = value[0];
          return (typeof firstVal === 'object' ? 'VueMultiSelect' : 'DirectSet');
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
