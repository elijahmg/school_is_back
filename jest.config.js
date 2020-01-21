module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.graphql?$': 'jest-transform-graphql',
  },
  testEnvironment: 'node',
  testRegex: '/src/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'graphql'],
  setupFilesAfterEnv: ['./jest.setup.js']
};