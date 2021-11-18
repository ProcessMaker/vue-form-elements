process.env.TZ = 'America/Toronto';

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.vue'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(vue-uniq-ids)/)'
  ]
};
