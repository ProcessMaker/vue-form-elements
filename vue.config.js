module.exports = {
  configureWebpack: {
    externals: process.env.NODE_ENV !== 'standalone' ? [
      'validatorjs',
      'lodash',
    ] : [],
  },
  css: {
    extract: true,
  }
};
