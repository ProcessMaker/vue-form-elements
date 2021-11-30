<template>
  <div class="container">
    <h1>vue-form-elements playground</h1>
    <form-select-list v-model="data.sampleSelect"
                      :options="selectOptions"
                      helper="This is a sample select list field with a validation rule that it must match red"
                      label="Sample Select List"
                      name="sampleSelectList"
                      validation="in:red">
    </form-select-list>
    <form-input v-model="data.sampleInput"
                :validation="inputValidationRules"
                helper="This is sample help text for the sample input field. This field is required and has a minimum length of 2 characters."
                label="Sample Input with Validation"
                name="sampleInput">
    </form-input>
    <form-input v-model="data.password.value"
                :validation="passwordValidationRules"
                helper="This password style implementation has complex validation rules. The field must be 9 characters long with at least one alphabetic, lower and upper case, numeric and symbol"
                label="Sample Input to support Password masking"
                name="password.value"
                type="password">
    </form-input>
    <form-input v-model="data.password.confirm"
                :validation="confirmPasswordValidationRules"
                :validationData="data"
                helper="This password style has validation rules to match another field"
                label="Sample Input with validation rule to match another property"
                name="password.confirm"
                type="password">
    </form-input>
    <form-input v-model="data.sampleError"
                :error="data.sampleError"
                helper="This field will show an error by using the error prop. This example field is controlling the data that will be passed in to the error prop"
                label="Sample Field With External Forced Error"
                name="sampleError">
    </form-input>
    <form-input v-model="data.sampleCustomValidationError"
                :validationMessages="customValidationMessages"
                helper="This field has a required field that has a custom validation error message by using the validationMessages property."
                label="Sample Custom Validation Message"
                name="sampleCustomValidationError"
                validation="required">
    </form-input>
    <form-text-area v-model="data.sampleText"
                    :richtext="richtext"
                    error="This error is shown by default"
                    helper="This text area has a maximum character limit of 20 validation rule."
                    label="Sample Text Area"
                    name="sampleText"
                    rows="4"
                    validation="max:20">
    </form-text-area>
    Current Character Count: {{ data.sampleText.length }}
    <form-checkbox v-model="richtext"
                   helper=""
                   label="Use richtext editor for above textarea"
                   name="useRichtext"
                   toggle="true">
    </form-checkbox>

    <form-select v-model="data.sampleSelect"
                 :options="selectOptions"
                 helper="This is a sample select field with a validation rule that it must match red"
                 label="Sample Select"
                 name="sampleSelect"
                 validation="in:red">
    </form-select>
    <form-radio-button-group :options="radioButtonOptions"
                             helper="This shows rendering a radio button group with a required validation rule"
                             label="Sample Radio Button Group"
                             name="sampleRadioButtonGroup"
                             validation="required">
    </form-radio-button-group>
    <form-checkbox v-model="data.sampleCheckbox"
                   helper="This checkbox represents a boolean in the data model."
                   label="Sample Checkbox"
                   name="sampleCheckbox">
    </form-checkbox>
    Current Value: {{ data.sampleCheckbox }}

    <form-checkbox v-model="data.sampleCustomCheckbox"
                   helper="This checkbox represents a boolean in the data model. Need parameter 'toggle=true' for enable custom switches"
                   label="Sample Custom Checkbox"
                   name="sampleCustomCheckbox"
                   toggle="true">
    </form-checkbox>

    Current Value: {{ data.sampleCustomCheckbox }}
    <form-radio-button-group :options="radioButtonOptions"
                             helper="This shows rendering a radio button group with a required validation rule. Need parameter 'toggle=true' for enable custom radio"
                             label="Sample Custom Radio Button Group"
                             name="sampleCustomRadioButtonGroup"
                             toggle="true"
                             validation="required">
    </form-radio-button-group>
    <form-date-picker
      v-model="data.sampleDatePicker"
      data-format="datetime"
      helper="Helper Sample Calendar, Theming is supported by overwriting CSS classes."
      label="Sample calendar"
      placeholder="Placeholder Sample Calendar"
    />
    <form-html-editor
      :content="data.sampleHtmlText"
      label="Sample Html Editor"
      @input="data.sampleHtmlText = $event"
    />
    <form-text-area
      v-model="data.sampleHtmlText"
      label="HTML Output"
    ></form-text-area>
    <form-delay-time-control
      v-model="data.sampleDelayTimeControl"
      helper="Example 7 minutes (PT7M)"
      label="Sample delay time control"
      name="sampleDelayTimeControl"
      validation="required"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { DateTime } from 'luxon';
import FormDatePicker from '@/components/FormDatePicker.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: { FormDatePicker },
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
        sampleDelayTimeControl: ''
      },
      richtext: false,
      inputValidationRules: 'required|min:2',
      textValidationRules: 'max:255',
      passwordValidationRules: 'required|regex:/(?=.{9,})(?=.*?[^\\w\\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/',
      confirmPasswordValidationRules: 'required|same:password.value',
      selectOptions: {
        defaultOptionKey: 'red',
        key: 'value',
        value: 'content',
        jsonData: JSON.stringify([
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
          }
        ])
      },
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
        }
      ],
      customValidationMessages: {
        required: 'This field is totally required and you should, like, put it in.'
      }
    };
  }

});
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 32px;
}

</style>
