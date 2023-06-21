module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  configureWebpack: {
    externals: process.env.NODE_ENV !== "standalone" ? ["validatorjs", "lodash", "moment", "moment-timezone", "vue"] : []
  },
  css: {
    extract: true
  }
};
