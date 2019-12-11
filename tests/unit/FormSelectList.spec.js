import { shallowMount } from '@vue/test-utils'
import FormSelectList from '../../src/components/FormSelectList.vue';

describe('FormSelectList', () => {
  const $t = () => {};
  const factory = (propsData) => {
    return shallowMount(FormSelectList, {
      mocks: {$t},
      propsData: {
        ...propsData
      }
    });
  }
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
  const json = JSON.stringify(options);

  it('renders the component', () => {
    const wrapper = factory({ options });
    expect(wrapper.html()).toContain('select');
    expect(wrapper.findAll('option').length).toBe(options.length + 1); 
    
  });

  it('renders the component as a data source dropdown', () => {
    const wrapper = factory({
        options: {
          renderAs: 'dropdown',
          jsonData: json
        }
    });
    expect(wrapper.html()).toContain('select');
    expect(wrapper.findAll('option').length).toBe(options.length + 1);
  });

  it('can render the component as a data source multiselect dropdown', () => {
    const wrapper = factory({
        options: {
            renderAs: 'dropdown',
            jsonData: json,
            allowMultiSelect: true,
        }
    });

    expect(wrapper.find('select').exists()).toBe(false);
    expect(wrapper.html()).toContain('form-multi-select-stub');
    expect(wrapper.find('form-multi-select-stub').vm.$attrs.options.length).toBe(2);
  });

  it('can render the component as a data source checkbox', () => {
    const wrapper = factory({
        options: {
            renderAs: 'checkbox',
            jsonData: json
        }
    });
    expect(wrapper.html()).toContain('input');
    expect(wrapper.findAll('input[type="radio"]').length).toBe(options.length);
  });

  it('can render the component as a data source multiselect checkbox', () => {
    const wrapper = factory({
        options: {
            renderAs: 'checkbox',
            jsonData: json,
            allowMultiSelect: true,
        }
    });
    expect(wrapper.find('input').attributes().type).toBe('checkbox');
    expect(wrapper.findAll('input[type="checkbox"]').length).toBe(options.length);
  });

  it('should have an empty value on mount', () => {
    const wrapper = factory({ 
      options: {
        renderAs: 'dropdown',
        jsonData: json
      }
    });
    expect(wrapper.find('select').element.value).toBe("");
  });

  it('should emit a value on mount', () => {
    const wrapper = factory({ 
      options: {
        renderAs: 'dropdown',
        jsonData: json
      }
    });
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory({ 
      options: {
        renderAs: 'dropdown',
        jsonData: json
      }
    });
    const selectOptions = wrapper.findAll('option');
    const value = selectOptions.at(1);
    
    value.setSelected();
    expect(wrapper.emitted().input[1]).toEqual([value.element.value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory({ 
      options: {
        renderAs: 'dropdown',
        jsonData: json
      }
    });
    const value = 'foo';

    wrapper.setProps({ value });
    const selectOptions = wrapper.findAll('option');
    expect(selectOptions.at(1).element.selected).toBe(true);
  });

  it('should update the value when a initial value is set and the input changes', () => {
    const value = 'foo';
    const newVal = 'bar';
    const wrapper = factory({ 
      value: value,
      options: {
        renderAs: 'dropdown',
        jsonData: json
      }
    });
    const selectOptions = wrapper.findAll('option');
    expect(selectOptions.at(1).element.selected).toBe(true);
    
    wrapper.setProps({
      value: newVal
    });
    expect(selectOptions.at(2).element.selected).toBe(true);
  });

  it('should allow mulitple values to be selected when multiselect is enabled', () => {
    const value = ['foo', 'bar'];
    const wrapper = factory({
      options: {
        renderAs: 'checkbox',
        jsonData: json,
        allowMultiSelect: true
      }
    });
    
    wrapper.setProps({ value });
    const checkBoxInputs = wrapper.findAll('input');
    expect(checkBoxInputs.at(0).element.checked).toBe(true);
    expect(checkBoxInputs.at(1).element.checked).toBe(true);
  });
    
  it('should render all configured props', () => {
    const label = 'Form Select Label';
    const helper = 'This is some text';
    const name = 'FormSelect';
    const dataName = 'dataSelectList';
    const dataSource = 'provideData';
    const pmql = "";
    const wrapper = factory({
      label: label,
      helper: helper,
      name: name,
      options: {
          allowMultiSelect: true, 
          dataName: dataName,
          dataSource: dataSource,
          defaultOptionKey: defaultOption,
          jsonData: json,
          pmqlQuery: pmql,
          renderAs: 'checkbox',
      }
    });

    expect(wrapper.html()).toContain(label);
    expect(wrapper.html()).toContain(helper);

    expect(wrapper.find('input').attributes().type).toBe('checkbox');
    expect(wrapper.props().options.dataName).toBe(dataName);
    expect(wrapper.props().options.dataSource).toBe(dataSource);
    expect(wrapper.props().options.jsonData).toBe(JSON.stringify(optionsArray));
    expect(wrapper.props().options.pmqlQuery).toBe(pmql);
  });

  it('should set the default value', () => {
    const defaultOption = 'foo';
    const wrapper = factory({
      options: {
        defaultOptionKey: defaultOption,
        jsonData: json,
        renderAs: 'checkbox'
      }
    });
    const checkboxInputs = wrapper.findAll('input');
    expect(checkboxInputs.at(0).element.checked).toBe(true);
  });

  it('displays validation error messages when the field is invalid', () => {
    const requiredText = 'The FormSelectList field is required.';
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormSelectList',
      error: errorText,
      validation: 'required',
      options: {
        defaultOptionKey: defaultOption,
        jsonData: json,
        renderAs: 'dropdown'
      }
    });

    expect(wrapper.find('select').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
  });

  it('removes the validation error messages when the field is valid.', () => {
    const errorText = 'This field has an error';
    const value = 'bar';
    const wrapper = factory({
      name: 'FormSelectList',
      error: errorText,
      validation: 'required',
      options: {
        defaultOptionKey: defaultOption,
        jsonData: json,
        renderAs: 'dropdown'
      }
    });
    
    wrapper.setProps({ value });
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('select').classes('is-invalid')).toBe(false);
  });
});
