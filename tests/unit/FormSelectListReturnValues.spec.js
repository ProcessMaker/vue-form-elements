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


  it('returns single key ', () => {
    const label = 'Form Select Label';
    const helper = 'This is some text';
    const name = 'FormSelect';
    const value = 'a';
    const wrapper = factory({
      label: label,
      helper: helper,
      name: name,
      options: {
        showRenderAs: true,
        dataSource: 'provideData',
        jsonData: '',
        dataName: '',
        renderAs: 'checkbox',
        allowMultiSelect: true,
        selectedOptions: [],
        optionsList: [{"content":"aaa","value":"a"},{"content":"bbb","value":"b"},{"content":"ccc","value":"c"}],
        key:'value',
        value:'content',
        valueTypeReturned: 'single'
      }
    });

    expect(wrapper.html()).toContain(label);
    expect(wrapper.html()).toContain(helper);

    wrapper.find('input').setValue(value);
    expect(wrapper.emitted().input[0]).toEqual([value]);
  });

  it('returns object', () => {
    const label = 'Form Select Label';
    const helper = 'This is some text';
    const name = 'FormSelect';
    const testOptions = [{"content":"aaa","value":"a"},{"content":"bbb","value":"b"},{"content":"ccc","value":"c"}];

    const wrapper = factory({
      label: label,
      helper: helper,
      name: name,
      options: {
        showRenderAs: true,
        dataSource: 'provideData',
        jsonData: '',
        dataName: '',
        renderAs: 'checkbox',
        allowMultiSelect: true,
        selectedOptions: [],
        optionsList: testOptions,
        key:'value',
        value:'content',
        valueTypeReturned: 'object'
      }
    });

    expect(wrapper.html()).toContain(label);
    expect(wrapper.html()).toContain(helper);

    wrapper.find('input').setValue(testOptions[0]);
    expect(wrapper.emitted().input[0]).toEqual([testOptions[0]]);
  });


});
