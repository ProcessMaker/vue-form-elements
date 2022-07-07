import debounce from 'lodash/debounce';

export default {
  props: {
    value: String,
    type: {type: String}
  },
  data() {
    return {
      internalValue: this.value,
      touched: false
    };
  },
  watch: {
    value(value) {
      if (!this.touched) this.internalValue = value;
    }
  },
  methods: {
    updateInternalValue(event) {
      this.touched = true;
      this.updateValue(event.target.value);
    },
    updateValue: debounce(function (value) {
      this.touched = false;
      this.$emit('input', value);
      this.$emit('update:value', value);
    }, 600)
  }
};
