<template>
  <div class="form-group">
    <label v-uni-for="name" v-if="label">{{ label }}</label>
    <multiselect
      v-model="selected"
      v-uni-id="name"
      :name="name"
      :multiple="multiple"
      :options="options"
      :track-by="optionValue"
      :label="optionContent"
      :class="{'border border-danger':isError}"
      :placeholder="placeholder ? placeholder : $t('type here to search')"
    >
      <template slot="noResult">{{ $t('No elements found. Consider changing the search query.') }}</template>
      <template slot="noOptions">{{ $t('No Data Available') }}</template>
    </multiselect>

    <display-errors v-if="isError" :name="name" :error="error" class="d-block" />
    <small v-if="helper" class="form-text text-muted">{{helper}}</small>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { createUniqIdsMixin } from "vue-uniq-ids";
import ValidationMixin from "./mixins/validation";
import DisplayErrors from "./common/DisplayErrors";
import { get } from "lodash";

const uniqIdsMixin = createUniqIdsMixin();

export default {
  inheritAttrs: false,
  components: {
    Multiselect,
    DisplayErrors,
  },
  mixins: [uniqIdsMixin, ValidationMixin],
  props: {
    value: { type: [String, Array, Object] },
    optionValue: String,
    optionContent: String,
    options: Array,
    label: { type: String, default: "" },
    error: String,
    helper: String,
    name: String,
    controlClass: { type: [String, Array, Object] },
    placeholder: String,
    onlyKey: { type: Boolean, default: false },
    multiple: { type: Boolean, default: true },
  },
  data() {
    return {
      selected: null,
      reemitInput: false,
    };
  },
  computed: {
    classList() {
      return {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
      };
    },
    isError() {
      return this.error;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value, oldValue) {
        console.log("FORM SELECT VALUE CHANGED", value);
        if (
          typeof value === "undefined" ||
          value === null ||
          !Array.isArray(value) ||
          value.length <= 0
        ) {
          return;
        }

        let firstValToEmit =
          typeof value[0] === "object"
            ? JSON.stringify(this.valueToUseForEmit(value[0]))
            : value[0];

        let firstVal =
          typeof value[0] === "object" ? JSON.stringify(value[0]) : value[0];

        if (
          firstValToEmit === firstVal &&
          JSON.stringify(value) === JSON.stringify(oldValue) &&
          !this.reemitInput
        ) {
          return;
        }
        this.reemitInput = false;

        let selectedArray = [];
        value.forEach((item) => {
          let foundOption = this.options.find((option) => {
            if (option.value == this.keyElementValue(item)) {
              return item;
            }
          });
          if (foundOption) {
            selectedArray.push(foundOption);
          }
        });

        // this.selected = selectedArray;

        console.log("selectedArray", selectedArray);

        // if (this.multiple) {
        //   this.selected = selectedArray;
        // } else {
        //   this.selected = selectedArray.length > 0 ? selectedArray[0] : [];
        // }

        if (this.multiple) {
          let emit = [];
          value.map((item) => {
            emit.push(this.valueToUseForEmit(item));
          });
          console.log("emitted value from plain mulit 1");
          this.selected = selectedArray;
          this.$emit("input", emit);
        } else {
          console.log(
            "emitted value from plain mulit",
            this.valueToUseForEmit(value[0])
          );
          this.selected = selectedArray.length > 0 ? selectedArray[0] : [];
          this.$emit("input", this.valueToUseForEmit(value[0]));
        }
      },
    },
    selected() {
      console.log("FROM MULITSELECT FORM", this.selected);
      if (
        typeof this.selected === "undefined" ||
        this.selected === null ||
        this.selected.length <= 0
      ) {
        console.log("-------------------- empty");
        this.$emit("input", this.multiple ? [] : "");
        return;
      }

      if (this.multiple) {
        //   console.log('has mulitple');
        let emit = [];
        this.selected.map((item) => {
          console.log("ITEM", item);
          emit.push(this.valueToUseForEmit(item));
        });
        this.$emit("input", emit);
      } else {
        this.$emit("input", this.valueToUseForEmit(this.selected));
      }

      // this.$emit('input', this.valueToUseForEmit(this.selected));
    },
  },
  methods: {
    setReemit: function (value) {
      this.reemitInput = value;
    },
    valueToUseForEmit: function (element) {
      if (this.onlyKey) {
        if (typeof element.value == "undefined") {
          return element;
        }
        return typeof element.value === "object"
          ? element.value[this.optionValue]
          : element.value;
      } else {
        return typeof element.value === "object" ? element.value : element;
      }
    },

    valueType: function (value) {
      if (typeof value != "object") {
        return "scalar";
      }

      if (typeof value.value == "object") {
        return "nested";
      } else {
        return "object";
      }
    },

    keyValue: function (element) {
      if (this.onlyKey) {
        switch (this.valueType(element)) {
          case "scalar":
            return element;
          case "object":
            return element[this.optionValue];
          case "nested":
            return element.value[this.optionValue];
          default:
            return element;
        }
      } else {
        switch (this.valueType(element)) {
          case "scalar":
            return null;
          case "object":
            return element;
          case "nested":
            return element.value;
          default:
            return element;
        }
      }
    },

    keyElementValue: function (element) {
      switch (this.valueType(element)) {
        case "scalar":
          return element;
        case "object":
          return element[this.optionValue];
        case "nested":
          return element.value[this.optionValue];
        default:
          return element;
      }
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
