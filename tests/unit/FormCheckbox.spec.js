import { shallowMount } from '@vue/test-utils'
import FormCheckbox from '../../src/components/FormCheckbox.vue';

describe('FormCheckbox',() => {
    let wrapper;
    const label = 'Accept Terms';
    beforeEach(() => {
        wrapper = shallowMount(FormCheckbox, {
            propsData: {
                label: label
            }
        });
    });

    it('renders the component', () => {
        expect(wrapper.find('input').attributes().type).toBe('checkbox');
        expect(wrapper.html()).toContain(label);
    });

    it('renders all configured properties', () => {
        const helper = "This is some text";
        const name = "checkboxName";
        const error = "This field has an error";
        const toggle = true;
        const initiallyChecked = true;
        const readOnly = false;

        wrapper.setProps({
            label: label,
            name: name,
            helper: helper,
            toggle: toggle,
            error: error,
            initiallyChecked: initiallyChecked,
            disabled: readOnly
        });

        expect(wrapper.html()).toContain(label);
        expect(wrapper.html()).toContain(helper);
        expect(wrapper.find('input').attributes().name).toBe(name);
        expect(wrapper.find('.custom-switch').exists()).toBe(true);

        expect(wrapper.html()).toContain(error); 
        expect(wrapper.find('input').element.checked).toBe(true);
        expect(wrapper.vm.checked).toBe(true);
        
        wrapper.setProps({initiallyChecked: false});
        expect(wrapper.find('input').element.checked).toBe(false);
        expect(wrapper.vm.checked).toBe(false);
        
        wrapper.setProps({disabled: true});
        expect(wrapper.find('input').attributes().disabled).toBe('disabled');
    });

    it('runs validation', () => {
        wrapper.setProps({
            label: label,
            name: 'checkboxName',
            validation: 'required'
        });
        
        expect(wrapper.find('input').classes()).toContain('is-invalid');
        expect(wrapper.text()).toBe('Accept Terms The checkboxName field is required.');
    });

    it('updates and emits values', () => {
        // Should emit on mount
        expect(wrapper.emitted().input).toBeTruthy();

        wrapper.setProps({
            label: label,
            name: 'checkboxName'
        });
        
        wrapper.find('input').setChecked();
        
        expect(wrapper.vm.checked).toBe(true);
        expect(wrapper.emitted().input.length).toBe(2);
        expect(wrapper.emitted().change[0]).toEqual([true]);
    });
});