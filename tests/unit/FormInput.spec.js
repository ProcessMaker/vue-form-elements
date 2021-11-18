import { shallowMount } from '@vue/test-utils';
import FormInput from '../../src/components/FormInput.vue';

describe('FormInput', () => {
  const factory = (propsData) => shallowMount(FormInput, { propsData });

  it('renders the component', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('input');
  });

  it('should have an empty value on mount', () => {
    const wrapper = factory();
    expect(wrapper.find('input').isEmpty()).toBe(true);
  });

  it('should emit a value on mount', () => {
    const wrapper = factory();
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory();
    const value = 'Hello World';

    wrapper.find('input').setValue(value);
    expect(wrapper.emitted().input[1]).toEqual([value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory();
    const value = 'Hello World';

    wrapper.setProps({ value });
    expect(wrapper.find('input').element.value).toBe(value);
  });

  it('should update the value when a initial value is set and the input changes', () => {
    const value = 'Hello World';
    const newVal = 'Goodbye World';
    const wrapper = factory({ value });
    expect(wrapper.find('input').element.value).toBe(value);

    wrapper.setProps({
      value: newVal
    });
    expect(wrapper.find('input').element.value).toBe(newVal);
  });

  it('renders all configured properties', () => {
    const labelText = 'Form Input Label';
    const helperText = 'This is some text';
    const nameText = 'FormInputField';
    const placeholderText = 'This is a placeholder';
    const errorText = 'This field has an error';
    const requiredText = 'The FormInputField field is required.';

    const wrapper = factory({
      label: labelText,
      helper: helperText,
      name: nameText,
      placeholder: placeholderText,
      error: errorText,
      validation: 'required'
    });

    expect(wrapper.html()).toContain(labelText);
    expect(wrapper.html()).toContain(helperText);
    expect(wrapper.find('input').element.name).toBe(nameText);
    expect(wrapper.find('input').element.placeholder).toBe(placeholderText);
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.html()).toContain(errorText);
    expect(wrapper.html()).toContain(requiredText);
  });

  it('displays validation error messages when the field is invalid', () => {
    const requiredText = 'The FormInput field is required.';
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormInput',
      error: errorText,
      validation: 'required'
    });

    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const errorText = 'This field has an error';
    const value = 'Hello World';
    const wrapper = factory({
      name: 'formInputName',
      error: errorText,
      validation: 'required'
    });

    wrapper.setProps({ value });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('input').classes('is-invalid')).toBe(false);
  });
});
