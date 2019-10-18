module.exports = {
  presets: ['@vue/app'],
  env: {
    test: {
      presets: [["env", { targets: { node: "current" } }]]
    }
  }
};
