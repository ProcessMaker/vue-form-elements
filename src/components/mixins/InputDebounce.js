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
      if (window.ProcessMaker && window.ProcessMaker.debounce) {
        if (typeof event === 'string' && !!event && event.target === undefined) {
          this.touched = true;
          return this.updateValue(event);
        }
        this.touched = true;
        this.updateValue(event.target.value);
      }
      else {
        let value = null;
        if (!!event && event.target === undefined) {
          value = event;
        }
        else {
          value = event.target.value;
        }
        this.touched = false;

        let valueToEmit = value;
        if (typeof this.convertToData !== 'undefined') {
          valueToEmit = this.convertToData(value);
        }

        this.$emit('input', valueToEmit);
        this.$emit('update:value', valueToEmit);
      }
    },
    updateValue: debounce(function (value) {
      this.touched = false;
      this.$emit('input', value);
      this.$emit('update:value', value);
    }, window.ProcessMaker && !window.ProcessMaker.debounce ? 30 : 600)
  }
};
