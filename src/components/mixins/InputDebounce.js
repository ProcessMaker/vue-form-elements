import debounce from 'lodash/debounce';

export default {
  props: ['value'],
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
      /** Rich text areas inputs an event that outputs a clean event string instead
       * of an event object that has a target and inside a value property as a structure
       * Checking if the event it is a string, if it is a truthy value, and it doesn't have
       * the property target in it
       * */
      let useDebounce = window.ProcessMaker &&
        (window.ProcessMaker.debounce === undefined || window.ProcessMaker.debounce === true)

      let value = (!!event && event.target === undefined) ? event : event.target.value;

      let valueToEmit = value;
      if (this.convertToData !== undefined) {
        valueToEmit = this.convertToData(value);
      }

      if (useDebounce) {
        this.touched = true;
        this.updateValue(valueToEmit);
      }
      else {
        this.touched = false;
        this.$emit('input', valueToEmit);
        this.$emit('update:value', valueToEmit);
      }
    },
    updateValue: debounce(function (value) {
      this.touched = false;
      this.$emit('input', value);
      this.$emit('update:value', value);
    }, 500, {'leading': true, 'trainling': false})
  }
};
