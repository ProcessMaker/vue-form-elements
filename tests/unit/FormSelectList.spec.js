import { shallowMount } from '@vue/test-utils'
import FormSelectList from '../../src/components/FormSelectList.vue';

describe('FormSelectList', () => {
    let wrapper;
    const $t = () => {};
    const optionsArray = [
        {
            "value": "foo",
            "content": "Foo"
        },
        {
            "value": "bar",
            "content": "Bar"
        }
    ];
    const json = JSON.stringify(optionsArray);

    beforeEach(() => {
        wrapper = shallowMount(FormSelectList,{
            mocks: {$t},
            propsData: {
                options: optionsArray,
            }
        });
    });

    it('renders the component', () => {
        expect(wrapper.html()).toContain('select');
        expect(wrapper.findAll('option').length).toBe(optionsArray.length + 1);
    });

    it('renders the component as a dropdown', () => {
        wrapper.setProps({
            options: {
                renderAs: 'dropdown',
                jsonData: json
            }
        });
        expect(wrapper.html()).toContain('select');
        expect(wrapper.findAll('option').length).toBe(optionsArray.length + 1);
    });

    it('can render the component as a multiselect dropdown', () => {
        wrapper.setProps({
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

    it('can render the component as a checkbox', () => {
        wrapper.setProps({
            options: {
                renderAs: 'checkbox',
                jsonData: json
            }
        });
        expect(wrapper.html()).toContain('input');
        expect(wrapper.findAll('input[type="radio"]').length).toBe(optionsArray.length);
    });

    it('can render the component as a multiselect checkbox', () => {
        wrapper.setProps({
            options: {
                renderAs: 'checkbox',
                jsonData: json,
                allowMultiSelect: true,
            }
        });
        expect(wrapper.find('input').attributes().type).toBe('checkbox');
        expect(wrapper.findAll('input').length).toBe(optionsArray.length);
    });
    
    it('can render all configured properties', () => {
        const label = 'Form Select Label';
        const helper = 'This is some text';
        const name = 'FormSelect';
        const errorText = 'This field has an error';
        const dataName = 'dataSelectList';
        const dataSource = 'provideData';
        const pmql = "";
        const defaultOption = 'foo';

        wrapper.setProps({
            label: label,
            helper: helper,
            name: name,
            error: errorText,
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
        
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(errorText);
        expect(wrapper.find('input').classes('is-invalid')).toBe(true);

        expect(wrapper.find('input').attributes().type).toBe('checkbox');
        expect(wrapper.props().options.dataName).toBe(dataName);
        expect(wrapper.props().options.dataSource).toBe(dataSource);
        
        // Checks that the default value has been set
        const checkboxInputs = wrapper.findAll('input');
        expect(checkboxInputs.at(0).element.checked).toBe(true);
        expect(wrapper.vm.value).toBe(defaultOption);
        expect(wrapper.props().options.jsonData).toBe(JSON.stringify(optionsArray));
        expect(wrapper.props().options.pmqlQuery).toBe(pmql);
    });
    
    it('runs validation on the checkbox field', () => {
        const requiredText = 'The checkboxField field is required.';
        const invalidSelectText = 'The selected checkboxField is invalid.';

        wrapper.setProps({
            name: 'checkboxField',
            options: {
                renderAs: 'checkbox',
                jsonData: json
            },
            validation: 'required|in:bar'    
        });
    
        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);
        
        const checkboxInputs = wrapper.findAll('input');
        checkboxInputs.at(0).setChecked();
        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(invalidSelectText);

        checkboxInputs.at(1).setChecked()
        expect(wrapper.find('.is-invalid').exists()).toBe(false);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    });

    it('runs validation on the dropdown field', () => {
        const requiredText = 'The dropdownField field is required.';
        const invalidSelection = 'The selected dropdownField is invalid.';

        wrapper.setProps({
            name: 'dropdownField',
            options: {
                renderAs: 'dropdown',
                jsonData: json
            },
            validation: 'required|in:bar'
        });

        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(requiredText);
        
        const dropdownOptions = wrapper.findAll('option');
        dropdownOptions.at(1).setSelected();
        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(invalidSelection);

        dropdownOptions.at(2).setSelected()
        expect(wrapper.find('.is-invalid').exists()).toBe(false);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    });
    
    it('should update the checkbox v-model',  function () {
        expect(wrapper.emitted()).toBeTruthy();

        wrapper.setProps({
            options: {
                renderAs: 'checkbox',
                jsonData: json
            }
        });

        const checkBoxInputs = wrapper.findAll('input');
        checkBoxInputs.at(1).setChecked();
        expect(wrapper.vm.value).toBe('foo');
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input[1]).toEqual(['foo']);
    });

    it('should update the multiselect checkbox v-model',  function () {
        expect(wrapper.emitted()).toBeTruthy();
        
        wrapper.setProps({
            options: {
                renderAs: 'checkbox',
                jsonData: json,
                allowMultiSelect: true
            }
        });

        const checkBoxInputs = wrapper.findAll('input');
        checkBoxInputs.at(0).setChecked();
        checkBoxInputs.at(1).setChecked();
        expect(wrapper.vm.value).toBe(['foo','bar']);
        expect(wrapper.emitted().input.length).toBe(3);
        expect(wrapper.emitted().input[2]).toEqual(['foo', 'bar']);
    });

    it('should update and emit the dropdown v-model',  function () {
        expect(wrapper.emitted()).toBeTruthy();
        
        wrapper.setProps({
            options: {
                renderAs: 'dropdown',
                jsonData: json
            }
        });

        const dropDownOptions = wrapper.findAll('option');
        dropDownOptions.at(1).setSelected();
        expect(wrapper.vm.value).toBe('foo');
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input[1]).toEqual(['foo']);
    });

    it('should update the multiselect dropdown v-model',  function () {
        expect(wrapper.emitted()).toBeTruthy();

        wrapper.setProps({
            options: {
                renderAs: 'dropdown',
                jsonData: json,
                allowMultiSelect: true,
            }
        });
        
        const firstValue = wrapper.vm.optionsList[0].value;
        const secondValue = wrapper.vm.optionsList[1].value;
        const optionsList = [firstValue, secondValue];
        wrapper.vm.selectedOptions = optionsList;
        wrapper.vm.sendSelectedOptions();
        
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input).toEqual([[['foo','bar']]]);
        expect(wrapper.vm.value).toBe(['foo', 'bar']);
    });
});
