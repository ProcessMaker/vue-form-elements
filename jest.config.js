process.env.TZ = "America/Toronto";

module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "@vue/vue2-jest"
  },
  transformIgnorePatterns: ["node_modules/(?!(vue-uniq-ids|lodash)/)"],
  moduleNameMapper: {
    "/^@/(.*)$/": "<rootDir>/src/$1",
  }
};
