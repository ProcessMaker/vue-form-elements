<template>
  <div class='form-group'>
    <div :class="classList">
      <editor
        v-if="!$attrs.disabled"
        v-on="$listeners"
        v-bind="$attrs"
        :value="rendered"
        :init="editorSettings"
      />
      <div v-else v-html="rendered"></div>
    </div>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if='helper' class='form-text text-muted'>{{helper}}</small>
  </div>
</template>


<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import Mustache from 'mustache';
import Editor from './Editor'

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin()

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin],
  components: {
    Editor
  },
  props: [
    'error',
    'name',
    'helper',
    'controlClass',
    'content',
    'validationData',
    'label',
    'renderVarHtml',
    // 'value'
  ],
  computed:{
    classList(){
      let classList = {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
      }
      if(this.controlClass){
        classList[this.controlClass] = true
      }
      return classList
    },
    rendered() {
      if (!this.validationData) {
        return this.content;
      }

      try {
        if (this.renderVarHtml) {
          let escape = Mustache.escape;
          Mustache.escape = function(text) {return text;};
          let render = Mustache.render(this.content, {...this.customFunctions, ...this.validationData});
          Mustache.escape = escape;
          return render;
        }
        return Mustache.render(this.content, {...this.customFunctions, ...this.validationData});
      } catch (error) {
        if (this.renderVarHtml) {
          return this.renderVarName;
        }
        return this.content;
      }
    }
  },
  methods: {
    registerCustomFunction(name, implementation) {
      this.customFunctions[name] = implementation;
    },
  },
  data() {
    return {
      customFunctions: {},
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: [ 'link', 'lists' ],
        toolbar: 'undo redo | link | styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        skin: false,
        relative_urls: false,
        remove_script_host: false,
      },
    }
  }
}
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
