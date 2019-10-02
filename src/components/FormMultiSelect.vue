<template>
  <div class="form-group">
    <label v-uni-for="name">{{label}}</label>

    <multiselect
      v-bind="$attrs"
      v-on="$listeners"
      v-uni-id="name"
      :name="name"
      :track-by="optionValue"
      :label="optionContent"
      :class="{'border border-danger':error}"
      :placeholder="placeholder ? placeholder : $t('type here to search')"
    >
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>

    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>

    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import {createUniqIdsMixin} from 'vue-uniq-ids'
  import ValidationMixin from './mixins/validation'

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    components: {
      Multiselect
    },
    mixins: [uniqIdsMixin, ValidationMixin],
    props: [
      'optionValue',
      'optionContent',
      'label',
      'error',
      'helper',
      'name',
      'controlClass',
      'placeholder',
    ],
    computed: {
      classList() {
        return {
          'is-invalid': (this.validator && this.validator.errorCount) || this.error,
          [this.controlClass]: !!this.controlClass
        }
      },
    },
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style >
  .multiselect__content-wrapper {
    position: relative !important;
  }
</style>
