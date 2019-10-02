// Import our components
import FormInput from './FormInput'
import FormCheckbox from './FormCheckbox'
import FormRadioButtonGroup from './FormRadioButtonGroup'
import FormSelect from './FormSelect'
import FormSelectList from './FormSelectList'
import FormTextArea from './FormTextArea'
import FormDatePicker from './FormDatePicker'
import FormAccordion from './FormAccordion'
import FormHtmlEditor from './FormHtmlEditor'
import FormHtmlViewer from './FormHtmlViewer'
import FormDelayTimeControl from './FormDelayTimeControl'
import FormMultiSelect from './FormMultiSelect';

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
