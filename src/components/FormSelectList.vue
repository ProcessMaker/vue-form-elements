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
      :react-options="reactOptions"
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

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
      <div v-for="(error, index) in validatorErrors" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import Mustache from "mustache";
import { isEqual, cloneDeep, get, set } from "lodash";
import ValidationMixin from "./mixins/validation";
import MultiSelectView from "./FormSelectList/MultiSelectView";
import CheckboxView from "./FormSelectList/CheckboxView";
import OptionboxView from "./FormSelectList/OptionboxView";

const uniqIdsMixin = createUniqIdsMixin();

export default {
  components: {
    OptionboxView,
    MultiSelectView,
    CheckboxView
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "label",
    "error",
    "value",
    "options",
    "helper",
    "name",
    "controlClass",
    "validationData",
    "placeholder",
    "multiple"
  ],
  data() {
    return {
      lastRequest: {},
      previousSourceConfig: null,
      previousValidationData: null,
      previousValidationDataParent: null,
      selectListOptions: []
    };
  },
  computed: {
    validatorErrors() {
      return (this.validator && this.validator.errors.get(this.name)) || [];
    },
    divClass() {
      return this.toggle ? "custom-control custom-radio" : "form-check";
    },
    reactOptions() {
      this.fillSelectListOptions(true);
      return undefined;
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
      get() {
        if (this.options.renderAs === "dropdown") {
          let newValue = this.value;
          if (this.options.valueTypeReturned === "object" && this.value) {
            if (!Array.isArray(this.value)) {
              newValue = [this.value];
            }
            newValue.forEach((item) => {
              this.addObjectContentProp(item);
            });
          }
          return this.areItemsInSelectListOptions(newValue) ? this.value : [];
        }
        return this.value;
      },
      set(val) {
        return this.$emit("input", val);
      }
    },
    optionsKey() {
      if (
        this.options.dataSource &&
        this.options.dataSource === "provideData"
      ) {
        return "value";
      }

      if (
        this.options.dataSource &&
        this.options.dataSource === "dataConnector" &&
        this.options.valueTypeReturned === "object"
      ) {
        return this.optionsValue;
      }

      const fieldName = this.options.key || "value";

      return this.stripMustache(fieldName);
    },
    optionsValue() {
      if (
        this.options.dataSource &&
        this.options.dataSource === "provideData"
      ) {
        return "content";
      }
      return "__content__";
    },
    classList() {
      return {
        "has-errors":
          (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      };
    }
  },
  mounted() {
    // reset the value to null if the options list does not contain the selected value
    // Special Case String Value:
    //   Review test tests/e2e/specs/MultiselectWithStringValue.spec.js in ScreenBuilder
    const resetValueIfNotInOptions = typeof this.value !== "string";
    this.fillSelectListOptions(resetValueIfNotInOptions);
  },
  methods: {
    async loadOptionsFromDataConnector(options) {
      const { selectedEndPoint } = options;
      const { selectedDataSource } = options;
      const { dataName } = options;

      // If no data source has been specified, do not make the api call
      if (
        selectedDataSource === null ||
        typeof selectedDataSource === "undefined" ||
        selectedDataSource.toString().trim().length === 0
      ) {
        return false;
      }

      // Do not run in standalone mode
      if (!this.$dataProvider) {
        return false;
      }

      // If no endpoint has been specified, do not make the api call
      if (
        selectedEndPoint === null ||
        typeof selectedEndPoint === "undefined" ||
        selectedEndPoint.toString().trim().length === 0
      ) {
        return false;
      }

      const params = {
        config: {
          endpoint: selectedEndPoint
        }
      };

      if (
        typeof this.options.pmqlQuery !== "undefined" &&
        this.options.pmqlQuery !== "" &&
        this.options.pmqlQuery !== null
      ) {
        const data = this.makeProxyData();
        const pmql = Mustache.render(this.options.pmqlQuery, { data });
        params.config.outboundConfig = [
          { type: "PARAM", key: "pmql", value: pmql }
        ];
      }

      // @todo: Add debounce and/or cache or improve the way to do not re-run the same request
      // Do not re-run the same request
      const request = { selectedDataSource, params };
      if (isEqual(this.lastRequest, request)) {
        return false;
      }
      this.lastRequest = cloneDeep(request);

      try {
        const response = await this.$dataProvider.postDataSource(
          selectedDataSource,
          null,
          params
        );
        const list = dataName ? get(response.data, dataName) : response.data;
        const transformedList = this.transformOptions(list);
        this.$root.$emit("selectListOptionsUpdated", transformedList);
        this.selectListOptions = transformedList;
        return true;
      } catch (err) {
        /* Ignore error */
        console.warn(err);
        return false;
      }
    },
    searchChange(filter) {
      this.filter = filter;
      this.optionsFromDataSource();
    },

    /**
     * Transform the options to the format expected by the select list.
     *
     * @param {Boolean} resetValueIfNotInOptions
     */
    async fillSelectListOptions(resetValueIfNotInOptions) {
      let wasUpdated = false;
      if (
        this.options.dataSource &&
        this.options.dataSource === "provideData"
      ) {
        if (
          this.options &&
          this.options.optionsList &&
          !isEqual(this.selectListOptions, this.options.optionsList)
        ) {
          this.selectListOptions = this.options.optionsList;
        }
        this.selectListOptions = this.selectListOptions || [];
        wasUpdated = true;
      }

      if (this.options.dataSource && this.options.dataSource === "dataObject") {
        let requestOptions = [];
        try {
          const data = this.makeProxyData();
          requestOptions = get(data, this.options.dataName);
        } catch (e) {
          requestOptions = [];
        }

        const list = requestOptions || [];
        this.selectListOptions = this.transformOptions(list);
        wasUpdated = true;
      }

      if (
        this.options.dataSource &&
        this.options.dataSource === "dataConnector"
      ) {
        wasUpdated = await this.loadOptionsFromDataConnector(this.sourceConfig);
      }
      if (wasUpdated) {
        this.$nextTick(() => {
          this.updateWatcherDependentFieldValue(resetValueIfNotInOptions);
        });
      }
    },

    /**
     * @param {*|*[]} list, array of objects
     */
    transformOptions(list) {
      const suffix = this.attributeParent(this.options.value);
      const resultList = [];

      list.forEach((item) => {
        // if the content has a mustache expression
        const { escape } = Mustache;
        Mustache.escape = (t) => t; // Do not escape mustache content

        let parsedOption = {};
        if (this.options.key) {
          const itemValue =
            this.options.key.indexOf("{{") >= 0
              ? Mustache.render(this.options.key, item)
              : Mustache.render(`{{${this.options.key || "value"}}}`, item);
          parsedOption[this.optionsKey] = itemValue;
        }
        const itemContent =
          this.options.value.indexOf("{{") >= 0
            ? Mustache.render(this.options.value, item)
            : Mustache.render(`{{${this.options.value || "content"}}}`, item);

        Mustache.escape = escape; // Reset mustache to original escape function

        parsedOption[this.optionsValue] = itemContent;
        if (this.options.valueTypeReturned === "object") {
          parsedOption = suffix.length > 0 ? get(item, suffix) : item;
          if (!parsedOption.hasOwnProperty(this.optionsValue)) {
            Object.defineProperty(parsedOption, this.optionsValue, {
              get() {
                return itemContent;
              }
            });
          }
        }
        resultList.push(parsedOption);
      });
      return resultList;
    },
    addObjectContentProp(parsedOption) {
      if (!(parsedOption instanceof Object)) {
        return parsedOption;
      }
      const suffix = this.attributeParent(this.options.value);
      let contentProperty = this.options.value;
      if (contentProperty.indexOf("{{") === -1) {
        contentProperty = `{{ ${contentProperty} }}`;
      }
      if (!parsedOption.hasOwnProperty(this.optionsValue)) {
        Object.defineProperty(parsedOption, this.optionsValue, {
          get() {
            // note this = parsedOption
            let data = {};
            if (suffix) {
              set(data, suffix, this);
            } else {
              data = this;
            }
            return Mustache.render(contentProperty, data);
          }
        });
      }
      return parsedOption;
    },
    stripMustache(str) {
      const removed = str
        .replace(/{{/g, "")
        .replace(/}}/g, "")
        .split(".")
        .pop();

      return removed || str;
    },
    attributeParent(str) {
      // Check if the value has a mustache expression
      const isMustache = str.indexOf("{{") >= 0;
      // If mustache is present, find variables inside mustache
      if (isMustache) {
        const mustacheVariables = str.match(/{{[^}]+}}/g);
        if (mustacheVariables) {
          let result;
          mustacheVariables.forEach((variable) => {
            // Get owner variable. Ex. for `data.name.first` owner is `data.name`
            const stripped = variable.substr(2, variable.length - 4).trim();
            const splitted = stripped.split(".");
            splitted.pop();
            const owner = splitted.join(".");
            // Select the smallest owner
            if (!result || result.length > owner.length) {
              result = owner;
            }
          });
          return result;
        }
      } else {
        const splitted = str.trim().split(".");
        splitted.pop();
        const owner = splitted.join(".");
        return owner;
      }
    },
    /**
     * If the options list changes due to a dependant field change, we need to check if
     * the selected value still exists in the new set of options. If it's gone now, then
     * set this control's value to null.
     */
    updateWatcherDependentFieldValue(resetValueIfNotInOptions) {
      let hasKeyInOptions = true;

      if (Array.isArray(this.value)) {
        hasKeyInOptions = true;
        this.value.forEach((item) => {
          const hasItemInOption = this.selectListOptions.find((option) => {
            if (this.options.valueTypeReturned === "object") {
              return isEqual(option, item);
            }
            return get(option, this.optionsKey) === item;
          });

          hasKeyInOptions = hasKeyInOptions && hasItemInOption;
        });
      } else {
        hasKeyInOptions = this.selectListOptions.find((option) => {
          if (this.options.valueTypeReturned === "object") {
            return isEqual(option, this.value);
          }
          return get(option, this.optionsKey) === this.value;
        });
      }

      if (!hasKeyInOptions && resetValueIfNotInOptions) {
        this.$emit("input", null);
      }
    },
    /**
     * Returns true if one or more items in list (an array) are in Select List's options
     */
    areItemsInSelectListOptions(list) {
      if (!Array.isArray(list)) {
        return true;
      }

      const itemsInOptionsList = list.filter((item) => {
        const hasItemInOption = this.selectListOptions.find((option) => {
          if (this.options.valueTypeReturned === "object") {
            return isEqual(option, item);
          }
          return get(option, this.optionsKey) === item;
        });
        return hasItemInOption !== undefined;
      });

      return itemsInOptionsList.length > 0;
    }
  }
};
</script>
