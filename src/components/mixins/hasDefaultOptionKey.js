export default {
  props: ['defaultValue'],
  watch: {
    defaultValue: {
      immediate: true,
      handler(value) {
        !this.value ? this.$emit('input', value) : null;
      }
    },
  },
}
