import { shallowMount } from '@vue/test-utils'
import FormTextArea from '../../src/components/FormTextArea.vue';

describe('FormTextArea', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(FormTextArea);
  });

  it('renders the component', () => {
    expect(wrapper.html()).toContain('textarea');
  });

  it('renders all configured properties', () => {
    const labelText = 'Form Textarea Label';
    const helperText = 'This is some text';
    const nameText = 'FormTextAreaField';
    const errorText = 'This field has an error';
    const numOfRows = 4;
    const richtext = false;
    const placeholderText = "This is a sample placeholder.";

    wrapper.setProps({
        label: labelText,
        helper: helperText,
        name: nameText,
        richtext: richtext,
        error: errorText,
        rows: numOfRows,
        validation: 'required',
        placeholder: placeholderText
    });
    expect(wrapper.html()).toContain(labelText);
    expect(wrapper.html()).toContain(helperText);
    expect(wrapper.find('textarea').element.name).toBe(nameText);
    expect(wrapper.find('textarea').element.placeholder).toBe(placeholderText);

    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toContain(errorText);
    expect(wrapper.find('.invalid-feedback').text()).toContain('The FormTextAreaField field is required.');
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);

    expect(wrapper.find('textarea').element.rows).toBe(4);

    wrapper.setProps({richtext: true});
    const div = wrapper.findAll('div');
    expect(div.at(1).classes('richtext')).toBe(true);
  });

  it('runs validation', () => {
    const requiredText = 'The FormTextArea field is required.';
    const minCharText = 'The FormTextArea must be at least 100 characters.';
    const oldValue = 'Tom got a small piece of pie.';
    const newValue = 'Tom ordered a small piece of pie and a hot cup of coffee, he paid with his card but it got declined.';
    
    wrapper.setProps({
      name: 'FormTextArea',
      validation: 'required|min:100',
    });

    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);

    wrapper.setProps({value: oldValue});
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(true);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
    expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
    expect(wrapper.find('.invalid-feedback').text()).toBe(minCharText);

    wrapper.setProps({value: newValue});
    expect(wrapper.find('textarea').classes('is-invalid')).toBe(false);
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
  });

  it('updates and emits values', () => {
    // Should emit on mount
    expect(wrapper.emitted().input).toBeTruthy();

    const valueText = 'He told us a very exciting adventure story.';
    wrapper.setProps({value: valueText});

    expect(wrapper.find('textarea').element.value).toEqual(valueText);
    expect(wrapper.emitted().input.length).toBe(2);
    expect(wrapper.emitted().input[1]).toEqual([valueText]);
  });
});
