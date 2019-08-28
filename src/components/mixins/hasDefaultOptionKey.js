export default {
  watch: {
    'options.defaultOptionKey': {
      immediate: true,
      handler(value) {
        !this.value ? this.$emit('input', value) : null;
      }
    },
  },
}
