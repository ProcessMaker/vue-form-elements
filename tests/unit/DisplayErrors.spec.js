import { shallowMount } from '@vue/test-utils';
import DisplayErrors from '../../src/components/common/DisplayErrors.vue';

describe('Display Errors', () => {
  const validator = {
    input: {},
    messages: {},
    errors: {
      errors: {

      }
    },
    errorCount: 0,
    rules: {}
  };
  const factory = (propsData) => shallowMount(DisplayErrors, {
    propsData: {
      ...propsData
    }
  });

  const errorText = 'Custom error';
  const errorText1 = 'Validator error 1';
  const errorText2 = 'Validator error 2';

  it('renders the component', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('div');
  });

  it('display error with custom error', () => {
    const wrapper = factory({
      error: errorText
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.html()).toContain(errorText);
  });

  it('display error with validator object', () => {
    validator.errors.errors.example = [
      errorText1,
      errorText2
    ];
    validator.errorCount = 2;
    const wrapper = factory({
      name: 'example',
      validator
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.html()).toContain(errorText1);
    expect(wrapper.html()).toContain(errorText2);
  });

  it('errors should be displayed with custom error and validator object', () => {
    validator.errors.errors.example = [
      errorText1,
      errorText2
    ];
    validator.errorCount = 2;
    const wrapper = factory({
      name: 'example',
      error: errorText,
      validator
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.html()).toContain(errorText);
    expect(wrapper.html()).toContain(errorText1);
    expect(wrapper.html()).toContain(errorText2);
  });

  it('the error no longer appears when set to blank ', () => {
    validator.errors.errors.example = [
      errorText1,
      errorText2
    ];
    validator.errorCount = 2;
    const wrapper = factory({
      name: 'example',
      error: errorText,
      validator
    });

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.html()).toContain(errorText);
    expect(wrapper.html()).toContain(errorText1);
    expect(wrapper.html()).toContain(errorText2);

    wrapper.setProps({ error: '' });
    expect(wrapper.html()).not.toContain(errorText);
    expect(wrapper.html()).toContain(errorText1);
    expect(wrapper.html()).toContain(errorText2);

    wrapper.setProps({ error: '', validator: '' });
    expect(wrapper.html()).not.toContain(errorText);
    expect(wrapper.html()).not.toContain(errorText1);
    expect(wrapper.html()).not.toContain(errorText2);
  });
});
