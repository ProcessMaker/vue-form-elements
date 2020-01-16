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
      selected: {
        handler(value, oldValue) {
          console.log('selected', value, oldValue);
          if (JSON.stringify(value) === JSON.stringify(oldValue)) {
            return;
          }

          let emit = [];
          if (this.multiple) {
            value.map(item => {
              emit.push(this.onlyKey ? item[this.optionValue] : item);
            });
          } else {
            emit = this.onlyKey ? value[this.optionValue] : value;
          }
          this.$emit("input", emit);
        }
      },
      value: {
        immediate: true,
        handler(value, oldValue) {
          console.log('value', value, oldValue);
          //if (value && this.options && !this.selected) {
          if (true) {
            if (Array.isArray(value)) {
              this.selected = [];

              let objectList = [];
              value.forEach(item => {
                let selection = item;
                if (typeof item === 'object') {
                  selection = item[this.optionValue]
                }
                let foundOption = this.options.find(option => get(option, this.optionValue) === selection);
                if (foundOption) {
                  this.selected.push(foundOption);
                }
              })
            } else {
              this.selected = this.options.find(option => get(option, this.optionValue) === value)
            }
          }
        }
      }
    },
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
