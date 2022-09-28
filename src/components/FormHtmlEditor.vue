<template>
  <div class="form-group">
    <div :class="classList">
      <editor
        v-if="!$attrs.disabled"
        :value="content"
        :init="editorSettings"
        v-bind="$attrs"
        v-on="$listeners"
      />
      <div v-else>{{ content }}</div>
    </div>
    <div
      v-if="(validator && validator.errorCount) || error"
      class="invalid-feedback"
    >
      <div
        v-for="(error, index) in validator.errors.get(this.name)"
        :key="index"
      >
        {{ error }}
      </div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { createUniqIdsMixin } from "vue-uniq-ids";
import Mustache from "mustache";
import ValidationMixin from "./mixins/validation";
import Editor from "./Editor";
import { formatIfDate } from "../dateUtils";

import { useHtmlEditorControl } from "../utils/composition.js";
// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

export default defineComponent({
  components: {
    Editor
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "error",
    "name",
    "helper",
    "controlClass",
    "content",
    "validationData",
    "label",
    "renderVarHtml"
  ],
  setup(props) {
    useHtmlEditorControl(props);
  },
  data() {
    return {
      originalEscapeFn: null,
      customFunctions: {},
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: ["link", "lists"],
        toolbar: `undo redo | link | styleselect | bold italic forecolor |
           alignleft aligncenter alignright alignjustify | bullist numlist outdent indent`,
        skin: false,
        relative_urls: false,
        remove_script_host: false
      }
    };
  },
  computed: {
    classList() {
      const classList = {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error
      };
      if (this.controlClass) {
        classList[this.controlClass] = true;
      }
      return classList;
    },
    rendered() {
      const data = this.makeProxyData();
      this.overwriteMustacheEscape();
      try {
        if (this.renderVarHtml) {
          return Mustache.render(this.content, data);
        }
        return Mustache.render(this.content, data);
      } catch (error) {
        if (this.renderVarHtml) {
          return this.renderVarName;
        }
        return this.content;
      } finally {
        Mustache.escape = this.originalEscapeFn;
      }
    }
  },
  methods: {
    /**
     * Create a proxy for an empty object. in order to avoid unespected refresh
     * @return {object} proxy
     */
    makeProxyData() {
      const control = this;
      const handler = {
        get: (target, name) => {
          if (control.customFunctions[name]) {
            return control.customFunctions[name];
          }
          if (name === "_parent") {
            return (
              control.validationData._parent || control.validationData._parent
            );
          }
          return control.validationData[name];
        },
        has(target, name) {
          if (control.customFunctions[name]) {
            return true;
          }
          if (name === "_parent") {
            return true;
          }
          return control.validationData[name] !== undefined;
        }
      };
      return new Proxy({}, handler);
    },
    /**
     * Backup and overwrite the original mustache escape property
     */
    overwriteMustacheEscape() {
      this.originalEscapeFn = Mustache.escape;
      Mustache.escape = this.mustacheEscapeFn;
    },
    /**
     * Register custom functions to be included
     * @param {string} name
     * @param {object} implementation
     */
    registerCustomFunction(name, implementation) {
      this.customFunctions[name] = implementation;
    },
    /**
     * Escape the mustache code, added in the tinyMCE editor
     * @param {string} text
     * @return {object}
     */
    mustacheEscapeFn(text) {
      const formatedText = formatIfDate(text);
      if (this.renderVarHtml) {
        return formatedText;
      }
      return this.originalEscapeFn(formatedText);
    }
  }
});
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.is-invalid {
  border: 1px solid #dc3545;
  border-radius: 0.25rem;
}
</style>
