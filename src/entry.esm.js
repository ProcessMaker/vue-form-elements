import * as components from '@/components/index';

const install = function installVueFormElements(Vue) {
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

export default install;

export * from '@/components/index';
