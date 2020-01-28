import { mount } from '@vue/test-utils'
import FormDatePicker from '../../src/components/FormDatePicker.vue'

const JANUARY = 0;

describe('FormDatePicker', () => {
  const factory = propsData => mount(FormDatePicker, { propsData });
  const dataTest = 'date-picker';

  beforeAll(() => {
    const year = 2020;
    const month = JANUARY;
    const day = 15;
    const hour = 20;

    Date.now = jest.fn(() => new Date(year, month, day, hour));
  });

  beforeEach(() => {
    window.ProcessMaker = { user: {} };
  });

  afterAll(() => {
    Date.now.mockRestore();
  });

  describe('mounted with dataFormat prop set to "datetime"', () => {
    it('should emit today\'s date on mount', async () => {
      const wrapper = mount(FormDatePicker, { propsData: { dataFormat: 'datetime' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('input')).toHaveLength(1);
      expect(wrapper.emitted('input')[0]).toEqual(['2020-01-16T01:00:00.000Z']);
    });

    it('should emit an ISO formatted datestring with a UTC offset after selecting date and time', async () => {
      const wrapper = mount(FormDatePicker, { propsData: { dataTest, dataFormat: 'datetime' } });
      await wrapper.vm.$nextTick();

      wrapper.find(`[data-test=${dataTest}`).trigger('focus');
      wrapper.find('[data-day="01/30/2020"]').trigger('click');
      await wrapper.vm.$nextTick();
      wrapper.find('[title="Select Time"]').trigger('click');
      wrapper.find('[title="Pick Minute"]').trigger('click');
      wrapper.findAll('[data-action="selectMinute"]').wrappers.find(wrapper => {
        return wrapper.text() === '30';
      }).trigger('click');
      await wrapper.vm.$nextTick();

      const emittedInput = wrapper.emitted('input');
      expect(emittedInput).toBeTruthy();
      expect(emittedInput[emittedInput.length - 1]).toEqual(['2020-01-31T01:30:00.000Z']);
    });

    it('should display a date and time in user\'s datetime format', async () => {
      window.ProcessMaker.user.datetime_format = '[month]: M [day]: D [year]: YYYY [hour]: H';

      const wrapper = mount(FormDatePicker, { propsData: { dataTest, dataFormat: 'datetime' } });
      const displayedDatetime = wrapper.find(`[data-test=${dataTest}`).element.value;
      await wrapper.vm.$nextTick();

      expect(displayedDatetime).toBe(`month: ${1} day: ${15} year: ${2020} hour: ${20}`);
    });
  });

  describe('mounted with no dataFormat prop set', () => {
    it('should emit today\'s date (disregarding current time) on mount', async () => {
      const wrapper = mount(FormDatePicker);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('input')).toHaveLength(1);
      expect(wrapper.emitted('input')[0]).toEqual(['2020-01-15T05:00:00.000Z']);
    });

    it('should emit an ISO formatted datestring with a UTC offset after selecting date and time', async () => {
      const wrapper = mount(FormDatePicker, { propsData: { dataTest, dataFormat: 'datetime' } });
      await wrapper.vm.$nextTick();

      wrapper.find(`[data-test=${dataTest}`).trigger('focus');
      wrapper.find('[data-day="01/30/2020"]').trigger('click');
      await wrapper.vm.$nextTick();
      wrapper.find('[title="Select Time"]').trigger('click');
      wrapper.find('[title="Pick Minute"]').trigger('click');
      wrapper.findAll('[data-action="selectMinute"]').wrappers.find(wrapper => {
        return wrapper.text() === '30';
      }).trigger('click');
      await wrapper.vm.$nextTick();

      const emittedInput = wrapper.emitted('input');
      expect(emittedInput).toBeTruthy();
      expect(emittedInput[emittedInput.length - 1]).toEqual(['2020-01-31T01:30:00.000Z']);
    });

    it('should display a date in user\'s datetime format', async () => {
      window.ProcessMaker.user.datetime_format = 'M-D-YYYY hh:mm A';

      const wrapper = mount(FormDatePicker, { propsData: { dataTest } });
      const displayedDatetime = wrapper.find(`[data-test=${dataTest}`).element.value;
      await wrapper.vm.$nextTick();

      expect(displayedDatetime).toBe(`${1}-${15}-${2020}`);
    });
  });

  it('should render all configured props', async () => {
    const label = 'Enter Your Birthday';
    const placeholder = '02/23/1998';
    const helper = 'This is some text';
    const error = 'This field has an error';
    const validationError = 'The birthdate field is required';
    const disabled = true;

    const wrapper = mount(FormDatePicker, {
      propsData: {
        dataTest,
        name: 'birthdate',
        label,
        placeholder,
        helper,
        error,
        disabled,
        validation: 'required',
        value: '',
      }
    });

    await wrapper.vm.$nextTick();

    [label, placeholder, helper, error, validationError].forEach(text => {
      expect(wrapper.html()).toContain(text);
    });
    expect(wrapper.find(`[data-test=${dataTest}`).element.disabled).toBe(true);
  });

  describe.skip('validation', () => {
    it('displays validation error messages when the field is invalid', () => {
      const requiredText = 'The FormDatePicker field is required.';
      const errorText = 'This field has an error';
      const wrapper = factory({
        name: 'FormDatePicker',
        error: errorText,
        validation: 'required',
        value: ''
      });

      expect(wrapper.find('date-picker-stub').classes('is-invalid')).toBe(true);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toContain(requiredText);
      expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    });

    it('removes the validation error messages when the field is valid.', () => {
      const errorText = 'This field has an error';
      const value = 'bar';
      const wrapper = factory({
        name: 'FormDatePicker',
        error: errorText,
        validation: 'required',
        value: '10/20/2020',
      });

      expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
      expect(wrapper.find('date-picker-stub').classes('is-invalid')).toBe(false);
    });

    it('runs validation for invalid date formats', () => {
      const wrapper = factory({ dateFormat });

      wrapper.setProps({ value: '2020/24/10' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
      expect(wrapper.find('.is-invalid').exists()).toBe(true);

      wrapper.setProps({ value: '10/24/2020 10:00 AM' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
      expect(wrapper.find('.is-invalid').exists()).toBe(true);

      wrapper.setProps({ value: '10/24/2020' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
      expect(wrapper.find('.is-invalid').exists()).toBe(false);
    });

    it('runs validation for invalid datetime formats', () => {
      let dataFormat = 'datetime';
      const wrapper = factor({ dataFormat });

      wrapper.setProps({ value: '2020/24/10 10:00 AM' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(false);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toBe(invalidText);
      expect(wrapper.find('.is-invalid').exists()).toBe(true);

      wrapper.setProps({ value: '10/24/2020' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
      expect(wrapper.find('.is-invalid').exists()).toBe(false);

      wrapper.setProps({ value: '10/24/2020 10:00 AM' });
      expect(wrapper.find('date-picker-stub').vm.value.isValid()).toBe(true);
      expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
      expect(wrapper.find('.invalid-feedback').isVisible()).toBe(false);
      expect(wrapper.find('.is-invalid').exists()).toBe(false);
    });
  });
});
