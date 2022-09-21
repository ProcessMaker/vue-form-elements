<template>
  <div class="form-group">
    <div>
      aca
      <div v-html="rendered"></div>
    </div>
  </div>
</template>

<script>
import Mustache from "mustache";
import ValidationMixin from "./mixins/validation";
import { formatIfDate } from "../dateUtils";

export default {
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
  mixins: [ValidationMixin],
  data() {
    return {
      customFunctions: {},
      originalEscapeFn: null
      
    };
  },
  computed: {
    rendered() {
      console.log("test computed");
      // if (!this.validationData) {
      //   return this.content;
      // }
      //  this.originalEscapeFn = Mustache.escape;
      //  Mustache.escape = this.mustacheEscapeFn;
      // try {
        // const parent = Object.assign(
        //   { _parent: this.validationData._parent },
        //   this.validationData
        // );
      //   if (this.renderVarHtml) {
      //     return Mustache.render(this.content, {
      //       ...this.customFunctions,
      //       ...this.validationData,
      //       ...parent
      //     });
      //   }
        // return Mustache.render(this.content, {
        //   ...this.customFunctions,
        //   ...this.validationData,
        //   ...parent
        // });
      // } catch (error) {
      //   if (this.renderVarHtml) {
      //     return this.renderVarName;
      //   }
      //   return this.content;
      // } finally {
      //   Mustache.escape = this.originalEscapeFn;
      // }
    }
  },
  methods: {
    mustacheEscapeFn(text) {
      text = formatIfDate(text);
      if (this.renderVarHtml) {
        return text;
      }
      return this.originalEscapeFn(text);
    }
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
