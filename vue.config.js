module.exports = {
  configureWebpack: {
    externals: process.env.NODE_ENV !== "standalone" ? ["validatorjs", "moment", "moment-timezone", "vue"] : []
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
  transpileDependencies: true,
  lintOnSave: false
};
