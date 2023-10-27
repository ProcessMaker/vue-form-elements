import * as dateUtils from "../dateUtils";

export { default as FormAccordion } from "./FormAccordion.vue";
export { default as FormCheckbox } from "./FormCheckbox.vue";
export { default as FormDatePicker } from "./FormDatePicker.vue";
export { default as FormDelayTimeControl } from "./FormDelayTimeControl.vue";
export { default as FormHtmlEditor } from "./FormHtmlEditor.vue";
export { default as FormHtmlViewer } from "./FormHtmlViewer.vue";
export { default as FormInput } from "./FormInput.vue";
export { default as FormMultiSelect } from "./FormMultiSelect.vue";
export { default as FormPlainMultiSelect } from "./FormPlainMultiSelect.vue";
export { default as FormRadioButtonGroup } from "./FormRadioButtonGroup.vue";
export { default as FormSelect } from "./FormSelect.vue";
export { default as FormSelectList } from "./FormSelectList.vue";
export { default as FormTextArea } from "./FormTextArea.vue";
export * from "./common";
export * from "./FormBootstrapVueComponents";
export * from "./FormSelectList";
export * from "./mixins";
export { dateUtils };

// Export our Vue plugin as our default
export default function install(Vue) {
  // First check to see if we're already installed
  if (Vue._processMakerVueFormElementsInstalled) {
    return;
  }

  // Boolean flag to see if we're already installed
  Vue._processMakerVueFormElementsInstalled = true;

  // Register each of our components
  const vueComponents = require.context("./", true, /\.(vue)$/);

  vueComponents.keys().forEach((key) => {
    const component = vueComponents(key).default;

    // if a component has a name defined use the name, else use the path as the component name
    const name = component.name ? component.name : key.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, "");

    Vue.component(name, component);
  });
}

const plugin = {
  install
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}
