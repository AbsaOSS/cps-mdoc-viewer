module.exports = {
  moduleNameMapper: {
    '^cps-mdoc-viewer$': '<rootDir>/projects/cps-mdoc-viewer/src/public-api.ts'
  },
  transformIgnorePatterns: ['/node_modules/(?!marked)/']
};
