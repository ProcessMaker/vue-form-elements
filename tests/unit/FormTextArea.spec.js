import { shallowMount } from '@vue/test-utils'
import FormTextArea from '../../src/components/FormTextArea.vue';

describe('FormTextArea', () => {
  let dataFormat = 'string';
  const factory = (propsData) => {
    return shallowMount(FormTextArea, {
      propsData: {
        ...propsData
      }
    });
  };

  it('renders the component', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('textarea');
  });

  it('renders a WYSIWYG editor when richtext is enabled', () => {
    const wrapper = factory({
      richtext: true
    });
    const div = wrapper.findAll('div');
    expect(div.at(1).classes('richtext')).toBe(true);
  });

  it('should have an empty value on mount', () => {
    const wrapper = factory({ dataFormat });
    expect(wrapper.html()).toContain('textarea');
    expect(wrapper.emitted()).toMatchObject({});
    expect(wrapper.props().value).toBeUndefined();
    expect(wrapper.find('textarea').isEmpty()).toBe(true);
  });

  it('should emit a value on mount', () => {
    const wrapper = factory();
    expect(wrapper.emitted()).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory();
    const value = 'Hello World';

    wrapper.find('textarea').setValue(value);
    expect(wrapper.emitted().input[0]).toEqual([value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory();
    const value = 'Hello World';

    wrapper.setProps({value: value});
    expect(wrapper.find('textarea').element.value).toBe(value);
  });

  it('should update the value when a initial value is set and the input changes', () => {
    const value = 'Hello World';
    const newVal = 'Goodbye World';
    const wrapper = factory({
      value: value
    });
    expect(wrapper.find('textarea').element.value).toBe(value);

    wrapper.setProps({
      value: newVal
    });
    expect(wrapper.find('textarea').element.value).toBe(newVal);
  });

  it('renders all configured properties', () => {
    const labelText = 'Form Textarea Label';
    const helperText = 'This is some text';
    const nameText = 'FormTextAreaField';
    const errorText = 'This field has an error';
    const placeholderText = 'This is a sample placeholder.';
    const requiredText = 'The FormTextAreaField field is required.';
    const wrapper = factory({
      label: labelText,
      helper: helperText,
      name: nameText,
      richtext: false,
      error: errorText,
      rows: 4,
      placeholder: placeholderText
    });

    expect(wrapper.html()).toContain(labelText);
    expect(wrapper.html()).toContain(helperText);
    expect(wrapper.find('textarea').element.name).toBe(nameText);
    expect(wrapper.find('textarea').element.placeholder).toBe(placeholderText);

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('textarea').element.rows).toBe(4);

    wrapper.setProps({value: null, error: "", validation: 'required'});
    expect(wrapper.html()).toContain(helperText);
    expect(wrapper.find('textarea').element.name).toBe(nameText);
    expect(wrapper.find('textarea').element.placeholder).toBe(placeholderText);

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('textarea').element.rows).toBe(4);
  });

  it('displays validation error messages when the field is invalid', () => {
    const requiredText = 'The FormTextAreaField field is required.';
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormTextAreaField',
    });

    wrapper.setProps({value: "", validation: 'required'});
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);

    wrapper.setProps({value: "text", error: errorText});
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormTextAreaField',
    });

    wrapper.setProps({value: '', validation: 'required'});
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain("The FormTextAreaField field is required.");

    wrapper.setProps({value: 'Hello World', error:null, validation: 'required'});
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(false);
  });
});
