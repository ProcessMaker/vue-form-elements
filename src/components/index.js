// Import our components
import FormInput from './FormInput.vue';
import FormCheckbox from './FormCheckbox.vue';
import FormRadioButtonGroup from './FormRadioButtonGroup.vue';
import FormSelect from './FormSelect.vue';
import FormSelectList from './FormSelectList.vue';
import FormTextArea from './FormTextArea.vue';
import FormDatePicker from './FormDatePicker.vue';
import FormAccordion from './FormAccordion.vue';
import FormHtmlEditor from './FormHtmlEditor.vue';
import FormHtmlViewer from './FormHtmlViewer.vue';
import FormDelayTimeControl from './FormDelayTimeControl.vue';
import FormMultiSelect from './FormMultiSelect.vue';
import FormPlainMultiSelect from './FormPlainMultiSelect.vue';
import RequiredAsterisk from './common/RequiredAsterisk.vue';
import * as dateUtils from '../dateUtils.js';

// Export our components
let components = {
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
    RequiredAsterisk
}

// Export our named exports
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
    dateUtils,
    RequiredAsterisk,
}

// Export our Vue plugin as our default
export default {
    install: function (Vue) {
        // First check to see if we're already installed
        if (Vue._processMakerVueFormElementsInstalled) {
            return
        }

        // Boolean flag to see if we're already installed
        Vue._processMakerVueFormElementsInstalled = true

        // Register each of our components
        for (let component in components) {
            Vue.component(component, components[component])
        }
    }
}
