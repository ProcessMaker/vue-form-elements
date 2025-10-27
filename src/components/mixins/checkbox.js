export default {
  computed: {
    divClass() {
      return this.toggle ? "custom-control custom-radio" : "form-check";
    },
    labelClass() {
      return this.toggle ? "custom-control-label" : "form-check-label";
    },
    inputClass() {
      return [
        { [this.controlClass]: !!this.controlClass },
        { "is-invalid": (this.validator && this.validator.errorCount) || this.error },
        this.toggle ? "custom-control-input" : "form-check-input"
      ];
    }
  },
  methods: {
    getOptionValue(option) {
      return option[this.optionValue || "value"];
    },
    getOptionContent(option) {
      return option[this.optionContent || "content"];
    },
    getOptionAriaLabel(option) {
      let ariaLabel = "";
      if (this.optionsExtra?.length) {
        const optionExtra = this.optionsExtra.find(
          (extra) => extra.hasOwnProperty(this.optionValue) && extra[this.optionValue] === option[this.optionValue]
        );
        if (optionExtra) {
          ariaLabel = optionExtra[this.optionAriaLabel || "ariaLabel"] ?? "";
        }
      } else {
        ariaLabel = option[this.optionAriaLabel || "ariaLabel"] ?? "";
      }
      return !ariaLabel || ariaLabel === "" ? this.getOptionContent(option) : ariaLabel;
    },
    getOptionId(option, index) {
      return `${this.name}-${this.getOptionValue(option)}-${index}`;
    }
  }
};
