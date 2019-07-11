import Validator from 'validatorjs';

// To include another language in the Validator with variable processmaker
if (window.ProcessMaker && window.ProcessMaker.user && window.ProcessMaker.user.lang) {
  Validator.useLang(window.ProcessMaker.user.lang);
}

export default {
  props: {
    transientData: Object,
    dataFormat: {
      type: String,
      default() {
        return 'string';
      },
    },
  },
  data() {
    return {
      validatorFormat: null,
    };
  },
  watch: {
    // Triggered whenever the v-model is updated
    value() {
      if (this.transientData) {
        this.transientData[this.name] = this.formatValue(this.value);
      }
    },
  },
  methods: {
    formatValueWith(value, format) {
      this.$set(this, 'dataFormat', format);
      return this.formatValue(value);
    },
    formatValue(value) {
      if (!value && this.dataFormat !== 'boolean') {
        return '';
      }
      return this.validateRuleFormat(value) ? this.formatValueIfValid(value) : value;
    },
    validateRuleFormat(value) {
      const rules = {
        'int': 'integer',
        'boolean': 'boolean',
        'string': 'string',
        'datetime': 'date',
        'date': 'date',
        'float': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
        'currency': 'regex:/^\\d{1,3}(,\\d{3})*(\\.\\d\\d)?(\\D{0,3})$/',
      };
      this.validatorFormat = new Validator( {[this.name]: value}, {[this.name]: rules[this.dataFormat]}, null);
      return this.validatorFormat.passes();
    },
    formatValueIfValid(newValue) {
      this.validatorFormat = null;
      switch (this.dataFormat) {
        case 'string':
          newValue = newValue.toString();
          break;
        case 'boolean':
          newValue = Boolean(newValue);
          break;
        case 'currency':
          newValue = newValue.toString();
          break;
        case 'date':
          newValue = newValue.toString();
          break;
        case 'datetime':
          newValue = newValue.toString();
          break;
        case 'float':
          newValue = Number(newValue);
          break;
        case 'int':
          newValue = parseInt(newValue);
          break;
        default:
          newValue = newValue.toString();
          break;
      }
      return newValue;
    },
  },
};