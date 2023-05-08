<template>
  <div class="form-group">
    <label v-uni-for="name">{{ label }}</label>
    <component v-uni-id="name" :is="bootstrapComponent" v-bind="bootstrapConfigObject" v-model="model"></component>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
const uniqIdsMixin = createUniqIdsMixin();

export default {
  props: {
    bootstrapComponent: { type: String, default: 'b-form-tags' },
    bootstrapConfig: { type: String, default: '{}' },
    value: { default: null },
    name: { type: String, default: null },
    label: { type: String, default: '' },
  },
  mixins: [uniqIdsMixin],
  data() {
    return {};
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    bootstrapConfigObject() {
      let config = {};
      try {
        config = JSON.parse(this.bootstrapConfig);
      } catch (e) {
        config = {}
      }
      return config;
    }
  },
};
</script>