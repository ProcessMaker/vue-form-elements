<template>
  <div class="form-group">
    <div>
      <editor
        v-if="!$attrs.disabled"
        v-on="$listeners"
        :value="content"
        :init="editorSettings"
      />
      <div v-else v-html="rendered"></div>
    </div>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import ValidationMixin from "./mixins/validation";
import Editor from "./Editor";

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

export default {
  name: "FormHtmlEditor",
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin],
  components: {
    Editor
  },
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
  data() {
    return {
      customFunctions: {},
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: ["link", "lists"],
        toolbar: `undo redo | link | styleselect | bold italic forecolor |
          alignleft aligncenter alignright alignjustify |
          bullist numlist outdent indent`,
        skin: false,
        relative_urls: false,
        remove_script_host: false
      }
    };
  }
};
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
