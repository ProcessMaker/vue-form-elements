import { shallowMount } from '@vue/test-utils'
import FormInput from '../../src/components/FormInput.vue';

describe('FormInput', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(FormInput); 
  })

  it('renders the component', () => {
    expect(wrapper.html()).toContain('input');
  });

  it('renders all configured properties', () => {
    const labelText = 'Form Input Label';
    const helperText = 'This is some text';
    const nameText = 'FormInputField';
    const errorText = 'This field has an error';
    const placeholderText = "This is a placeholder";
    const vModel = 'bar';

    wrapper.setProps({
      label: labelText,
      helper: helperText,
      name: nameText,
      error: errorText,
      validation: 'required',
      placeholder: placeholderText,
      value: vModel
    });
    
    expect(wrapper.html()).toContain(labelText);
    expect(wrapper.html()).toContain(helperText);
    expect(wrapper.find('input').element.name).toBe(nameText);
    expect(wrapper.find('input').element.placeholder).toBe(placeholderText);
    expect(wrapper.find('input').element.value).toBe(vModel);
    
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    expect(wrapper.find('.invalid-feedback').text()).toContain('The FormInputField is required.');
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
  });

  it('updates and emits values', () => {
    // Should emit on mount
    expect(wrapper.emitted().input).toBeTruthy();
  
    wrapper.setProps({value: 'Bar'});
    expect(wrapper.vm.value).toBe('Bar');
    expect(wrapper.emitted().input.length).toBe(2);
    expect(wrapper.emitted().input[1]).toEqual(['Bar']);
  });

  it('runs validation', () => {
    const requiredText = 'The FormInput field is required.';
    const minCharText = 'The FormInput must be at least 2 characters.'

    wrapper.setProps({
      name: 'FormInput',
      validation: 'required|min:2',
    });
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);

    wrapper.setProps({value: 'F'});
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(minCharText);
    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    
    wrapper.setProps({value: 'Foobar'});
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('input').classes('is-invalid')).toBe(false);
  });
});
