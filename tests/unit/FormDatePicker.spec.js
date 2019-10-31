import { shallowMount } from '@vue/test-utils'
import FormDatePicker from '../../src/components/FormDatePicker.vue';

describe('FormDatePicker', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(FormDatePicker, {
      propsData: {
        dataFormat: 'date'
      }
    });
  });

  it('can create the component', () => {
    expect(wrapper.html()).toContain('date-picker-stub');

    const value = wrapper.find('date-picker-stub').vm.value;
    const dateDisplayed = new Date(value).setUTCMilliseconds(0);
    const today = new Date().setUTCMilliseconds(0);

    expect(dateDisplayed).toBe(today);
  });


  it('should render all configured props', () => {
    const nameText = 'birthdate';
    const labelText = 'Enter Your Birthday';
    const placeholderText = 'MM/DD/YYYY';
    const helperText = 'This is some text';
    const errorText = 'This field has an error';
    const readOnly = true;

    wrapper.setProps({
      name: nameText,
      label: labelText,
      placeholder: placeholderText,
      helper: helperText,
      error: errorText,
      disabled: readOnly
    });
    expect(wrapper.name()).toBe(nameText);
    expect(wrapper.vm.dataFormat).toBe(dataType);
    expect(wrapper.html()).toContain(label);
    expect(wrapper.vm.placeholder).toBe(placeholder);
    expect(wrapper.find('.invalid-feedback').text()).toContain(helperText);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    expect(wrapper.vm.disabled).toBe(true);
    expect(wrapper.find('date-picker-stub').vm.props.config.format).toBe('MM/DD/YYYY');

    wrapper.setProps({
      dataFormat: 'datetime'
    });
    expect(wrapper.find('date-picker-stub').vm.props.config.format).toBe('MM/DD/YYYY h:mm A');
  });

  it('updates and emits values', async () => {
    let date = new Date('10/20/2020').toISOString();
    // Should emit on mount
    expect(wrapper.emitted().input).toBeTruthy();
    
    
    wrapper.setProps({value: date});
    
    expect(wrapper.emitted().input.length).toBe(2);
    expect(wrapper.emitted().input[1]).toEqual(['10/20/2020']);
    expect(wrapper.vm.value).toBe(date);

    date = new Date('10/20/2020 10:00 AM').toISOString();
    wrapper.setProps({
      dataFormat: 'datetime',
      value: date
    });
    expect(wrapper.emitted().input.length).toBe(3);
    expect(wrapper.emitted().input[2]).toBe('10/20/20 10:00 AM');
    expect(wrapper.vm.value).toBe(date);
  });

  it('runs validation for date', () => {
    const requiredText = 'The birthdate field is required.';
    const invalidText = 'The birthdate is not a valid format.';

    wrapper.setProps({
      name: 'birthdate',
      validation: 'required'
    });
    
    // Test  validation by removing values
    wrapper.vm.value = null;
    wrapper.find('date-picker-stub').vm.value = null;
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);
    
    // Test the given input is a valid format
    wrapper.setProps({value: '2020/24/10'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);

    wrapper.setProps({value: '10/24/2020 10:00 AM'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);

    wrapper.setProps({value: '10/24/2020'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
    expect(wrapper.find('.is-invalid').exists()).toBe(false);
  });

  it('runs validation for datetime', () => {
    const requiredText = 'The birthdate field is required.';
    const invalidText = 'The birthdate is not a valid format.';
    // const invalidInputText = 'The birthdate is not a valid date with format MM/DD/YYYY';

    wrapper.setProps({
      name: 'birthdate',
      dataFormat: 'datetime',
      validation: 'required'
    });
    
    // Test validation by removing values
    wrapper.vm.value = null;
    wrapper.find('date-picker-stub').vm.value = null; 
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);

    // Test the given input is a valid format
    wrapper.setProps({value: '2020/24/10 10:00 AM'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
    expect(wrapper.find('.is-invalid').exists()).toBe(true);

    wrapper.setProps({value: '10/24/2020'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
    expect(wrapper.find('.is-invalid').exists()).toBe(false);

    wrapper.setProps({value: '10/24/2020 10:00 AM'});
    expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
    expect(wrapper.find('.is-invalid').exists()).toBe(false);
  });
});
