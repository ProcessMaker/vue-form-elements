import { shallowMount } from '@vue/test-utils'
import FormRadioButton from '../../src/components/FormRadioButtonGroup.vue';

describe('FormRadioButton', () => {
    let wrapper;
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
    const json = JSON.stringify(optionsArray);

    beforeEach(() => {
        wrapper = shallowMount(FormRadioButton, {
            propsData: {
                options: optionsArray
            }
        });
    });

    it('renders the component', () => {
        expect(wrapper.find('input').attributes().type).toBe('radio');
        debugger;
    });

    it('renders the component with the "provideData" data source', () => {
        wrapper.setProps({
            dataSource: 'provideData',
            jsonData: json    
        });
        expect(wrapper.find('input').attributes().type).toBe('radio');
    });

    // TODO: Write a test for the dataObject data source.

    it('renders all configured properties', () => {
        const label = "Form Radio Label";
        const helper = "This is some text";
        const name = "namehere";
        const errorText = "This field has an error";
        const defaultOptionKey = 'foo';
        const toggle = true;

        wrapper.setProps({
            label: label,
            helper: helper,
            name: name,
            error: errorText,
            toggle: toggle,
            defaultOptionKey: defaultOptionKey,
            disabled: true,
        });
        
        expect(wrapper.html()).toContain(label);
        expect(wrapper.find('.form-text').isVisible()).toBe(true);
        expect(wrapper.find('.form-text').text()).toBe(helper);
        expect(wrapper.find('input').attributes().name).toBe(name);

        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(errorText);
        expect(wrapper.find('.custom-radio').isVisible()).toBe(true);
        expect(wrapper.vm.value).toBe(defaultOptionKey);
        expect(wrapper.find('input').attributes().disabled).toBe('disabled');
    });

    it('renders all configured properties for the "provideData" data source', () => {
        const dataSource = 'provideData';
        const defaultOptionKey = 'bar';

        wrapper.setProps({
            dataSource: dataSource,
            defaultOptionKey: defaultOptionKey,
            jsonData: json    
        });
        
        const radioInputs = wrapper.findAll('input');
        expect(radioInputs.at(1).element.checked).toBe(true);
        expect(wrapper.vm.value).toBe(defaultOptionKey);

        expect(wrapper.props().options.dataSource).toBe(dataSource);
        expect(wrapper.props().options.jsonData).toBe(json);
    });

    // TODO: Write a test for the dataObject data source

    it('updates and emits the radio button v-model', () => {
        // Should emit on mount
        expect(wrapper.emitted().input).toBeTruthy();

        wrapper.setProps({
            value: 'bar'
        });
        
        expect(wrapper.vm.value).toBe('bar');
        const radioInputs = wrapper.findAll('input');
        expect(radioInputs.at(1).element.checked).toBe(true);

        radioInputs.at(0).setChecked();
        expect(radioInputs.at(1).element.checked).toBe(false);
        expect(radioInputs.at(0).element.checked).toBe(true);
        expect(wrapper.vm.value).toBe('foo');
        
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input[1]).toEqual(['foo']);
    });

    it('updates and emits the radio button v-model for the "provideData" data source', () => {
        // Should emit on mount
        expect(wrapper.emitted().input).toBeTruthy();
        
        wrapper.setProps({
            value: 'bar',
            options: {
                dataSource: 'provideData',
                jsonData: json
            }
        });
        expect(wrapper.vm.value).toBe('bar');
        const radioInputs = wrapper.findAll('input');
        expect(radioInputs.at(1).element.checked).toBe(true);

        radioInputs.at(0).setChecked();
        expect(radioInputs.at(1).element.checked).toBe(false);
        expect(radioInputs.at(0).element.checked).toBe(true);
        expect(wrapper.vm.value).toBe('foo');
        
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().input[1]).toEqual(['foo']);
    });

    it('runs validation', () => {
        const requiredText = 'The FormRadioButton is an required field.';
        const invalidSelectText = 'The selected FormRadioButton is invalid.';

        wrapper.setProps({
            name: "FormRadioButton",
            validation: "required|in:bar"
        });
        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(requiredText);

        const radioInputs = wrapper.findAll('input');
        radioInputs.at(0).setChecked();
        
        expect(wrapper.find('.is-invalid').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(true);
        expect(wrapper.find('.invalid-feedback').isVisible()).toBe(true);
        expect(wrapper.find('.invalid-feedback').text()).toBe(invalidSelectText);

        radioInputs.at(1).setChecked();
        expect(wrapper.find('.is-invalid').exists()).toBe(false);
        expect(wrapper.find('.invalid-feedback').exists()).toBe(false);
    });
});
