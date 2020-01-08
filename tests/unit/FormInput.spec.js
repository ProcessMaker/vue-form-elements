import { shallowMount } from '@vue/test-utils'
import FormInput from '../../src/components/FormInput.vue';
import DisplayErrors from "../../src/components/common/DisplayErrors";

describe('FormInput', () => {
  const factory = (propsData) => {
    return shallowMount(FormInput,
      {
        propsData,
        stubs: {'DisplayErrors': true},
      },
    );
  };

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
    expect(wrapper.emitted()).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory();
    const value = 'Hello World';

    wrapper.find('input').setValue(value);
    expect(wrapper.emitted().input[0]).toEqual([value]);
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
    const placeholderText = "This is a placeholder";
    const errorText = 'This field has an error';

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
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);
  });

  it('displays validation error messages when the field is invalid', () => {
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormInput',
      error: errorText,
      validation: 'required'
    });

    wrapper.setProps({value: "", validation: 'required'});
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);


    wrapper.setProps({value: "", error: errorText});
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const wrapper = factory({
      name: 'formInputName',
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('input').classes('is-invalid')).toBe(false);

    wrapper.setProps({value: '', validation: 'required'});
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);

    wrapper.setProps({value: 'Hello World', error: '', validation: 'required'});
    expect(wrapper.find('input').classes('is-invalid')).toBe(false);
    expect(wrapper.find(DisplayErrors).exists()).toBe(false);
  });
});
