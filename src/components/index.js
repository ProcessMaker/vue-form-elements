import { camelCase, upperFirst } from "lodash";

export default {
  install(app) {
    const componentFiles = import.meta.globEager("./*.vue");
    const mixinsFiles = import.meta.globEager("./mixins/*.js");

    Object.entries(componentFiles).forEach(([path, m]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );

      app.component(`${componentName}`, m.default);
    });
    Object.entries(mixinsFiles).forEach(([path]) => {
      const mixingName = upperFirst(
        camelCase(
          path
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );

      app.mixin(`${mixingName}`);
    });
  }
};
