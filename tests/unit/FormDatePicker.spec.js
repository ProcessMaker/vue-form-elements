import { mount, shallowMount } from '@vue/test-utils'
import FormDatePicker from '../../src/components/FormDatePicker.vue'

const JANUARY = 0;

describe('FormDatePicker', () => {
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
    it('should not emit default date on mount', async () => {
      const wrapper = mount(FormDatePicker, { propsData: { dataFormat: 'datetime' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('input')).toBeFalsy();
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

      const wrapper = mount(FormDatePicker, {
        propsData: {
          dataTest,
          dataFormat: 'datetime',
          value: new Date(Date.now()).toISOString(),
        }
      });
      await wrapper.vm.$nextTick();

      const displayedDatetime = wrapper.find(`[data-test=${dataTest}`).element.value;
      expect(displayedDatetime).toBe(`month: ${1} day: ${15} year: ${2020} hour: ${20}`);
    });
  });

  describe('mounted with no dataFormat prop set', () => {
    it('should not emit default date (disregarding current time) on mount', async () => {
      const wrapper = mount(FormDatePicker);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('input')).toBeFalsy();
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
      const wrapper = mount(FormDatePicker, {
        propsData: {
          dataTest,
          value: new Date(Date.now()).toISOString(),
        }
      });

      await wrapper.vm.$nextTick();

      const displayedDatetime = wrapper.find(`[data-test=${dataTest}`).element.value;
      expect(displayedDatetime).toBe('1-15-2020');
    });
  });

  it('should render all configured props', async () => {
    const label = 'Enter Your Birthday';
    const placeholder = '02/23/1998';
    const helper = 'This is some text';
    const error = 'This field has an error';
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
      }
    });

    await wrapper.vm.$nextTick();

    [label, placeholder, helper, error].forEach(text => {
      expect(wrapper.html()).toContain(text);
    });
    expect(wrapper.find(`[data-test=${dataTest}`).element.disabled).toBe(true);
  });

  describe('validation', () => {
    it('displays validation error messages when the field is invalid', async () => {
      const validationError = 'The myDate field is required.';
      const wrapper = mount(FormDatePicker, {
        propsData: {
          name: 'myDate',
          validation: 'required',
          value: new Date(Date.now()).toISOString(),
        }
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.contains('.invalid-feedback')).not.toBe(true);
      expect(wrapper.html()).not.toContain(validationError);

      wrapper.setProps({ value: '' });
      await wrapper.vm.$nextTick();

      expect(wrapper.contains('.invalid-feedback')).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toContain(validationError);
    });

    it('removes the validation error messages when the field is valid. 2', async () => {
      const validationError = 'The myDate field is required.';
      const wrapper = mount(FormDatePicker, {
        propsData: {
          name: 'myDate',
          validation: 'required',
          value: '',
        }
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.contains('.invalid-feedback')).toBe(true);
      expect(wrapper.find('.invalid-feedback').text()).toContain(validationError);

      wrapper.setProps({ value: new Date(Date.now()).toISOString() });
      await wrapper.vm.$nextTick();

      expect(wrapper.contains('.invalid-feedback')).not.toBe(true);
      expect(wrapper.html()).not.toContain(validationError);
    });

    it('convert invalid value to current date', async () => {
      const wrapper = mount(FormDatePicker, {
        propsData: {
          dataTest,
          name: 'myDate',
          dataFormat: 'date',
          value: null,
        },
      });

      await wrapper.vm.$nextTick();
      wrapper.setProps({ value: 'this is not a date' });
      await wrapper.vm.$nextTick();

      expect(wrapper.contains('.invalid-feedback')).toBe(false);
      const displayedDatetime = wrapper.find(`[data-test=${dataTest}`).element.value;
      expect(displayedDatetime).toBe('01/15/2020');
    });
  });
});
