import { shallowMount, mount } from '@vue/test-utils'
import FormDatePicker from '../../src/components/FormDatePicker.vue';

describe('FormDatePicker', () => {
  let dataFormat = 'date';
  const factory = (propsData) => {
    return shallowMount(FormDatePicker, { propsData });
  }

  // it('renders the component', () => {
  //   const wrapper = factory({ dataFormat });
  //   expect(wrapper.html()).toContain('date-picker-stub');
  //
  //   const value = wrapper.find('date-picker-stub').vm.value;
  //   const dateDisplayed = new Date(value).setUTCMilliseconds(0);
  //   const today = new Date().setUTCMilliseconds(0);
  //   expect(dateDisplayed).toBe(today);
  // });

  it('should emit a value on mount', () => {
    const wrapper = factory({ dataFormat });
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('should emit the value when input changes', () => {
    const wrapper = factory({ dataFormat });
    const value = '10/20/2020';

    wrapper.setProps({ value });
    expect(wrapper.emitted().input[1]).toEqual([value]);
  });

  it('sets the value on input', () => {
    const wrapper = factory({ dataFormat });
    const value = '10/20/2020';

    wrapper.setProps({ value });
    const elValue = new Date(wrapper.find('date-picker-stub').vm.value).setUTCMilliseconds(0);
    const setValue = new Date(value).setUTCMilliseconds(0);

    expect(elValue).toBe(setValue);
  });

  it('should render all configured props', () => {
    const nameText = 'birthdate';
    const labelText = 'Enter Your Birthday';
    const placeholderText = 'Input a Date Time';
    const helperText = 'This is some text';
    const readOnly = true;
    const wrapper = factory({
      name: nameText,
      label: labelText,
      placeholder: placeholderText,
      dataFormat: 'date',
      helper: helperText,
      disabled: readOnly,
      validation: 'required',
      value: ''
    });


    expect(wrapper.html()).toContain(labelText);
    expect(wrapper.vm.placeholder).toBe(placeholderText);
    // expect(wrapper.find('.invalid-feedback').text()).toContain(helperText);
    // expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    expect(wrapper.vm.disabled).toBe(true);
    expect(wrapper.vm.name).toBe(nameText);
    expect(wrapper.vm._data.config.format).toBe('MM/DD/YYYY');


    wrapper.setProps({
      dataFormat: 'datetime'
    });

    wrapper.setData({ prueba: 'pruebita' });
    expect(wrapper.vm._data.config.format).toBe('MM/DD/YYYY h:mm A');
  });

  it('displays validation error messages when the field is invalid', () => {
    const requiredText = 'The FormDatePicker field is required.';
    const errorText = 'This field has an error';
    const wrapper = factory({
      name: 'FormDatePicker',
      error: '',
      validation: 'required',
      value: ''
    });

    wrapper.setProps({errorCount: 1, validator:{errors: {errors: { FormDatePicker: [errorText]} }}});

    console.log('-*-*-*- HTML:', wrapper.html())
    expect(wrapper.classes('is-invalid')).toBe(true);
    // expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    // expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
    // expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
  });

  // it('removes the validation error messages when the field is valid.', () => {
  //   const errorText = 'This field has an error';
  //   const value = 'bar';
  //   const wrapper = factory({
  //     name: 'FormDatePicker',
  //     error: errorText,
  //     validation: 'required',
  //     value: '10/20/2020',
  //   });
  //
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  //   expect(wrapper.find('date-picker-stub').classes('is-invalid')).toBe(false);
  // });
  //
  // it('runs validation for invalid date formats', () => {
  //   const wrapper = factory({dateFormat});
  //
  //   wrapper.setProps({value: '2020/24/10'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(true);
  //
  //   wrapper.setProps({value: '10/24/2020 10:00 AM'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(true);
  //
  //   wrapper.setProps({value: '10/24/2020'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(false);
  // });
  //
  // it('runs validation for invalid datetime formats', () => {
  //   let dataFormat = 'datetime';
  //   const wrapper = factor({dataFormat});
  //
  //   wrapper.setProps({value: '2020/24/10 10:00 AM'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(true);
  //
  //   wrapper.setProps({value: '10/24/2020'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(false);
  //
  //   wrapper.setProps({value: '10/24/2020 10:00 AM'});
  //   expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
  //   expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  //   expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
  //   expect(wrapper.find('.is-invalid').exists()).toBe(false);
  // });
});
