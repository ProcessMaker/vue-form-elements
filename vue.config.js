module.exports = {
  configureWebpack: {
    externals: process.env.NODE_ENV !== "standalone" ? ["validatorjs"] : []
  },
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false
    }
  },

  css: {
    extract: true
  },

  transpileDependencies: true
};
