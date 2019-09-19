<template>
    <multiselect
      v-bind="$attrs"
      v-model="content"
      :track-by="optionValue"
      :label="optionContent"
      :class="{'border border-danger':error}"
      :loading="loading"
      :placeholder="placeholder ? placeholder : $t('type here to search')"
      :options="options"
      :searchable="true"
      :internal-search="false">
      <template slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </template>
      <template slot="noOptions">
        {{ $t('No Data Available') }}
      </template>
    </multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import {createUniqIdsMixin} from 'vue-uniq-ids'

  const uniqIdsMixin = createUniqIdsMixin();

  export default {
    inheritAttrs: false,
    components: {
      Multiselect
    },
    mixins: [uniqIdsMixin],
    props: [
      'optionValue',
      'optionContent',
      'label',
      'error',
      'value',
      'options',
      'helper',
      'name',
      'controlClass',
      'validationData',
      'placeholder',
    ],
    data() {
      return {
        content: [],
        loading: false
      }
    },
    watch: {
      content: {
        handler() {
          let data = [];
          if (Array.isArray(this.content)) {
            data = this.content.map(item => {
              return item[this.optionValue];
            });
          } else {
            data.push(this.content[this.optionValue]);
          }

          this.$emit("input", data);
        }
      },
      value: {
        immediate: true,
        handler() {
          // Load selected item.
          if (Array.isArray(this.value) && this.value.length !== 0 && this.content.length === 0) {
              this.value.map(value => {
                let option = this.options.filter(item => item[this.optionValue] === value);
                if (option.length) {
                  this.content.push(option[0]);
                }
              });
          }
        },
      }
    },
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

<style lang="css">
  .multiselect__content-wrapper {
    position: relative !important;
  }

</style>


