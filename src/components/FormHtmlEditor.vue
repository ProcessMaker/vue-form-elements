<template>
  <div class='form-group'>
    <div :class="classList">
      <editor
        v-on="$listeners"
        v-bind="$attrs"
        :value="rendered"
        :init="editorSettings"
      />
    </div>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{ error }}</div>
      <div v-if="error">{{ error }}</div>
    </div>
    <small v-if='helper' class='form-text text-muted'>{{ helper }}</small>
  </div>
</template>


<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import ValidationMixin from './mixins/validation';
import Editor from '@tinymce/tinymce-vue';
import Mustache from 'mustache';
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.inline.min.css';

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  mixins: [uniqIdsMixin, ValidationMixin],
  components: {
    Editor,
  },
  props: [
    'error',
    'name',
    'helper',
    'controlClass',
    'content',
    'validationData',
  ],
  computed:{
    classList(){
      let classList = {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
      };
      if (this.controlClass){
        classList[this.controlClass] = true;
      }
      return classList;
    },
    rendered() {
      if (!this.validationData) {
        return this.content;
      }

      try {
        return Mustache.render(this.content, this.validationData);
      } catch (error) {
        return this.content;
      }
    },
  },
  data() {
    return {
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: [ 'link', 'lists' ],
        toolbar: 'undo redo | link | styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        skin: false,
      },
    };
  },
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
