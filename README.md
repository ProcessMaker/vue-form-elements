# processmaker/vue-form-elements
Reusable VueJS form elements that renders with Bootstrap 4

## Summary
This is a collection of simple and rich form elements that can be bound to a parent VueJS component 
utilizing v-model.  If you are using Bootstrap 4, then the rendering of these elements will be easy to 
use and fit right into your html rendering.

## Preview
If you want to preview the elements in action, clone the github repository and run the npm run serve target. 
The vue-cli project will launch locally and you'll be able to play with each of the form elements.

## Example Usage For All Form Elements
```javascript
// Bring in the Javascript Distribution
import Vue from 'vue'
import VueFormElements from '@processmaker/vue-form-elements'

Vue.use(VueFormElements)
```
Using the above, the components are globally registered with VueJS.

# Example Usage For Single Form Element (Using Single File Components)

```javascript
import {FormInput, FormSelect} from '@processmaker/vue-form-elements'

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

## Field Parameters
The following are parameters used in the components to configure it

### v-model (required)
Provides two-way binding to a variable.

### name (required)
Specify the name of the field. This is used for certain operations and for labeling when used with validation rules.

### type (optional for input type)
Specifies the type for the input field. This can be text(default) or password or any other html5 supported type.

### options (required for select and radio button group)
An array of objects that represents possible options for the field. Each object contains two properties. 'content' is 
the text label of the option. 'value' is the value that will be assigned if the option is selected.

### error (optional)
An optional error to render with the field.

### rows (optional, for textarea field)
The number of rows to provide input for the textarea control.

Other properties may exist. Refer to the source code of the control to see what additional properties are available.

## Validation
Validation is performed by the https://github.com/skaterdav85/validatorjs library in order to resemble
the functionality of Laravel validation rules.  Please see this repository for more information on applicable 
rules.

### Validation Parameters
* validation: string representation of the validation rules
* validationData: a reference to a data model to validate against. Useful if you are using rules that reference other properties
* validationMessages: A custom map of validation messages to use if defaults are not wanted (ex: translations). See validatorjs repository for the formatting of this parameter.


## Running with Docker (Development)
To test VueFormElements using Docker, you can build this image locally and test it out. By running these commands from your terminal.
```shell
docker build vfe:<tag name> .
docker run -p 8080:8080 -d vfe:<tag name> 
```
OR

You can use **docker compose** to spin up your container easily by running these commands
```shell
docker compose build
docker compose up
```
Once you are done, you can `control + c` to terminate the process 
* Go to your browser and go to http://localhost:8080
