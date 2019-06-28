let Validator = require('validatorjs');

// To include another language in the Validator with variable processmaker
if (window.ProcessMaker && window.ProcessMaker.user && window.ProcessMaker.user.lang) {
  Validator.useLang(window.ProcessMaker.user.lang);
}

export default {
  props: {
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
      if (this.$parent.transientData) {
        this.$parent.transientData[this.name] = this.formatValue(this.value);
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

      console.log('Format value');
      console.log('value => ' + value);
      console.log('format => ' + typeof value);
      console.log('parse => ' + this.dataFormat);

      //Rules
      let rules = {
        'int': 'integer',
        'boolean': 'boolean',
        'string': 'string',
        'datetime': 'date',
        'date': 'date',
        'float': 'regex:/^[+-]?\\d+(\\.\\d+)?$/',
        'currency': 'regex:/^(?!0\\.00)[1-9]\\d{0,2}(,\\d{3})*(\\.\\d\\d)?$/',
      };
      //Validate rule format
      this.validatorFormat = new Validator( {[this.name]: value}, {[this.name]: rules[this.dataFormat]}, null);

      let newValue = value;
      if (this.validatorFormat.passes()) {
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
            //to_do format
            newValue = newValue.toString();
            //newValue = new Date(newValue).toISOString().substr(0,10);
            break;
          case 'datetime':
            //to_do format
            newValue = newValue.toString();
            /*let date = new Date(newValue).toISOString();
            newValue = date.substr(0,10);
            newValue= newValue + ' ' + date.substr(11, 8);*/
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
        console.log('New value');
        console.log('value => ' + newValue);
        console.log('parse => ' + typeof newValue);
      }

      return newValue;
    },
  },
};