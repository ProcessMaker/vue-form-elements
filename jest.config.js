process.env.TZ = 'America/Toronto';

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(vue-uniq-ids|lodash-es)/)"
  ]
};
