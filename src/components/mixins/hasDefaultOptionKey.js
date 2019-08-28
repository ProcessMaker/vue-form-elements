export default {
  watch: {
    'options.defaultOptionKey': {
      immediate: true,
      handler(value) {
        !this.value ? this.$emit('input', value) : null;
      }
    },
    value: {
      immediate: true,
      handler() {
        !this.value && this.options.defaultOptionKey ? this.$emit('input', this.options.defaultOptionKey) : null;
      }
    },
  },
}
