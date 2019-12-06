<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <select
            v-if="options.renderAs === 'dropdown' && !allowMultiSelect"
            v-bind="$attrs"
            v-uni-id="name"
            class="form-control"
            :class="classList"
            :name='name'
            :placeholder="placeholder ? placeholder : $t('Select')"
            v-model="selectedOptions[0]"
            @change="sendSelectedOptions($event)"
    >
      <option :value="selectedOptions[0] ? null : selectedOptions[0]">{{placeholder ? placeholder : $t('Select')}}
      </option>
      <option
              v-for="(option, index) in optionsList"
              :value="option.value"
              :key="index"
      >
        {{ option.content }}
      </option>
    </select>

    <form-multi-select
            v-if="options.renderAs === 'dropdown' && allowMultiSelect"
            option-value="value"
            option-content="content"
            v-uni-id="name"
            v-bind="$attrs"
            v-on="$listeners"
            v-model="selectedOptions"
            v-bind:multiple="allowMultiSelect"
            :placeholder="placeholder ? placeholder : $t('Select...')"
            :show-labels="false"
            :options="optionsList"
            :class="classList"
            @input="sendSelectedOptions"
    >
    </form-multi-select>

    <div v-if="options.renderAs === 'checkbox' && allowMultiSelect">
      <div :class="divClass" :key="option.value" v-for="option in optionsList">
        <input
                v-bind="$attrs"
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

    <div v-if="options.renderAs === 'checkbox' && !allowMultiSelect">
      <div :class="divClass" :key="option.value" v-for="option in optionsList">
        <input
                v-bind="$attrs"
                type="radio"
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
    ],
    data() {
      return {
        formData: {},
        optionKey: '',
        optionValue: '',
        selectedOptions: [],
        renderAs: 'dropdown',
        allowMultiSelect: false,
        optionsList: [],
        debounceGetDataSource: _.debounce((selectedDataSource, selectedEndPoint, elementName, currentValue, key, value) => {
          let options = [];

          // If no ProcessMaker object is available return and do nothing
          if (typeof ProcessMaker === 'undefined') {
            return;
          }

          let dataSourceUrl = '/requests/data_sources/' + selectedDataSource;
          if (typeof this.options.pmqlQuery !== 'undefined' && this.options.pmqlQuery !== '') {
            let pmql = Mustache.render(this.options.pmqlQuery, {data: this.formData});
            dataSourceUrl += '&pmql=' + pmql;
          }

          ProcessMaker.apiClient
            .post(dataSourceUrl, {
              config: {
                endpoint: selectedEndPoint,
              }
            })
            .then(response => {
              let list = (elementName) ? response.data[elementName] : response.data;
              list.forEach(item => {
                // if the content has a mustache expression
                let itemContent = (value.indexOf('{{') >= 0)
                  ? Mustache.render(value, item)
                  : item[value || 'content'].toString();

                let itemValue = (item[key || 'value']).toString();

                options.push({
                  value: itemValue,
                  content: itemContent
                });
              });
              this.optionsList = options;

              if (!currentValue) {
                this.selectedOptions = [];
              }
              if (Array.isArray(currentValue) && currentValue.length !== 0) {
                this.selectedOptions = this.allowMultiSelect ? currentValue : [currentValue[0]];
              }
            })
            .catch(err => {
              /* Ignore error */
            });
        }, 750),
      };
    },
    watch: {
      options: {
        deep: true,
        handler(value) {
          this.renderAs = value.renderAs;
          this.allowMultiSelect = value.allowMultiSelect;
          if (value.defaultOptionKey && !this.value) {
            this.selectedOptions = [value.defaultOptionKey];
          }
          this.optionKey = value.key || 'value';
          this.optionValue = value.value || 'content';
          this.optionsFromDataSource();
        }
      },
      value: {
        handler() {
          if (!this.value) {
            this.selectedOptions = [];
          }
          if (Array.isArray(this.value) && this.value.length !== 0 && this.selectedOptions.length === 0) {
            this.selectedOptions = this.allowMultiSelect ? this.value : [this.value[0]];
          }
        }
      },
    },
    mounted() {
      this.selectedOptions = (this.value)
        ? Object.entries(JSON.parse(JSON.stringify(this.value))).map(x => x[1])
        : [];

      if (this.options.defaultOptionKey && !this.value) {
        this.selectedOptions = [this.options.defaultOptionKey];
      }

      this.renderAs = this.options.renderAs;
      this.allowMultiSelect = this.options.allowMultiSelect;
      this.optionsFromDataSource();
      if (typeof ProcessMaker !== 'undefined') {
        ProcessMaker.EventBus.$on('form-data-updated', (newData) => {
          this.formData=newData;
        });
      }
    },
    methods: {
      sendSelectedOptions() {
        let valueToSend = (this.selectedOptions.constructor === Array)
          ? this.selectedOptions
          : [this.selectedOptions];

        // If more than 1 item is selected but we are displaying a one selection control
        // show just the first selected item
        if (!this.allowMultiSelect && valueToSend.length > 0) {
          valueToSend = new Array(valueToSend[valueToSend.length - 1]);
        }

        this.$emit('input', valueToSend);
      },

      optionsFromDataSource() {
        const {
          jsonData,
          key,
          value,
          dataSource,
          allowMultiSelect,
          selectedDataSource,
          selectedEndPoint,
          elementName,
          dataName
        } = this.options;

        this.allowMultiSelect = allowMultiSelect;
        let options = [];
        const convertToSelectOptions = option => ({
          value: (option[key || 'value']).toString(),
          content: (option[value || 'content']).toString(),
        })

        if (jsonData) {
          try {
            options = JSON.parse(jsonData)
              .map(convertToSelectOptions)
              .filter(removeInvalidOptions);
            this.optionsList = options;
          } catch (error) {
            /* Ignore error */
          }
        }

        if (selectedDataSource && selectedEndPoint && dataSource === 'dataConnector') {
          this.debounceGetDataSource(selectedDataSource, selectedEndPoint, elementName, this.value, key, value);
        }

        if (dataSource === 'dataObject') {
          try {
            options = Object.values(this.validationData[elementName])
              .map(convertToSelectOptions)
              .filter(removeInvalidOptions);
            this.optionsList = options;
          } catch (error) {
            /* Ignore error */
          }
        }

      },

    },
    computed: {
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

