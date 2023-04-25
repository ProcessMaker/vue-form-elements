import Validator from "@chantouchsek/validatorjs";
import moment from "moment";
import { has } from "lodash-es";

export default {
  name: 'ValidationMixin',
  props: [
    "validation",
    "validationData",
    "validationField",
    "validationMessages"
  ],
  computed: {
    isReadOnly() {
      if (
        this.readonly ||
        this.disabled ||
        this.$attrs.readonly ||
        this.$attrs.disabled
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.setValidatorLanguage();
    this.updateValidation();
    this.observeElementMutations();
  },
  data() {
    return {
      validator: {}
    };
  },
  watch: {
    // Triggered whenever the v-model is updated
    value() {
      this.updateValidation();
    },
    // Triggered whenever the validation rule is updated
    validation() {
      this.updateValidation();
    },
    label() {
      this.updateValidation();
    },
    readonly() {
      this.updateValidation();
    },
    disabled() {
      this.updateValidation();
    },
    validationData: {
      handler() {
        this.updateValidation();
      },
      deep: true
    }
  },
  methods: {
    /**
     * Create a proxy for an empty object. in order to avoid unespected refresh
     * @return {object} proxy
     */
    makeProxyData() {
      const control = this;
      const handler = {
        get: (target, name) => {
          // customFunctions is used by RichText controls
          // to add custom Mustache functions
          if (control.customFunctions && control.customFunctions[name]) {
            return control.customFunctions[name];
          }
          if (name === "_parent") {
            const screenOwner = control.getScreenOwner();
            return (
              (screenOwner && screenOwner._parent) || // Get _parent for the current screen (e.g. Inside Loops, Inside Tabs?, RecordLists...?)
              control.validationData._parent
            ); // Get _parent for the Request Data (e.g. Inside a SubProcess)
          }
          // Check if validationData is empty
          if (
            control.validationData === undefined ||
            control.validationData === null
          ) {
            return undefined;
          }
          return control.validationData[name];
        },
        has(target, name) {
          // customFunctions is used by RichText controls
          // to add custom Mustache functions
          if (control.customFunctions && control.customFunctions[name]) {
            return true;
          }
          if (name === "_parent") {
            return true;
          }
          // Check if validationData is empty
          if (
            control.validationData === undefined ||
            control.validationData === null
          ) {
            return false;
          }
          return control.validationData[name] !== undefined;
        }
      };
      return new Proxy({}, handler);
    },
    /**
     * Gets the screen parent or null if don't have
     * @returns {object|null}
     */
    getScreenOwner() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === "ScreenContent") {
          return parent;
        }
        parent = parent.$parent;
      }
      return null;
    },
    observeElementMutations() {
      new MutationObserver(this.handleMutations).observe(this.$el, {
        attributes: true,
        attributeFilter: ["readonly", "disabled"],
        subtree: true
      });
    },
    handleMutations(mutations) {
      mutations.forEach((mutation) => {
        if (mutation.type == "attributes") {
          this.updateValidation();
        }
      });
    },
    setValidatorLanguage() {
      let globalObject = typeof window === "undefined" ? global : window;

      if (globalObject.validatorLanguageSet) {
        return;
      }

      if (has(globalObject, "ProcessMaker.user.lang")) {
        Validator.useLang(globalObject.ProcessMaker.user.lang);
      } else if (document.documentElement.lang) {
        Validator.useLang(document.documentElement.lang);
      }

      globalObject.validatorLanguageSet = true;
    },
    updateValidation() {
      if (this.validation && !this.isReadOnly) {
        let fieldName = this.validationField ? this.validationField : this.name;
        let data = this.validationData
          ? this.validationData
          : { [fieldName]: this.value };
        let validationRules = "";

        if (typeof this.validation !== "string" && this.validation.length) {
          let rules = [];

          this.validation.forEach((configs) => {
            if (!configs.value) {
              return;
            }
            rules.push(configs.value);
          });

          validationRules = rules;
        } else {
          validationRules = this.validation;
        }

        let rules = {
          [fieldName]: validationRules
        };
        this.registerCustomRules(data);
        this.validator = new Validator(data, rules, {
          validationMessages: this.validationMessages
            ? this.validationMessages
            : null
        });
        this.validator.setAttributeNames({ [fieldName]: this.label });
        this.validator.errors.first(this.name);
        // Validation will not run until you call passes/fails on it
        this.validator.passes();
      } else {
        this.validator = null;
      }
    },
    registerCustomRules(data) {
      Validator.register(
        "custom-same",
        function (val, req) {
          let val1;
          let val2 = val;
          if (!req.includes(".")) {
            val1 = this.validator._flattenObject(this.validator.input)[req];
          } else {
            val1 = req
              .split(".")
              .reduce((obj, i) => obj[i], this.validator.input);
          }

          if (val1 === val2) {
            return true;
          }

          return false;
        },
        "The :attribute and :custom-same fields must match."
      );

      Validator.register(
        "after",
        function (date, params) {
          // checks if incoming 'params' is a date or a key reference.
          let checkDate = moment(params);
          if (!checkDate.isValid()) {
            params = data[params];
          }

          const inputDate = moment(date).toISOString();
          const afterDate = moment(params).toISOString();

          return inputDate > afterDate;
        },
        "The :attribute must be after :after."
      );

      Validator.register(
        "after_or_equal",
        function (date, params) {
          // checks if incoming 'params' is a date or a key reference.
          let checkDate = moment(params);
          if (!checkDate.isValid()) {
            params = data[params];
          }

          const inputDate = moment(date).toISOString();
          const equalOrAfterDate = moment(params).toISOString();

          return inputDate >= equalOrAfterDate;
        },
        "The :attribute must be equal or after :after_or_equal."
      );

      Validator.register(
        "before",
        function (date, params) {
          // checks if incoming 'params' is a date or a key reference.
          let checkDate = moment(params);
          if (!checkDate.isValid()) {
            params = data[params];
          }

          const inputDate = moment(date).toISOString();
          const beforeDate = moment(params).toISOString();

          return inputDate < beforeDate;
        },
        "The :attribute must be before :before."
      );

      Validator.register(
        "before_or_equal",
        function (date, params) {
          // checks if incoming 'params' is a date or a key reference.
          let checkDate = moment(params);
          if (!checkDate.isValid()) {
            params = data[params];
          }

          const inputDate = moment(date).toISOString();
          const beforeDate = moment(params).toISOString();

          return inputDate <= beforeDate;
        },
        "The :attribute must be equal or before :before_or_equal."
      );

      Validator.register(
        "required_if",
        function (val, req, attribute) {
          if (typeof req === "string") {
            req = req.split(",");
          }

          let inputtedValue = this.validator._objectPath(
            this.validator.input,
            req[0]
          );

          switch (typeof inputtedValue) {
            case "boolean":
            case "number":
              if (inputtedValue.toString() == req[1]) {
                return this.validator.getRule("required").validate(val);
              }
              break;
            default:
              if (inputtedValue == req[1]) {
                return this.validator.getRule("required").validate(val);
              }
              break;
          }
          return true;
        },
        "The :attribute field is required."
      );

      Validator.register(
        "required_unless",
        function (val, req, attribute) {
          if (typeof req === "string") {
            req = req.split(",");
          }

          let inputtedValue = this.validator._objectPath(
            this.validator.input,
            req[0]
          );

          switch (typeof inputtedValue) {
            case "boolean":
            case "number":
              if (inputtedValue.toString() !== req[1]) {
                return this.validator.getRule("required").validate(val);
              }
              break;
            default:
              if (inputtedValue !== req[1]) {
                return this.validator.getRule("required").validate(val);
              }
              break;
          }
          return true;
        },
        "The :attribute field is required."
      );

      Validator.register(
        "between",
        function (value, req) {
          const number = Number(value);
          const min = req.split(",")[0];
          const max = req.split(",")[1];
          if (number >= min && number <= max) {
            return true;
          }
          return false;
        },
        "Must have a value between :between"
      );
    }
  }
};
