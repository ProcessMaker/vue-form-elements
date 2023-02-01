// Import our components
import FormInput from "./FormInput";
import FormCheckbox from "./FormCheckbox";
import FormRadioButtonGroup from "./FormRadioButtonGroup";
import FormSelect from "./FormSelect";
import FormSelectList from "./FormSelectList";
import FormTextArea from "./FormTextArea";
import FormDatePicker from "./FormDatePicker";
import FormAccordion from "./FormAccordion";
import FormHtmlEditor from "./FormHtmlEditor";
import FormHtmlViewer from "./FormHtmlViewer";
import FormDelayTimeControl from "./FormDelayTimeControl";
import FormMultiSelect from "./FormMultiSelect";
import FormPlainMultiSelect from "./FormPlainMultiSelect";
import DataFormatMixin from "./mixins/DataFormat";
import hasDefaultOptionKeyMixin from "./mixins/hasDefaultOptionKey";
import ProxyDataMixin from "./mixins/ProxyData";
import ValidationMixin from "./mixins/validation";
import {
  getTimezone,
  getLang,
  getUserDateFormat,
  getUserDateTimeFormat,
  isValidDate,
  formatIfDate
} from "../dateUtils";

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
  FormPlainMultiSelect
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
    if (!components[component].name) components[component].name = component;
    Vue.component(components[component].name, components[component]);
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
  getTimezone,
  getLang,
  getUserDateFormat,
  getUserDateTimeFormat,
  isValidDate,
  formatIfDate
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
