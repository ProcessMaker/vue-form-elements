/**
 * Gets the screen parent or null if don't have
 * @returns {object|null}
 */
function findScreenOwner(control) {
  let owner = control.$parent;
  while (owner) {
    const isScreen = owner.$options.name === "ScreenContent";
    const nestedScreen =
      owner.$parent && owner.$parent.$parent && owner.$parent.$parent.$parent;
    const isNestedScreen =
      nestedScreen &&
      nestedScreen.$options._componentTag === "form-nested-screen";
    if (isScreen && !isNestedScreen) {
      return owner;
    }
    if (isNestedScreen) {
      owner = nestedScreen;
    } else {
      owner = owner.$parent;
    }
  }
  return null;
}
/**
 * Wrap the data of a control using a Proxy
 * @return {object} proxy
 */
function wrapScreenData(screen, customFunctions = null) {
  const handler = {
    get: (target, name) => {
      if (name === "_parentScreen") {
        return findScreenOwner(screen);
      }
      if (customFunctions && customFunctions[name]) {
        return customFunctions[name];
      }
      if (name === "_parent") {
        const screenOwner = findScreenOwner(screen);
        // Get _parent for the current screen (e.g. Inside Loops, Inside Tabs?, RecordLists...?)
        if (screenOwner) {
          return wrapScreenData(screenOwner);
        }
        if (screen.vdata) {
          return screen.vdata._parent;
        }
        return undefined;
      }
      // Check if vdata exists
      if (screen.vdata !== undefined && screen.vdata !== null) {
        return screen.vdata[name];
      }
      return undefined;
    },
    has(target, name) {
      // customFunctions is used by RichText controls
      // to add custom Mustache functions
      if (screen.customFunctions && screen.customFunctions[name]) {
        return true;
      }
      if (name === "_parent") {
        return true;
      }
      // Check if vdata exists
      if (screen.vdata !== undefined && screen.vdata !== null) {
        return screen.vdata[name] !== undefined;
      }
      return false;
    }
  };
  return new Proxy({}, handler);
}

export default {
  methods: {
    /**
     * Create a proxy for an empty object in order to avoid unexpected refresh
     *
     * @return {object} proxy
     */
    makeProxyData() {
      const control = this;
      const screen = findScreenOwner(control, control.customFunctions);
      return wrapScreenData(screen);
    }
  }
};
