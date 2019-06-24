export default {
  props: {
    dataFormat: {
      type: String,
      default() {
        return 'string';
      }
    },
  },
  data() {
    return {}
  },
  watch: {
    // Triggered whenever the v-model is updated
    value() {
      if (this.value && this.$parent.transientData) {
        this.$parent.transientData[this.name] = this.formatValue(this.value)
      }
    }
  },
  methods: {
    formatValue(value) {
      if (!value) {
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
          newValue = Number(newValue.replace(/[^0-9.-]+/g, ""));
          break;
        case 'date':
          newValue = Date.parse(newValue);
          break;
        case 'datetime':
          newValue = Date.parse(newValue);
          break;
        case 'float':
          newValue = parseFloat(newValue);
          break;
        case 'int':
          newValue = parseInt(newValue);
          break;
        default:
          newValue = newValue.toString();
          break;
      }

      return newValue;
    }
  }
}