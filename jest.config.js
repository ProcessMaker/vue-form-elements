process.env.TZ = 'America/Toronto';

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(vue-uniq-ids)/)"
  ]
};
