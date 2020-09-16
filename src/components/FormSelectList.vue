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
  import DataFormatMixin from './mixins/DataFormat';
  import MultiSelectView from "./FormSelectList/MultiSelectView";
  import CheckboxView from "./FormSelectList/CheckboxView";
  import OptionboxView from "./FormSelectList/OptionboxView";
  import FormMultiSelect from "./FormMultiSelect";
  import Mustache from "mustache";


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
      'multiple'
    ],
    data() {
      return {
        selectListOptions: [],
        doDebounce: _.debounce(options => {
          const selectedEndPoint = options.selectedEndPoint;
          const selectedDataSource = options.selectedDataSource;
          const dataName = options.dataName;
          const key = options.key;
          const value = options.value;
          let opt = [];

          let dataSourceUrl = '/requests/data_sources/' + selectedDataSource;
          if (typeof this.options.pmqlQuery !== 'undefined' && this.options.pmqlQuery !== '') {
            let pmql = Mustache.render(this.options.pmqlQuery, {data: this.formData});
            dataSourceUrl += '?pmql=' + pmql;
          }

          ProcessMaker.apiClient
              .post(dataSourceUrl, { config: { endpoint: selectedEndPoint, } })
              .then(response => {
                var list = dataName ? eval('response.data.' + dataName) : response.data;
                list.forEach(item => {
                  // if the content has a mustache expression
                  let itemContent = (value.indexOf('{{') >= 0) ? Mustache.render(value, item) : item[value || 'content'].toString();
                  let itemValue = (key.indexOf('{{') >= 0) ? Mustache.render(key, item) : item[key || 'value'].toString();
                  let parsedOption = {};
                  parsedOption[key] = itemValue;
                  parsedOption[value] = itemContent;
                  opt.push(parsedOption);
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
      sendSelectedOptions() {
        let valueToSend = (this.selectedOptions.constructor === Array)
          ? this.selectedOptions
          : [this.selectedOptions];

        // If more than 1 item is selected but we are displaying a one selection control
        // show just the first selected item
        if (!this.allowMultiSelect && valueToSend.length > 0) {
          valueToSend = valueToSend[0];
        }
      },
      fillSelectListOptions() {
        if (this.options.dataSource && this.options.dataSource === 'provideData') {
          this.selectListOptions = this.options && this.options.optionsList ? this.options.optionsList : [];
        }

        if (this.options.dataSource && this.options.dataSource === 'dataObject') {
          let requestOptions = []
          try {
            requestOptions = eval('this.validationData.' + this.options.dataName);
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
    },
    watch: {
      sourceConfig: { immediate:true, handler() { this.fillSelectListOptions();} },
      validationData: { immediate:true, handler() { this.fillSelectListOptions();} },
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
        return this.options.key || 'value';
      },
      optionsValue() {
        if (this.options.dataSource && this.options.dataSource === 'provideData') {
          return 'content';
        }
        return this.options.value || 'content';
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

