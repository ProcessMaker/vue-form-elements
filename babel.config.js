module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['@vue/app'],
  };
};
