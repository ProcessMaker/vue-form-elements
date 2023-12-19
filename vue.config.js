module.exports = {
  configureWebpack: {
    externals: process.env.NODE_ENV !== "standalone" ? ["validatorjs", "moment", "moment-timezone", "vue"] : []
  },
  css: {
    extract: true
  },
  lintOnSave: false
};
