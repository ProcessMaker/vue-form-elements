<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>
    <form-plain-multi-select
      v-if="options.renderAs === 'dropdown'"
      option-value="value"
      option-content="content"
      v-uni-id="name"
      v-model="selectedOptions"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      :options="optionsList"
      :class="classList"
      :only-key="onlyKey"
      :multiple="allowMultiSelect"
      @input="onInput"
      ref="multiselect"
    >
    </form-plain-multi-select>

    <div v-if="options.renderAs === 'checkbox' && allowMultiSelect">
      <div :class="divClass" :key="typeof option == 'object' ? option[optionKey] : option.value" v-for="option in optionsList">
        <input
          v-bind="$attrs"
          :class="inputClass"
          type="checkbox"
          :value="onlyKey ? option.value : option"
          v-uni-id="`${name}-${option.value}`"
          :name="`${name}`"
          :checked="selectedOptions.indexOf(onlyKey ? option.value : option)>=0"
          v-model="selectedOptions"
          @change="sendSelectedOptions($event)"
        >
        <label :class="labelClass" v-uni-for="`${name}-${option.value}`">{{option.content}}</label>
      </div>
    </div>

    <div v-if="options.renderAs === 'checkbox' && !allowMultiSelect">
      <div :class="divClass" :key="typeof option == 'object' ? option[optionKey] : option.value" v-for="option in optionsList">
        <input
          v-bind="$attrs"
          type="radio"
          :class="inputClass"
          :value="onlyKey ? option.value : option"
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
        cachedSelOptions: null,
        formData: {},
        optionKey: '',
        optionValue: '',
        selectedOptions: [],
        renderAs: 'dropdown',
        allowMultiSelect: false,
        optionsList: [],
        onlyKey: true,
        responseList: [],
        debounceGetDataSource: _.debounce((selectedDataSource, selectedEndPoint, dataName, currentValue, key, value,
                                           selOptions) => {
          let options = [];

          // If no ProcessMaker object is available return and do nothing
          if (typeof ProcessMaker === 'undefined') {
            return;
          }

          let dataSourceUrl = '/requests/data_sources/' + selectedDataSource;
          if (typeof this.options.pmqlQuery !== 'undefined' && this.options.pmqlQuery !== '') {
            let pmql = Mustache.render(this.options.pmqlQuery, {data: this.formData});
            dataSourceUrl += '?pmql=' + pmql;
          }

          ProcessMaker.apiClient
            .post(dataSourceUrl, {
              config: {
                endpoint: selectedEndPoint,
              }
            })
            .then(response => {
              let list = dataName ? eval('response.data.' + dataName) : response.data;
              this.responseList = list;
              list.forEach(item => {
                // if the content has a mustache expression
                let itemContent = (value.indexOf('{{') >= 0)
                  ? Mustache.render(value, item)
                  : item[value || 'content'].toString();

                let itemValue = (key.indexOf('{{') >= 0)
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
              this.$refs.multiselect.setReemit(true);
            })
            .catch(err => {
              /* Ignore error */
            });

        }, 750),
      };
    },
    watch: {
      validationData: {
        handler(value) {
          if (this.options.dataSource === 'dataConnector') {
            return;
          }
          this.optionsFromDataSource();
        }
      },
      options: {
        immediate:true,
        deep: true,
        handler(value) {
          this.renderAs = value.renderAs;
          this.allowMultiSelect = value.allowMultiSelect;
          if (value.defaultOptionKey && !this.value) {
            this.selectedOptions = [value.defaultOptionKey];
          }
          this.optionKey = value.key || 'value';
          this.optionValue = value.value || 'content';
          this.onlyKey = this.options.valueTypeReturned == 'single' ? true : false;
          this.optionsFromDataSource();
        }
      },
      value: {
        immediate:true,
        handler() {
          console.log('value changed', this.value);
          if (typeof this.value === 'undefined') {
             this.selectedOptions = [];
              return;
          }

          if (!this.value) {
            console.log('no value');
            // this.selectedOptions = this.options.defaultOptionKey ? [this.options.defaultOptionKey] : [];
            // this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));

            // if (this.options.defaultOptionKey) {
            //   this.sendSelectedOptions();
            // }

            // return;
          }

          // this.onlyKey = !(this.options.valueTypeReturned === 'object');

          if (this.options.allowMultiSelect) {
            this.selectedOptions = Array.isArray(this.value) ? this.value : [this.value]
          }
          else {
            this.selectedOptions = Array.isArray(this.value) ? this.value[0] : [this.value]
            console.log('selected', this.value, this.selectedOptions);
          }

          // this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
        }
      },
    },
    mounted() {
      this.renderAs = this.options.renderAs;
      this.allowMultiSelect = this.options.allowMultiSelect;
      this.valueTypeReturned = this.options.valueTypeReturned;
      this.optionsFromDataSource();

      if (typeof ProcessMaker !== 'undefined') {
        ProcessMaker.EventBus.$on('form-data-updated', (newData) => {
          this.formData=newData;
        });
      }

      if (typeof this.value === 'undefined' || this.value === null) {
        this.selectedOptions = this.options.defaultOptionKey ? [this.options.defaultOptionKey] : [];
        this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
        return
      }

      if (this.options.allowMultiSelect) {
          this.selectedOptions = Object.entries(JSON.parse(JSON.stringify(this.value))).map(x => x[1]);
      } else {
          this.selectedOptions = Array.isArray(this.value) ? this.value[0] : [this.value];
      }

      this.cachedSelOptions = JSON.parse(JSON.stringify(this.selectedOptions));
    },
    methods: {
      sendSelectedOptions() {
        console.log('hit here');
        let valueToSend = (this.selectedOptions && this.selectedOptions.constructor === Array)
          ? this.selectedOptions
          : [this.selectedOptions];

        // If more than 1 item is selected but we are displaying a one selection control
        // show just the first selected item
        if (!this.allowMultiSelect && valueToSend.length > 0) {
          valueToSend = valueToSend[0];
        }

        if (!this.options.allowMultiSelect) {
          console.log('HIT HERE');
          this.selectedOptions = Array.isArray(this.value) ? this.value[0] : [this.value];
        }
        if (!this.onlyKey) {
          if (Array.isArray(valueToSend)) {
            let newData = [];
            valueToSend.map((selected) => {
              this.responseList.map((item) => {
                if (item[this.optionKey] === selected.value) {
                  item['value'] = selected.value;
                  item['content'] = selected.content;
                  newData.push(item);
                }
              });
            });
            if (newData.length > 0) {
              valueToSend =  newData;
            }
            
          } else {
            let reponse = this.responseList.filter((item) => {
              item['value'] = valueToSend.value;
              item['content'] = valueToSend.content;
              
              return item[this.optionKey] === valueToSend.value;
            });
            if (reponse.length > 0) {
              valueToSend =  reponse[0];
            }
          }
          console.log('valueToSend', valueToSend, this.selectedOptions);
        }

        // if (!this.options.allowMultiSelect && this.options.renderAs == 'checkbox' && this.onlyKey) {
        //   valueToSend = valueToSend[this];
        //   console.log('RADIO', valueToSend);
        // }

        // if (this.options.renderAs == 'checkbox' && !this.options.allowMultiSelect && this.onlyKey) {
        //   console.log('radio button with objects returned');
        // }

        // console.log('VALUE TO SEND', valueToSend);
        console.log('emitted', valueToSend);
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
          this.debounceGetDataSource(selectedDataSource, selectedEndPoint, dataName, this.value, key, value, this.cachedSelOptions);
        }
        if (dataName) {
          if (this.options.valueTypeReturned === null) {
            return;
          }

          if (this.options.valueTypeReturned === 'single') {
            try {
            options = Object.values(_.get(this.validationData, dataName))
                .map(convertToSelectOptions)
                .filter(removeInvalidOptions);
              this.optionsList = options;
            } catch (error) {
              /* Ignore error */
            }
          }

          if (this.options.valueTypeReturned === 'object' && this.options.renderAs === 'dropdown') {
            const convertObjectToSelectOptions = option => ({
              value: option,
              content: (option[value || 'content']).toString(),
            });
            try {
              options = Object.values(_.get(this.validationData, dataName))
                .map(convertObjectToSelectOptions);
              this.optionsList = options;
            } catch(error) {
              /* Ignore error */
            }
          }
        }

      },
      onInput(value) {
        console.log('ON INPUT', value);
        this.selectedOptions =  value;
        this.sendSelectedOptions();
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

