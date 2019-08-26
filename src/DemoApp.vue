<template>
    <div class="container">
        <h1>vue-form-elements playground</h1>
        <form-select name="sampleSelect"
                     label="Sample Select"
                     :options="multiOptions"
                     v-model="data.sampleSelect"
                     helper="This is a sample of a select field."
                     validation="in:red,blue">
        </form-select>
        <!--<form-input name="sampleInput"-->
                    <!--label="Sample Input with Validation"-->
                    <!--helper="This is sample help text for the sample input field. This field is required and has a minimum length of 2 characters."-->
                    <!--v-model="data.sampleInput"-->
                    <!--:validation="inputValidationRules">-->
        <!--</form-input>-->
        <!--<form-input name="password.value"-->
                    <!--label="Sample Input to support Password masking"-->
                    <!--type="password"-->
                    <!--helper="This password style implementation has complex validation rules. The field must be 9 characters long with at least one alphabetic, lower and upper case, numeric and symbol"-->
                    <!--v-model="data.password.value"-->
                    <!--:validation="passwordValidationRules">-->
        <!--</form-input>-->
        <!--<form-input name="password.confirm"-->
                    <!--label="Sample Input with validation rule to match another property"-->
                    <!--type="password"-->
                    <!--helper="This password style has validation rules to match another field"-->
                    <!--v-model="data.password.confirm"-->
                    <!--:validationData="data"-->
                    <!--:validation="confirmPasswordValidationRules">-->
        <!--</form-input>-->
        <!--<form-input name="sampleError"-->
                    <!--label="Sample Field With External Forced Error"-->
                    <!--helper="This field will show an error by using the error prop. This example field is controlling the data that will be passed in to the error prop"-->
                    <!--:error="data.sampleError"-->
                    <!--v-model="data.sampleError">-->
        <!--</form-input>-->
        <!--<form-input name="sampleCustomValidationError"-->
                    <!--label="Sample Custom Validation Message"-->
                    <!--helper="This field has a required field that has a custom validation error message by using the validationMessages property."-->
                    <!--v-model="data.sampleCustomValidationError"-->
                    <!--validation="required"-->
                    <!--:validationMessages="customValidationMessages">-->
        <!--</form-input>-->
        <!--<form-text-area name="sampleText"-->
                        <!--label="Sample Text Area"-->
                        <!--rows="4"-->
                        <!--helper="This text area has a maximum character limit of 20 validation rule."-->
                        <!--validation="max:20"-->
                        <!--v-model="data.sampleText">-->
        <!--</form-text-area>-->
        <!--Current Character Count: {{data.sampleText.length}}-->
        <!--<form-select name="sampleSelect"-->
                     <!--label="Sample Select"-->
                     <!--:options="multiOptions"-->
                     <!--v-model="data.sampleSelect"-->
                     <!--helper="This is a sample select field with a validation rule that it must match red"-->
                     <!--validation="in:red">-->
        <!--</form-select>-->
        <!--<form-radio-button-group name="sampleRadioButtonGroup"-->
                                 <!--label="Sample Radio Button Group"-->
                                 <!--:options="radioButtonOptions"-->
                                 <!--helper="This shows rendering a radio button group with a required validation rule"-->
                                 <!--validation="required">-->
        <!--</form-radio-button-group>-->
        <!--<form-checkbox name="sampleCheckbox"-->
                       <!--label="Sample Checkbox"-->
                       <!--v-model="data.sampleCheckbox"-->
                       <!--helper="This checkbox represents a boolean in the data model.">-->
        <!--</form-checkbox>-->
        <!--Current Value: {{data.sampleCheckbox}}-->

        <!--<form-checkbox name="sampleCustomCheckbox"-->
                       <!--label="Sample Custom Checkbox"-->
                       <!--v-model="data.sampleCustomCheckbox"-->
                       <!--toggle="true"-->
                       <!--helper="This checkbox represents a boolean in the data model. Need parameter 'toggle=true' for enable custom switches">-->
        <!--</form-checkbox>-->
        <!--Current Value: {{data.sampleCustomCheckbox}}-->
        <!--<form-radio-button-group name="sampleCustomRadioButtonGroup"-->
                                 <!--toggle="true"-->
                                 <!--label="Sample Custom Radio Button Group"-->
                                 <!--:options="radioButtonOptions"-->
                                 <!--helper="This shows rendering a radio button group with a required validation rule. Need parameter 'toggle=true' for enable custom radio"-->
                                 <!--validation="required">-->
        <!--</form-radio-button-group>-->
        <!--<form-date-picker-->
                <!--label="Sample calendar"-->
                <!--placeholder="Placeholder Sample Calendar"-->
                <!--helper="Helper Sample Calendar, Theming is supported by overwriting CSS classes."-->
                <!--format="yyyy-MM-dd tttt"-->
                <!--:use12-hour="true"-->
                <!--:minuteStep="2"-->
                <!--:phrases="{ ok: 'Save', cancel: 'Cancel' }"-->
                <!--v-model="data.sampleDatePicker">-->
        <!--</form-date-picker>-->
        <!--<form-html-editor-->
            <!--name="sampleHtmlText"-->
            <!--label="Sample Html Editor"-->
            <!--v-model="data.sampleHtmlText"-->
            <!--validation="required|max:300" class="mt-3"-->
        <!--/>-->
        <!--<form-delay-time-control-->
            <!--name="sampleDelayTimeControl"-->
            <!--v-model="data.sampleDelayTimeControl"-->
            <!--label="Sample delay time control"-->
            <!--helper="Example 7 minutes (PT7M)"-->
            <!--validation="required"-->
        <!--/>-->
    </div>
</template>


<script>
  // We're bringing in our Vue plugin
  import Vue from 'vue'
  import VueFormElements from './components/index';
  import FormDatePicker from './components/FormDatePicker';
  import { DateTime } from 'luxon';

  // Register our plugin
  Vue.use(VueFormElements)

  export default {
    components: {FormDatePicker},
    data() {
      return {
        // The data model to bind our elements to
        data: {
          sampleInput: '',
          sampleText: '',
          sampleHtmlText: '<h3>Edit this text inline</h3> <ul> <li>Add some <a href="https://github.com/ProcessMaker/vue-form-elements/branches">links</a></li> <li><span style="color: #8e44ad;">Color</span> some text</li> </ul>',
          // Shows off ability to nest and refer to items deep in data model
          password: {
            value: '',
            confirm: ''
          },
          sampleCheckbox: false,
          sampleCustomCheckbox: false,
          sampleRadioButtonGroup: '',
          sampleSelect: '',
          sampleCustomValidationError: '',
          sampleDatePicker: DateTime.local().toISO(),
          sampleDelayTimeControl: '',
        },
        inputValidationRules: 'required|min:2',
        textValidationRules: 'max:255',
        passwordValidationRules: 'required|regex:/(?=.{9,})(?=.*?[^\\w\\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/',
        confirmPasswordValidationRules: 'required|same:password.value',
        multiOptions: {
          dataName: 'nombreDeDatos',
          key: 'value',
          value: 'content',
          pmqlQuery: '',
          renderAs: 'dropdown',
          allowMultiSelect: false,
        },

        selectOptions: [
          {
            content: 'Green',
            value: 'green'
          },
          {
            content: 'Red',
            value: 'red'
          },
          {
            content: 'Blue',
            value: 'blue'
          },
          {
            content: 'Yellow',
            value: 'yellow'
          },
          {
            content: 'White',
            value: 'white'
          },
          {
            content: 'Black',
            value: 'black'
          },
        ],
        radioButtonOptions: [
          {
            content: 'Small',
            value: 'small'
          },
          {
            content: 'Medium',
            value: 'medium'
          },
          {
            content: 'Large',
            value: 'large'
          },
          {
            content: 'X-Large',
            value: 'xlarge'
          },
        ],
        customValidationMessages: {
          required: 'This field is totally required and you should, like, put it in.'
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
    .container {
        margin-bottom: 32px;
    }

</style>
