<template>
  <div class='form-group'>
    <div :class="classList">
      <editor
        v-model="content"
        :init="editorSettings"
        v-bind:disabled="disabled"
        :id="name"
        @onFocus="$emit('onFocus')"
        @onBlur="$emit('onBlur')">
      </editor>
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
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin()

export default {
  mixins: [uniqIdsMixin, ValidationMixin],
  components: {
      Editor
  },
  props: [
    'label',
    'error',
    'name',
    'required',
    'value',
    'helper',
    'disabled',
    'controlClass'
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
    }
  },
  data() {
    return {
      editorSettings: {
        inline: true,
        menubar: false,
        plugins: [ 'link', 'lists' ],
        toolbar: "undo redo | link | styleselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
        skin: "oxide",
        skin_url: '/tinymce/skins/ui/oxide',
      },
      content: '',
    }
  },
  watch: {
    content() {
      this.$emit('input', this.content)
    },
    value() {
      this.content = this.value;
    }
  },
  mounted() {
    this.content = this.value;
  }
}
</script>

<style lang='scss' scoped>
.invalid-feedback {
  display: block;
}
div.is-invalid {
  border: 1px solid #dc3545;
  border-radius: 0.25rem;
}
</style>
