import { shallowMount } from '@vue/test-utils'
import FormInput from "../../src/components/FormInput.vue";

describe('FormInput', () => {
  it('can create the component', () => {
    const wrapper = shallowMount(FormInput);
    expect(wrapper.html()).toContain('input');
  })
});
