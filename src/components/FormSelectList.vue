<template>
  <div class="form-group">
    <required-asterisk /><label v-uni-for="name">{{ label }}</label>
    <multi-select-view
      v-if="options.renderAs === 'dropdown'"
      v-model="valueProxy"
      v-uni-id="name"
      :option-value="optionsKey"
      :option-content="optionsValue"
      :option-aria-label="optionsAriaLabel"
      :placeholder="placeholder ? placeholder : $t('Select...')"
      :show-labels="false"
      :options="selectListOptionsWithSelected"
      :react-options="reactOptions"
      :class="classList"
      :emit-objects="options.valueTypeReturned === 'object'"
      :emit-array="options.allowMultiSelect"
      v-bind="$attrs"
      :loading="loading"
      @search-change="searchChange"
    >
    </multi-select-view>

    <div v-if="options.renderAs === 'checkbox'">
      <optionbox-view
        v-model="valueProxy"
        :name="name"
        :allow-multiselect="options.allowMultiSelect"
        :option-value="optionsKey"
        :option-content="optionsValue"
        :option-aria-label="optionsAriaLabel"
        :options="selectListOptionsWithSelected"
        :options-extra="options.optionsListExtra"
        :react-options="reactOptions"
        :emit-objects="options.valueTypeReturned === 'object'"
        v-bind="$attrs"
      />
    </div>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback d-block">
      <div v-for="(error, index) in validatorErrors" :key="index">
        {{ error }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import Mustache from "mustache";
import { isEqual, cloneDeep, get, set, debounce } from "lodash";
import ValidationMixin from "./mixins/validation";
import MultiSelectView from "./FormSelectList/MultiSelectView";
import OptionboxView from "./FormSelectList/OptionboxView";
import RequiredAsterisk from "./common/RequiredAsterisk";

const uniqIdsMixin = createUniqIdsMixin();

const MAX_COLLECTION_RECORDS = 100;

export default {
  components: {
    OptionboxView,
    MultiSelectView,
    RequiredAsterisk
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
    "multiple",
    "transientData"
  ],
  data() {
    return {
      lastRequest: {},
      previousSourceConfig: null,
      previousValidationData: null,
      previousValidationDataParent: null,
      selectListOptions: [],
      selectedOption: null,
      loading: false,
      loaded: false,
      previousDependentValue: null,
      filter: "",
      countWithoutFilter: null
    };
  },
  computed: {
    selectListOptionsWithSelected() {
      if (this.selectedOption && !this.selectListOptions.some((o) => o.value === this.selectedOption.value)) {
        return [this.selectedOption, ...this.selectListOptions];
      }
      return this.selectListOptions;
    },
    collectionOptions() {
      return get(this.options, "collectionOptions");
    },
    isDataConnector() {
      return get(this.options, "dataSource") === "dataConnector";
    },
    isCollection() {
      return get(this.options, "dataSource") === "collection";
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    validatorErrors() {
      return (this.validator && this.validator.errors.get(this.name)) || [];
    },
    divClass() {
      return this.toggle ? "custom-control custom-radio" : "form-check";
    },
    reactOptions() {
      const isString = typeof this.value === "string";
      let resetValueIfNotInOptions = true;

      // If is the first time is loaded and the type of the value is string,
      // should not reset the dependent select ..
      if (!this.loaded && isString) {
        resetValueIfNotInOptions = false;
      }

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loaded = true;
      this.fillSelectListOptions(resetValueIfNotInOptions);

      return undefined;
    },
    sourceConfig() {
      return {
        dataSource: this.options.dataSource,
        collectionOptions: this.options.collectionOptions,
        selectedEndPoint: this.options.selectedEndPoint,
        selectedDataSource: this.options.selectedDataSource,
        valueTypeReturned: this.options.valueTypeReturned,
        dataName: this.options.dataName,
        value: this.options.value,
        key: this.options.key,
        ariaLabel: this.options.optionAriaLabel
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
        this.selectedOption = val ? this.selectListOptions.find((o) => o.value === val) : null;
        return this.$emit("input", val);
      }
    },
    optionsKey() {
      if (this.options.dataSource && this.options.dataSource === "provideData") {
        return "value";
      }

      if (this.options.dataSource && this.options.dataSource === "dataConnector" && this.options.valueTypeReturned === "object") {
        return this.optionsValue;
      }

      const fieldName = this.options.key || "value";

      return this.stripMustache(fieldName);
    },
    optionsValue() {
      if (this.options.dataSource && (this.options.dataSource === "provideData" || this.isCollection)) {
        return "content";
      }
      return "__content__";
    },
    optionsAriaLabel() {
      if (this.options.dataSource && (this.options.dataSource === "provideData" || this.isCollection)) {
        return "ariaLabel";
      }
      return "__ariaLabel__";
    },
    classList() {
      return {
        "has-errors": (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      };
    }
  },
  watch: {
    selectListOptions: {
      handler() {
        if (this.isCollection) {
          if (this.value && !this.selectListOptions.some((o) => o.value === this.value)) {
            this.loadIndividualRecord();
          }
        }
      }
    }
  },
  methods: {
    /**
     * Checks if multi-select is disabled.
     *
     * @return {boolean} Returns true if multi-select is disabled, false otherwise.
     */
    isMultiSelectDisabled() {
      return this.options.allowMultiSelect === false;
    },
    hasNestedProperty(obj, path) {
      return path.split(".").reduce((acc, part) => acc && acc[part], obj);
    },
    renderPmql(pmql) {
      if (typeof pmql !== "undefined" && pmql !== "" && pmql !== null) {
        const data = this.makeProxyData();
        const preprocessedTemplate = pmql.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
          return this.hasNestedProperty(data, key) ? match : `[[[${key}]]]`;
        });
        const output = Mustache.render(preprocessedTemplate, data);
        const last = Mustache.render(output.replace("[[[", "{{").replace("]]]", "}}"), { data });
        return last;
      }
      return "";
    },

    /**
     * Load select list options from a data connector
     *
     * @param {object} options
     * @returns {boolean}
     */
    async loadOptionsFromDataConnector(options) {
      const { selectedEndPoint, selectedDataSource, dataName } = options;
      if (!this.shouldLoadOptionsFromDataConnector(selectedDataSource, selectedEndPoint)) {
        return false;
      }
      const params = this.prepareParamsForDataConnector(selectedEndPoint);
      const request = { selectedDataSource, params };
      if (isEqual(this.lastRequest, request)) {
        return false;
      }
      this.lastRequest = cloneDeep(request);
      return await this.fetchDataSourceOptions(selectedDataSource, params, dataName);
    },

    shouldLoadOptionsFromDataConnector(selectedDataSource, selectedEndPoint) {
      if (this.isEditorMode()) {
        return false;
      }
      // If no data source has been specified, do not make the api call
      if (this.isNoDataSourceSelected(selectedDataSource)) {
        return false;
      }
      // If no endpoint has been specified, do not make the api call
      if (this.isNoEndpointSelected(selectedEndPoint)) {
        return false;
      }
      // Do not run in standalone mode
      if (this.isStandaloneMode()) {
        return false;
      }
      return true;
    },
    isEditorMode() {
      return this.mode === "editor";
    },
    isNoDataSourceSelected(dataSource) {
      return dataSource === null || typeof dataSource === "undefined" || dataSource.toString().trim().length === 0;
    },
    isNoEndpointSelected(endpoint) {
      return endpoint === null || typeof endpoint === "undefined" || endpoint.toString().trim().length === 0;
    },
    isStandaloneMode() {
      return !this.$dataProvider;
    },
    prepareParamsForDataConnector(selectedEndPoint) {
      const params = {
        config: {
          endpoint: selectedEndPoint
        }
      };
      const pmql = this.renderPmql(this.options.pmqlQuery);
      if (pmql) {
        params.config.outboundConfig = [
          {
            type: "PARAM",
            key: "pmql",
            value: pmql
          }
        ];
      }
      return params;
    },
    async fetchDataSourceOptions(dataSource, params, dataName) {
      try {
        let resolvedNonce = null;
        let response = null;
        // Nonce ensures we only use results from the latest request
        this.nonce = Math.random();
        [response, resolvedNonce] = await this.$dataProvider.getDataSource(dataSource, params, this.nonce);
        if (resolvedNonce !== this.nonce) {
          return;
        }
        this.nonce = null;
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
    async loadOptionsFromCollection() {
      if (this.mode === "editor") {
        return false;
      }

      if (
        !this.collectionOptions ||
        !this.collectionOptions.collectionId ||
        !this.collectionOptions.labelField ||
        !this.collectionOptions.valueField
      ) {
        return false;
      }

      const options = {
        params: { per_page: MAX_COLLECTION_RECORDS }
      };

      let pmql = this.renderPmql(this.collectionOptions.pmql);

      pmql = this.includeFilterInPmql(pmql);

      if (pmql) {
        options.params.pmql = pmql;
      }

      if (this.collectionOptions.unique) {
        options.params.groupBy = this.collectionOptions.labelField;
      }

      await this.getCollectionRecords(options);

      return true;
    },
    formatCollectionRecordResults(record) {
      let content = get(record, this.collectionOptions.labelField);
      let value = get(record, this.collectionOptions.valueField);
      const ariaLabel = get(record, this.collectionOptions.ariaLabelField || this.collectionOptions.labelField);

      // Special handler for file uploads
      if (typeof content === "object" && "name" in content) {
        content = content.name;
      }
      if (typeof value === "object" && "id" in value) {
        value = value.id;
      }

      return {
        value: String(value),
        content: String(content),
        ariaLabel: String(ariaLabel)
      };
    },
    includeFilterInPmql(pmql) {
      if (this.filter) {
        const filterPmql = `${this.collectionOptions.labelField} like "%${this.filter}%"`;
        if (pmql) {
          pmql = `(${pmql}) AND ${filterPmql}`;
        } else {
          pmql = filterPmql;
        }
      }
      return pmql;
    },
    async loadIndividualRecord() {
      let pmql = this.renderPmql(this.collectionOptions.pmql);
      const recordPmql = `${this.collectionOptions.valueField} = "${this.value}"`;
      if (pmql) {
        pmql += ` AND ${recordPmql}`;
      } else {
        pmql = recordPmql;
      }

      this.loading = true;
      const [data] = await this.$dataProvider.getCollectionRecords(this.collectionOptions.collectionId, { params: { pmql } });
      this.loading = false;

      if (data.data && data.data.length > 0) {
        this.selectedOption = this.formatCollectionRecordResults(data.data[0]);
      } else {
        this.selectedOption = null;
        this.updateWatcherDependentFieldValue(true);
      }
    },
    async getCollectionRecords(options) {
      let data = { data: [] };
      let resolvedNonce = null;

      // Nonce ensures we only use results from the latest request
      this.nonce = Math.random();

      this.loading = true;
      [data, resolvedNonce] = await this.$dataProvider.getCollectionRecords(this.collectionOptions.collectionId, options, this.nonce);
      this.loading = false;

      if (resolvedNonce !== this.nonce) {
        return;
      }

      this.nonce = null;

      if (!this.filter) {
        this.countWithoutFilter = data.meta ? data.meta.total : null;
      }

      this.selectListOptions = data.data.map(this.formatCollectionRecordResults);
    },
    debouncedSetFilter: debounce(function (value) {
      this.filter = value;
    }, 300),
    searchChange(value) {
      if (this.isCollection) {
        if (this.countWithoutFilter && this.countWithoutFilter < MAX_COLLECTION_RECORDS) {
          // No need to backend filter since all items were returned
          return;
        }
        this.loading = true;
        this.debouncedSetFilter(value);
      }
    },
    /**
     * Transform the options to the format expected by the select list.
     *
     * @param {Boolean} resetValueIfNotInOptions
     */
    async fillSelectListOptions(resetValueIfNotInOptions) {
      let wasUpdated = false;
      if (this.options.dataSource && this.options.dataSource === "provideData") {
        if (this.options && this.options.optionsList && !isEqual(this.selectListOptions, this.options.optionsList)) {
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

      if (this.options.dataSource && this.options.dataSource === "dataConnector") {
        wasUpdated = await this.loadOptionsFromDataConnector(this.sourceConfig);
      }

      if (this.isCollection) {
        await this.loadOptionsFromCollection();
        wasUpdated = false; // we call updateWatcherDependentFieldValue later
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

      if (!Array.isArray(list)) {
        console.warn(`The retrieved data is not an array. Please check the data sources options of the select list \`${this.name}\``);
        return resultList;
      }

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

        // Modified ariaLabel handling
        let itemAriaLabel = itemContent;
        if (this.options.optionAriaLabel) {
          itemAriaLabel =
            this.options.optionAriaLabel.indexOf("{{") >= 0
              ? Mustache.render(this.options.optionAriaLabel, item)
              : Mustache.render(`{{${this.options.optionAriaLabel || "ariaLabel"}}}`, item);
        }

        Mustache.escape = escape; // Reset mustache to original escape function

        parsedOption[this.optionsValue] = itemContent;
        parsedOption[this.optionsAriaLabel] = itemAriaLabel;

        if (this.options.valueTypeReturned === "object") {
          parsedOption = suffix.length > 0 ? get(item, suffix) : item;
          if (!parsedOption.hasOwnProperty(this.optionsValue)) {
            Object.defineProperty(parsedOption, this.optionsValue, {
              get() {
                return itemContent;
              }
            });
          }
          if (!parsedOption.hasOwnProperty(this.optionsAriaLabel)) {
            Object.defineProperty(parsedOption, this.optionsAriaLabel, {
              get() {
                return itemAriaLabel;
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
      let ariaLabelProperty = this.options.ariaLabel || this.options.value;

      if (contentProperty.indexOf("{{") === -1) {
        contentProperty = `{{ ${contentProperty} }}`;
      }
      if (ariaLabelProperty.indexOf("{{") === -1) {
        ariaLabelProperty = `{{ ${ariaLabelProperty} }}`;
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

      if (!parsedOption.hasOwnProperty(this.optionsAriaLabel)) {
        Object.defineProperty(parsedOption, this.optionsAriaLabel, {
          get() {
            // note this = parsedOption
            let data = {};
            if (suffix) {
              set(data, suffix, this);
            } else {
              data = this;
            }
            return Mustache.render(ariaLabelProperty, data);
          }
        });
      }

      return parsedOption;
    },
    stripMustache(str) {
      const removed = str.replace(/{{/g, "").replace(/}}/g, "").split(".").pop();

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
     * @param {boolean} resetValueIfNotInOptions
     */
    updateWatcherDependentFieldValue(resetValueIfNotInOptions) {
      let hasKeyInOptions = true;

      if (Array.isArray(this.value)) {
        hasKeyInOptions = true;
        this.value.forEach((item) => {
          const hasItemInOption = this.selectListOptionsWithSelected.find((option) => {
            if (this.options.valueTypeReturned === "object") {
              return isEqual(option, item);
            }
            return get(option, this.optionsKey) === item;
          });

          hasKeyInOptions = hasKeyInOptions && hasItemInOption;
        });
      } else {
        hasKeyInOptions = this.selectListOptionsWithSelected.find((option) => {
          if (this.options.valueTypeReturned === "object") {
            return isEqual(option, this.value);
          }
          return get(option, this.optionsKey) === this.value;
        });
      }

      if (!hasKeyInOptions && resetValueIfNotInOptions) {
        this.$emit("reset", this.name);
      }
    },
    /**
     * Returns true if one or more items in list (an array) are in Select List's options
     * @param {array} list
     * @returns {boolean}
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
