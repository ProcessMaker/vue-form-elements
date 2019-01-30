// Import our components
import FormInput from './FormInput'
import FormCheckbox from './FormCheckbox'
import FormRadioButtonGroup from './FormRadioButtonGroup'
import FormSelect from './FormSelect'
import FormTextArea from './FormTextArea'
import FormDatePicker from './FormDatePicker'


// Export our components
let components = {
    FormInput,
    FormCheckbox,
    FormRadioButtonGroup,
    FormSelect,
    FormTextArea,
    FormDatePicker
}

// Export our named exports
export {
    FormInput,
    FormCheckbox,
    FormRadioButtonGroup,
    FormSelect,
    FormTextArea,
    FormDatePicker
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
