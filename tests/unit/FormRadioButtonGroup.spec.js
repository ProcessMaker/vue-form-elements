import { shallowMount } from '@vue/test-utils';
import FormRadioButton from '../../src/components/FormRadioButtonGroup.vue';

describe('FormRadioButton', () => {
  const factory = (propsData) => shallowMount(FormRadioButton, { propsData });
  const options = [
    {
      value: 'foo',
      content: 'Foo'
    },
    {
      value: 'bar',
      content: 'Bar'
    }
  ];
  const json = JSON.stringify(options);

  it('renders the component', () => {
    const wrapper = factory({ options });

    expect(wrapper.html()).toContain('input');
    expect(wrapper.find('input').attributes().type).toBe('radio');
    expect(wrapper.findAll('input').length).toBe(options.length);
  });

  it('renders the component as a data source', () => {
    const wrapper = factory({
      options: {
        dataSource: 'provideData',
        jsonData: json
      }
    });

    expect(wrapper.html()).toContain('input');
    expect(wrapper.find('input').attributes().type).toBe('radio');
    expect(wrapper.findAll('input').length).toBe(options.length);
  });

  it('should have an empty value on mount', () => {
    const wrapper = factory({ options });
    expect(wrapper.vm.value).toBe(undefined);
  });

  it('should emit a value on mount', () => {
    const wrapper = factory({ options });
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory({ options });
    const radioOptions = wrapper.findAll('input');
    const value = radioOptions.at(1);

    value.setChecked();
    expect(wrapper.emitted().input[1]).toEqual([value.element.value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory({ options });
    const value = 'foo';

    wrapper.setProps({ value });
    const radioOptions = wrapper.findAll('input');
    expect(radioOptions.at(0).element.checked).toBe(true);
  });

  it('should update the value when a initial value is set and the input changes', () => {
    const value = 'foo';
    const newVal = 'bar';
    const wrapper = factory({
      options,
      value
    });
    const radioOptions = wrapper.findAll('input');
    expect(radioOptions.at(0).element.checked).toBe(true);

    wrapper.setProps({
      value: newVal
    });
    expect(radioOptions.at(1).element.checked).toBe(true);
    expect(radioOptions.at(0).element.checked).toBe(false);
  });

  it('renders all configured properties', () => {
    const label = 'Form Radio Label';
    const helper = 'This is some text';
    const name = 'FormRadioButton';
    const defaultOptionKey = 'foo';
    const wrapper = factory({
      label,
      helper,
      name,
      toggle: true,
      defaultOptionKey,
      disabled: true,
      options
    });

    expect(wrapper.html()).toContain(label);
    expect(wrapper.html()).toContain(helper);
    expect(wrapper.find('input').attributes().name).toBe(name);
    expect(wrapper.find('input').attributes().disabled).toBe('disabled');
    expect(wrapper.find('input').classes('custom-control-input')).toBe(true);

    const radioInputs = wrapper.findAll('input');
    expect(radioInputs.at(0).element.checked).toBe(true);
  });

  it('renders all configured properties for a data source', () => {
    const dataSource = 'provideData';
    const defaultOptionKey = 'bar';

    wrapper.setProps({
      dataSource,
      defaultOptionKey,
      jsonData: json
    });

    const radioInputs = wrapper.findAll('input');
    expect(radioInputs.at(1).element.checked).toBe(true);

    expect(wrapper.props().options.dataSource).toBe(dataSource);
    expect(wrapper.props().options.jsonData).toBe(json);
  });

  it('displays validation error messages when the field is invalid', () => {
    const requiredText = 'The FormRadioButton field is required.';
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormRadioButton',
      error: errorText,
      validation: 'required',
      options
    });

    expect(wrapper.find('input').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const errorText = 'This field has an error';
    const value = 'bar';
    const wrapper = factory({
      name: 'FormRadioButton',
      error: errorText,
      validation: 'required',
      options
    });

    wrapper.setProps({ value });
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('input').classes('is-invalid')).toBe(false);
  });
});
