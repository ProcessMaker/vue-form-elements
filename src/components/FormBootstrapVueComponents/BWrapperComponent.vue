<template>
  <div>
    <b-button @click="show = show ? false : true">{{ label }}</b-button>
    <div v-if="form">
      <component v-model="show" :is="bootstrapComponent" v-bind="bootstrapConfigObject">
        <vue-form-renderer
          v-model="wrapperModel"
          :page="form"
          :config="wrapperConfig"
          :current-page="form"
        />
      </component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    form: { type: String, default: ''}, // page #
    formConfig: { type: Array, default: () => [] }, // screen config
    bootstrapComponent: { type: String, default: 'b-modal' },
    bootstrapConfig: { type: String, default: '{}' },
    value: { default: null },
    name: { type: String, default: null },
    label: { type: String, default: '' },
  },
  data() {
    return {
      wrapperModel: {},
      show: false,
    };
  },
  mounted() {
  },
  computed: {
    wrapperConfig() {
      const config = [];
      config[this.form] = this.formConfig[this.form];
      return config;
    },
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