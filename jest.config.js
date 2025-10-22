module.exports = {
  roots: ['<rootDir>/projects'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  transformIgnorePatterns: ['/node_modules/(?!marked)/']
};
