import { shallowMount } from '@vue/test-utils'
import FormSelect from '../../src/components/FormSelect.vue';
import DisplayErrors from "../../src/components/common/DisplayErrors";

describe('FormSelect', () => {
  const $t = () => {};

  const factory = (propsData) => {
    return shallowMount(FormSelect, {
      mocks: {$t},
      propsData: {
        ...propsData
      },
      stubs: {'DisplayErrors': true},
    });
  };

  const options =  [
    {
        'value': 'foo',
        'content': 'Foo'
    },
    {
        'value': 'bar',
        'content': 'Bar'
    }
  ];

  it('renders the component', () => {
    const wrapper = factory({ options });
    expect(wrapper.html()).toContain('select');
    expect(wrapper.findAll('option').length).toBe(options.length + 1);
  });

  it('renders the component from a data source', () => {
    const wrapper = factory({
      options: {
        dataSource: 'provideData',
        jsonData: JSON.stringify(options)
      }
    });

    expect(wrapper.html()).toContain('select');
    expect(wrapper.findAll('option')).toHaveLength(options.length + 1);
  });

  it('should have an empty value on mount', () => {
    const wrapper = factory({ options });
    expect(wrapper.find('select').element.value).toBe("");
  });

  it('should emit a value on mount', () => {
    const wrapper = factory({ options });
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory({ options });
    const selectOptions = wrapper.findAll('option');
    const value = selectOptions.at(1);

    value.setSelected();
    expect(wrapper.emitted().input[1]).toEqual([value.element.value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory({ options });
    const value = 'foo';

    wrapper.setProps({ value });
    const selectOptions = wrapper.findAll('option');
    expect(selectOptions.at(1).element.selected).toBe(true);
  });

  it('should update the value when a initial value is set and the input changes', () => {
    const value = 'foo';
    const newVal = 'bar';
    const wrapper = factory({
      options: options,
      value: value
     });
    const selectOptions = wrapper.findAll('option');
    expect(selectOptions.at(1).element.selected).toBe(true);

    wrapper.setProps({
      value: newVal
    });
    expect(selectOptions.at(2).element.selected).toBe(true);
  });

  it('should render all configured props', () => {
    const label = 'Form Select Label';
    const helper = 'This is some text';
    const name = 'FormSelect';
    const errorText = 'This field has an error';
    const placeholder = 'select an option';

    options.defaultOptionKey  = 'bar';

    const wrapper = factory({
      label: label,
      helper: helper,
      name: name,
      error: errorText,
      placeholder: placeholder,
      disabled: true,
      validation: 'required',
      options: options,
    });

    expect(wrapper.html()).toContain(label);
    expect(wrapper.html()).toContain(helper);
    expect(wrapper.find('select').attributes().name).toBe(name);

    expect(wrapper.find(DisplayErrors).exists()).toBe(true);
    expect(wrapper.find('select').classes('is-invalid')).toBe(true);

    const selectOptions = wrapper.findAll('option');
    expect(selectOptions.at(0).text()).toEqual(placeholder);
    expect(selectOptions.at(2).element.selected).toBe(true);
    expect(wrapper.find('select').attributes().disabled).toBe('disabled');
  });

  it('displays validation error messages when the field is invalid', () => {
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormSelect',
      error: errorText,
      validation: 'required',
      options: options
    });

    expect(wrapper.find('select').classes('is-invalid')).toBe(true);
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const errorText = 'This field has an error';
    const value = 'bar';
    const wrapper = factory({
      name: 'FormSelect',
      error: errorText,
      validation: 'required',
      options: options
    });

    wrapper.setProps({ value });
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    expect(wrapper.find(DisplayErrors).exists()).toBe(true);
  });
});
