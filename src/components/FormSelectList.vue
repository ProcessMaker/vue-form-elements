<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <multi-select-view
      v-if="options.renderAs === 'dropdown'"
      :option-value="optionsKey"
      :option-content="optionsValue"
      v-uni-id="name"
      v-model="valueProxy"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      :options="selectListOptions"
      :class="classList"
      :emit-objects="options.valueTypeReturned === 'object'"
      :emit-array="options.allowMultiSelect"
      v-bind="$attrs"
    >
    </multi-select-view>

    <div v-if="options.renderAs === 'checkbox' && options.allowMultiSelect">
      <checkbox-view
        v-model="valueProxy"
        :name="name"
        :option-value="optionsKey"
        :option-content="optionsValue"
        :options="selectListOptions"
        :emit-objects="options.valueTypeReturned === 'object'"
        v-bind="$attrs"
      />
    </div>

    <div v-if="options.renderAs === 'checkbox' && !options.allowMultiSelect">
      <optionbox-view
          v-model="valueProxy"
          :name="name"
          :option-value="optionsKey"
          :option-content="optionsValue"
          :options="selectListOptions"
          :emit-objects="options.valueTypeReturned === 'object'"
          v-bind="$attrs"
      />
    </div>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validatorErrors" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
  import ValidationMixin from './mixins/validation'
  import {createUniqIdsMixin} from 'vue-uniq-ids'
  import MultiSelectView from "./FormSelectList/MultiSelectView";
  import CheckboxView from "./FormSelectList/CheckboxView";
  import OptionboxView from "./FormSelectList/OptionboxView";
  import FormMultiSelect from "./FormMultiSelect";
  import Mustache from "mustache";
  import { get } from 'lodash';


  const uniqIdsMixin = createUniqIdsMixin()

  function removeInvalidOptions(option) {
    return Object.keys(option).includes('value', 'content') &&
      option.content != null;
  }

  export default {
    inheritAttrs: false,
    components: {
      OptionboxView,
      MultiSelectView,
      CheckboxView,
      FormMultiSelect,
    },
    mixins: [uniqIdsMixin, ValidationMixin],
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
      'multiple'
    ],
    data() {
      return {
        apiClient: ProcessMaker.apiClient.create(),
        selectListOptions: [],
        doDebounce: _.debounce(options => {
          const selectedEndPoint = options.selectedEndPoint;
          const selectedDataSource = options.selectedDataSource;
          const dataName = options.dataName;
          const key = options.key;
          const value = options.value;
          let opt = [];

          // If no data source has been specified, do not make the api call
          if(selectedDataSource === null || typeof selectedDataSource === 'undefined' || selectedDataSource.toString().trim().length === 0) {
            return;
          }

          let dataSourceUrl = '/requests/data_sources/' + selectedDataSource;
          if (typeof this.options.pmqlQuery !== 'undefined' && this.options.pmqlQuery !== '' && this.options.pmqlQuery !== null) {
            const pmql = Mustache.render(this.options.pmqlQuery, {data: this.validationData});
            dataSourceUrl += '?pmql=' + pmql;
          }

          this.apiClient
              .post(dataSourceUrl, { config: { endpoint: selectedEndPoint, } })
              .then(response => {
                const list = dataName ? eval('response.data.' + dataName) : response.data;
                const suffix = this.attributeParent(value);
                list.forEach(item => {
                  // if the content has a mustache expression
                  const escape = Mustache.escape;
                  Mustache.escape = (t) => t; // Do not escape mustache content
                  let itemContent = (value.indexOf('{{') >= 0) ? Mustache.render(value, item) : (item[value || 'content'] || '').toString();
                  let itemValue = (key.indexOf('{{') >= 0) ? Mustache.render(key, item) : (item[key || 'value'] || '').toString();
                  Mustache.escape = escape; // Reset mustache to original escape function

                  let parsedOption = {};
                  parsedOption[this.optionsKey] = itemValue;
                  parsedOption[this.optionsValue] = itemContent;
                  if (options.valueTypeReturned === 'object') {
                    opt.push(eval( suffix.length > 0 ? 'item.' +  suffix : 'item'));
                  }
                  else {
                    opt.push(parsedOption);
                  }
                });

                this.selectListOptions =  opt;
              })
              .catch(err => {
                /* Ignore error */
              });
        }, 700)
      }
    },
    methods: {
      searchChange(filter) {
        this.filter = filter;
        this.optionsFromDataSource();
      },
      fillSelectListOptions() {
        if (this.options.dataSource && this.options.dataSource === 'provideData') {
          this.selectListOptions = this.options && this.options.optionsList ? this.options.optionsList : [];
        }

        if (this.options.dataSource && this.options.dataSource === 'dataObject') {
          let requestOptions = []
          try {
            requestOptions = get(this.validationData, this.options.dataName);
          }
          catch(e) {
            requestOptions = [];
          }
          this.selectListOptions = requestOptions ? requestOptions : [];
        }

        if (this.options.dataSource && this.options.dataSource === 'dataConnector') {
          this.doDebounce(this.sourceConfig);
        }
      },
      stripMustache(str) {
        const removed =  str.replace(/{{/g,'')
            .replace(/}}/g,'')
            .split('.')
            .pop();

        return removed ? removed : str;
      },
      attributeParent(str) {
        let parts =  str.replace(/{{/g,'')
            .replace(/}}/g,'')
            .split('.')
        parts.pop();
        return parts.join('.');
      }
    },
    watch: {
      sourceConfig: {
        immediate:true,
        deep: true,
        handler() {
          this.fillSelectListOptions();
        }
      },
      validationData: {
        immediate:true,
        deep: true,
        handler() {
          this.fillSelectListOptions();
        }
      },
      selectListOptions: {
        immediate: true,
        deep: true,
        handler() {
          this.$root.$emit('selectListOptionsUpdated', this.selectListOptions);
        }
      }
    },
    computed: {
      validatorErrors() {
        return this.validator && this.validator.errors.get(this.name) || [];
      },
      divClass() {
        return this.toggle ? 'custom-control custom-radio' : 'form-check';
      },
      sourceConfig() {
        return {
          dataSource: this.options.dataSource,
          selectedEndPoint: this.options.selectedEndPoint,
          selectedDataSource: this.options.selectedDataSource,
          valueTypeReturned: this.options.valueTypeReturned,
          dataName: this.options.dataName,
          value: this.options.value,
          key: this.options.key
        };
      },
      valueProxy: {
        get() { return this.value; },
        set(val) { return this.$emit('input', val); }
      },
      optionsKey() {
        if (this.options.dataSource && this.options.dataSource === 'provideData') {
          return 'value';
        }

        const fieldName = this.options.key || 'value';

        if (fieldName.indexOf('{{') >= 0) {
          return this.stripMustache(fieldName);
        }

        return fieldName;
      },
      optionsValue() {
        if (this.options.dataSource && this.options.dataSource === 'provideData') {
          return 'content';
        }

        const fieldName = this.options.value || 'content';

        if (fieldName.indexOf('{{') >= 0) {
          return this.stripMustache(fieldName);
        }

        return fieldName;
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

