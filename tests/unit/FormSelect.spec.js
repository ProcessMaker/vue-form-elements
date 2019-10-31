import { shallowMount } from '@vue/test-utils'
import FormSelect from '../../src/components/FormSelect.vue';

describe('FormSelect', () => {
    let wrapper;
    const $t = () => {};
    const optionsArray =  [
        {
            'value': 'foo',
            'content': 'Foo'
        }, 
        {
            'value': 'bar',
            'content': 'Bar'
        }
    ];

    beforeEach(() => {
        wrapper = shallowMount(FormSelect, {
            mocks: {$t},
            propsData: {
                options: optionsArray,
            },
        }); 
    });

    it('render the component', () => {
        expect(wrapper.html()).toContain('select');
        expect(wrapper.findAll('option').length).toBe(optionsArray.length + 1); 
    });

    it('should render all configured props', () => {
        const label = 'Form Select Label';
        const helper = 'This is some text';
        const name = 'FormSelect';
        const errorText = 'This field has an error';
        const placeholder = 'select an option';
        const readOnly = true;

        wrapper.setProps({
            label: label,
            helper: helper,
            name: name,
            error: errorText,
            placeholder: placeholder,
            disabled: readOnly,
            validation: 'required',
        });
        debugger;
        expect(wrapper.html()).toContain(label);
        expect(wrapper.html()).toContain(helper);
        expect(wrapper.find('select').attributes().name).toBe(name);

        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(errorText);
        expect(wrapper.find('input').classes('is-invalid')).toBe(true);
        
        expect(wrapper.findAll('option').at(0).text()).toEqual(placeholder);
        expect(wrapper.find('select').attributes().disabled).toBe('disabled');
    });

    it('updates and emits values', () => {
        // Should emit on mount
        expect(wrapper.emitted().input).toBeTruthy();
        
        const label = 'Form Select Label';
        wrapper.setProps({
            label: label,
            name: name,
        });
        
        const selectOptions = wrapper.findAll('option');
        selectOptions.at(1).setSelected();
        expect(selectOptions.at(1).element.selected).toBe(true);
        expect(selectOptions.at(2).element.selected).toBe(false);
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input[1]).toEqual(['foo']);
        expect(wrapper.vm.value).toBe('foo');
        
    });

    it('runs validation', () => {
        const invalidFeedback = 'The selected FormSelect is invalid.';

        wrapper.setProps({
            name: 'FormSelect',
            validation: 'in:bar',
            value: 'foo'
        });
        
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(invalidFeedback);
        expect(wrapper.find('select').classes('is-invalid')).toBe(true);
        
        wrapper.find('select').setValue('bar');
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
        expect(wrapper.find('select').classes('is-invalid')).toBe(false);
    });

    // it('can create the component using an data source of provideData', () => {
    //     const wrapper = shallowMount(FormSelect, {
    //         mocks: {$t},
    //         propsData: {
    //             options: {
    //                 dataSource: 'provideData',
    //                 jsonData: JSON.stringify(optionsArray),
    //             }    
    //         },
    //     });
    //     expect(wrapper.html()).toContain('select');
    //     expect(wrapper.findAll('option')).toHaveLength(optionsArray.length + 1); 
    //     expect(wrapper.emitted().input).toBeTruthy();
    // });

//   it('can create the component using an data source of dataObject', () => {
//     const wrapper = shallowMount(FormSelect, {
//         mocks: {$t},
//         propsData: {
//             options: {
//                 dataSource: 'dataObject',
//                 dataName: 'optionArray',
//                 optionList: optionsArray
//             }    
//         },
//     });
//     debugger;
//     expect(wrapper.html()).toContain('select');
//     expect(wrapper.findAll('option')).toHaveLength(optionsArray.length + 1); 
//     expect(wrapper.emitted().input).toBeTruthy();
//   });


//   it('can set a default option', () => {
//     const wrapper = shallowMount(FormSelect, {
//         mocks: {$t},
//         propsData: {
//             options: {
//                 defaultOptionKey: null,
//                 jsonData: JSON.stringify(optionsArray),
//             },
//         },
//     }); 
//     wrapper.setProps({
//         options: {
//             defaultOptionKey: 'bar',
//             jsonData: JSON.stringify(optionsArray)

//         }
//     });
//     expect(wrapper.props().options.defaultOptionKey).toBe('bar');
//     expect(wrapper.find('select').element.value).toBe('bar');
//     expect(wrapper.props().value).toBe('bar');
//     expect(wrapper.emitted().input[1]).toEqual(['bar']);
//   });
});
