// Import our components
import FormInput from "./FormInput.vue";
import FormCheckbox from "./FormCheckbox.vue";
import FormRadioButtonGroup from "./FormRadioButtonGroup.vue";
import FormSelect from "./FormSelect.vue";
import FormSelectList from "./FormSelectList.vue";
import FormTextArea from "./FormTextArea.vue";
import FormDatePicker from "./FormDatePicker.vue";
import FormAccordion from "./FormAccordion.vue";
import FormHtmlEditor from "./FormHtmlEditor.vue";
import FormHtmlViewer from "./FormHtmlViewer.vue";
import FormDelayTimeControl from "./FormDelayTimeControl.vue";
import FormMultiSelect from "./FormMultiSelect.vue";
import FormPlainMultiSelect from "./FormPlainMultiSelect.vue";
import DataFormatMixin from "./mixins/DataFormat.js";
import hasDefaultOptionKeyMixin from "./mixins/hasDefaultOptionKey.js";
import ProxyDataMixin from "./mixins/ProxyData.js";
import ValidationMixin from "./mixins/validation.js";
import RequiredAsterisk from "./common/RequiredAsterisk.vue";
import BFormComponent from "./FormBootstrapVueComponents/BFormComponent.vue";
import BWrapperComponent from "./FormBootstrapVueComponents/BWrapperComponent.vue";
import { formatIfDate, getLang, getTimezone, getUserDateFormat, getUserDateTimeFormat, isValidDate } from "../dateUtils.ts";

import * as dateUtils from "../dateUtils.ts";

// Export our components
const components = {
  FormInput,
  FormCheckbox,
  FormRadioButtonGroup,
  FormSelect,
  FormSelectList,
  FormTextArea,
  FormDatePicker,
  FormAccordion,
  FormHtmlEditor,
  FormHtmlViewer,
  FormDelayTimeControl,
  FormMultiSelect,
  FormPlainMultiSelect,
  RequiredAsterisk,
  BFormComponent,
  BWrapperComponent,
};

const mixins = {
  DataFormatMixin,
  hasDefaultOptionKeyMixin,
  ProxyDataMixin,
  ValidationMixin
};

function install(Vue) {
  // First check to see if we're already installed
  if (this._processMakerVueFormElementsInstalled) {
    return;
  }

  // Boolean flag to see if we're already installed
  this._processMakerVueFormElementsInstalled = true;
  for (const component in components) {
    const name = components[component].name ?? component.replace(/^.*[\\/]/, "").replace(/\.[^/.]+$/, "");
    Vue.component(name, components[component]);
  }
  for (const mixin in mixins) {
    Vue.mixin(mixins[mixin].name);
  }
}

export default { install };

export {
  FormInput,
  FormCheckbox,
  FormRadioButtonGroup,
  FormSelect,
  FormSelectList,
  FormTextArea,
  FormDatePicker,
  FormAccordion,
  FormHtmlEditor,
  FormHtmlViewer,
  FormDelayTimeControl,
  FormMultiSelect,
  FormPlainMultiSelect,
  DataFormatMixin,
  hasDefaultOptionKeyMixin,
  ProxyDataMixin,
  ValidationMixin,
  RequiredAsterisk,
  BFormComponent,
  BWrapperComponent,
  getTimezone,
  getLang,
  getUserDateFormat,
  getUserDateTimeFormat,
  isValidDate,
  formatIfDate,
  dateUtils
};

// Export our Vue plugin as our default
// export default {
//   install: function (Vue) {
//     // First check to see if we're already installed
//     if (Vue._processMakerVueFormElementsInstalled) {
//       return
//     }
//
//     // Boolean flag to see if we're already installed
//     Vue._processMakerVueFormElementsInstalled = true
//
//     // Register each of our components
//     for (let component in components) {
//       Vue.component(component, components[component])
//     }
//   }
// }
