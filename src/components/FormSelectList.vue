<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <form-plain-multi-select
      v-if="options.renderAs === 'dropdown'"
      v-model="selectedOptions"
      v-uni-id="name"
      :class="classList"
      :multiple="allowMultiSelect"
      :only-key="onlyKey"
      :options="optionsList"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      option-content="content"
      option-value="value"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </form-plain-multi-select>

    <div v-if="options.renderAs === 'checkbox' && allowMultiSelect">
      <div v-for="option in optionsList" :key="typeof option.value == 'object' ? option.value[optionKey] : option.value"
           :class="divClass">
        <input
          v-model="selectedOptions"
          v-uni-id="`${name}-${option.value}`"
          :checked="selectedOptions.indexOf(option.value)>=0"
          :class="inputClass"
          :name="`${name}`"
          :value="option.value"
          type="checkbox"
          v-bind="$attrs"
          @change="sendSelectedOptions($event)"
        >
        <label v-uni-for="`${name}-${option.value}`" :class="labelClass">{{ option.content }}</label>
      </div>
    </div>

    <div v-if="options.renderAs === 'checkbox' && !allowMultiSelect">
      <div v-for="option in optionsList" :key="typeof option.value == 'object' ? option.value[optionKey] : option.value"
           :class="divClass">
        <input
          v-model="selectedOptions[0]"
          v-uni-id="`${name}-${option.value}`"
          :class="inputClass"
          :name="`${name}`"
          :value="option.value"
          type="radio"
          v-bind="$attrs"
          @change="sendSelectedOptions($event)"
        >
        <label v-uni-for="`${name}-${option.value}`" :class="labelClass">{{ option.content }}</label>
      </div>
    </div>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import Mustache from 'mustache';
import { debounce, get } from 'lodash-es';
import ValidationMixin from './mixins/validation';
import DataFormatMixin from './mixins/DataFormat';
import FormPlainMultiSelect from './FormPlainMultiSelect.vue';

const uniqIdsMixin = createUniqIdsMixin();

function removeInvalidOptions(option) {
  return Object.keys(option).includes('value') && !!option.content;
}

export default {
  inheritAttrs: false,
  components: {
    FormPlainMultiSelect
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
    'placeholder'
  ],
  data() {
    return {
      cachedSelOptions: null,
      formData: {},
      optionKey: '',
      optionValue: '',
      selectedOptions: [],
      renderAs: 'dropdown',
      allowMultiSelect: false,
      optionsList: [],
      onlyKey: true,
      debounceGetDataSource: debounce((selectedDataSource, selectedEndPoint, dataName, currentValue, key, value,
        selOptions) => {
        const options = [];

        // If no ProcessMaker object is available return and do nothing
        if (typeof ProcessMaker === 'undefined') {
          return;
        }

        let dataSourceUrl = `/requests/data_sources/${selectedDataSource}`;
        if (typeof this.options.pmqlQuery !== 'undefined' && this.options.pmqlQuery !== '') {
          const pmql = Mustache.render(this.options.pmqlQuery, { data: this.formData });
          dataSourceUrl += `?pmql=${pmql}`;
        }

        ProcessMaker.apiClient
          .post(dataSourceUrl, {
            config: {
              endpoint: selectedEndPoint
            }
          })
          .then((response) => {
            const list = dataName ? eval(`response.data.${dataName}`) : response.data;
            list.forEach((item) => {
              // if the content has a mustache expression
              const itemContent = (value.indexOf('{{') >= 0)
                ? Mustache.render(value, item)
                : item[value || 'content'].toString();

              const itemValue = (key.indexOf('{{') >= 0)
                ? Mustache.render(key, item)
                : item[key || 'value'].toString();

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
            this.selectedOptions = selOptions || [];
          })
          .catch((err) => {
            /* Ignore error */
          });
      }, 750)
    };
  },
  watch: {
    validationData: {
      handler(value) {
        this.optionsFromDataSource();
      }
    },
    options: {
      immediate: true,
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
      immediate: true,
      handler() {
        if (typeof this.value === 'undefined') {
          this.selectedOptions = [];
          return;
        }

        if (!this.value) {
          this.selectedOptions = this.options.defaultOptionKey ? [this.options.defaultOptionKey] : [];
          this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));

          if (this.options.defaultOptionKey) {
            this.sendSelectedOptions();
          }

          return;
        }

        this.onlyKey = !(this.options.valueTypeReturned === 'object');

        if (this.options.allowMultiSelect) {
          this.selectedOptions = Array.isArray(this.value) ? this.value : [this.value];
        } else {
          this.selectedOptions = Array.isArray(this.value) ? this.value[0] : [this.value];
        }

        this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
      }
    }
  },
  mounted() {
    this.renderAs = this.options.renderAs;
    this.allowMultiSelect = this.options.allowMultiSelect;
    this.valueTypeReturned = this.options.valueTypeReturned;
    this.optionsFromDataSource();

    if (typeof ProcessMaker !== 'undefined') {
      ProcessMaker.EventBus.$on('form-data-updated', (newData) => {
        this.formData = newData;
      });
    }

    if (typeof this.value === 'undefined' || this.value === null) {
      this.selectedOptions = this.options.defaultOptionKey ? [this.options.defaultOptionKey] : [];
      this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
      return;
    }

    if (this.options.allowMultiSelect) {
      this.selectedOptions = Object.entries(JSON.parse(JSON.stringify(this.value))).map((x) => x[1]);
    } else {
      this.selectedOptions = Array.isArray(this.value) ? this.value[0] : [this.value];
    }

    this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
  },
  methods: {
    sendSelectedOptions() {
      let valueToSend = (this.selectedOptions.constructor === Array)
        ? this.selectedOptions
        : [this.selectedOptions];

      // If more than 1 item is selected but we are displaying a one selection control
      // show just the first selected item
      if (!this.allowMultiSelect && valueToSend.length > 0) {
        valueToSend = valueToSend[0];
      }

      if (this.options.renderAs === 'dropdown' && this.options.allowMultiSelect) {
        valueToSend = this.selectedOptions.map((x) => x[this.options.key]);
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
        dataName
      } = this.options;

      this.allowMultiSelect = allowMultiSelect;
      let options = [];
      const convertToSelectOptions = (option) => ({
        value: (option[key || 'value']).toString(),
        content: (option[value || 'content']).toString()
      });
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
        this.debounceGetDataSource(selectedDataSource, selectedEndPoint, dataName, this.value, key, value,
          this.cachedSelOptions);
      }
      if (dataName) {
        if (this.options.valueTypeReturned === null) {
          return;
        }

        if (this.options.valueTypeReturned === 'single') {
          try {
            options = Object.values(get(this.validationData, dataName))
              .map(convertToSelectOptions)
              .filter(removeInvalidOptions);
            this.optionsList = options;
          } catch (error) {
            /* Ignore error */
          }
        }

        if (this.options.valueTypeReturned === 'object') {
          const convertObjectToSelectOptions = (option) => ({
            value: option,
            content: (option[value || 'content']).toString()
          });
          try {
            options = Object.values(get(this.validationData, dataName))
              .map(convertObjectToSelectOptions);
            this.optionsList = options;
          } catch (error) {
            /* Ignore error */
          }
        }
      }
    }

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
        { [this.controlClass]: !!this.controlClass },
        { 'is-invalid': (this.validator && this.validator.errorCount) || this.error },
        this.toggle ? 'custom-control-input' : 'form-check-input'
      ];
    },
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      };
    }
  }
};
</script>
