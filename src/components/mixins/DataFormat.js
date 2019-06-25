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
    return {};
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
      let newValue = value;
      switch (this.dataFormat) {
        case 'string':
          newValue = newValue.toString();
          break;
        case 'boolean':
          newValue = Boolean(newValue);
          break;
        case 'currency':
          newValue = parseFloat(newValue);
          break;
        case 'date':
          newValue = Date.parse(newValue);
          break;
        case 'datetime':
          newValue = Date.parse(newValue);
          break;
        case 'float':
          newValue = parseFloat(newValue.toString().replace(',', '.'));
          break;
        case 'int':
          newValue = Number(newValue);
          break;
        default:
          newValue = newValue.toString();
          break;
      }

      return newValue;
    },
  },
};