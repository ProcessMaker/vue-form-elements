// Export our components
export {default as FormInput} from './FormInput'
export {default as FormCheckbox} from './FormCheckbox'
export {default as FormRadioButtonGroup} from './FormRadioButtonGroup'
export {default as FormSelect} from './FormSelect'
export {default as FormSelectList} from './FormSelectList'
export {default as FormTextArea} from './FormTextArea'
export {default as FormDatePicker} from './FormDatePicker'
export {default as FormAccordion} from './FormAccordion'
export {default as FormHtmlEditor} from './FormHtmlEditor'
export {default as FormHtmlViewer} from './FormHtmlViewer'
export {default as FormDelayTimeControl} from './FormDelayTimeControl'
export {default as FormMultiSelect} from './FormMultiSelect';
export {default as FormPlainMultiSelect} from './FormPlainMultiSelect';
export * as dateUtils from '../dateUtils';

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
