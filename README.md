# processmaker/vue-form-elements
Reusable VueJS form elements that renders with Bootstrap 4

## Summary
This is a collection of simple and rich form elements that can be bound to a parent VueJS component 
utilizing v-model.  If you are using Bootstrap 4, then the rendering of these elements will be easy to 
use and fit right into your html rendering.

## Example Usage For All Form Elements
```javascript
// Bring in the Javascript Distribution
import Vue from 'vue'
import VueFormElements from '@processmaker/vue-form-elements'

// Bring in the CSS File
import '@processmaker/vue-form-elements/dist/vue-form-elements.css'

Vue.use(VueFormElements)
```
Using the above, the components are globally registered with VueJS.

# Example Usage For Single Form Element (Using Single File Components)
* Note: You must have the vue-loader (https://vue-loader.vuejs.org/) with webpack in order to use the Single File Components independently
```javascript
import {FormInput, FormSelect} from '@processmaker/src/components'

new Vue({
    el: '#example',
    components: {
        FormInput
    }
})
```

## Components

### FormInput
Renders an input field, allowing types of text, password, email, search, date, datetime-local

### FormCheckbox
Renders a checkbox field, allowing the grouping of checkboxes by passing in a name property.

### FormRadioButtonGroup
Renders a radio button group, passing in options through a property.

### FormSelect
Renders a select field with options being passed in through a property.

### FormTextArea
Renders a textarea field