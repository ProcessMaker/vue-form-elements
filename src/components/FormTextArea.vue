<template>
  <div class="form-group">
  <label v-uni-for="label">{{label}}</label>
    <div v-if="richtext" :class="classList" v-uni-id="label">
      <div v-if="readonly" v-html="value"></div>
      <editor
        v-if="!readonly"
        v-bind="$attrs"
        :value="value"
        :init="editorSettings"
        :name="name"
        @input="$emit('input', $event)"
      />
    </div>
    <textarea
      v-else
      v-bind="$attrs"
      v-uni-id="label"
      class="form-control"
      :class="classList"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <display-errors v-if="error || (validator && validator.errorCount)" :name="name" :error="error" :validator="validator"/>
    <small v-if='helper' class='form-text text-muted'>{{helper}}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids'
import ValidationMixin from './mixins/validation'
import DataFormatMixin from './mixins/DataFormat';
import DisplayErrors from './common/DisplayErrors';

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    DisplayErrors,
    Editor: () => {
      if (typeof window !== 'undefined') {
        return import(/* webpackChunkName: "tinymce" */ './Editor');
      }
    }
  },
  mixins: [uniqIdsMixin, ValidationMixin, DataFormatMixin],

  props: [
    'label',
    'error',
    'name',
    'value',
    'helper',
    'controlClass',
    'richtext',
    'readonly'
  ],
  computed: {
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
        'form-control': this.richtext && !this.readonly,
        'richtext': this.richtext && !this.readonly,
      };
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
        relative_urls: false,
        remove_script_host: false,
      },
    }
  }
}
</script>

<style>
.form-group .richtext {
  height: auto;
}
</style>

