module.exports = async () => {
  return {
    globals: {
      'ts-jest': {
        tsConfig: 'tsconfig.json',
        diagnostics: true,
      },
      NODE_ENV: 'test',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    verbose: true,
    rootDir: '.',
    preset: 'ts-jest',
    moduleNameMapper: {
      '^types/(.*)$': '<rootDir>/src/types/$1',
      '^store/(.*)$': '<rootDir>/src/store/$1',
      '^hkclient/(.*)$': '<rootDir>/src/hkclient/$1',
      '^utils/(.*)$': '<rootDir>/src/utils/$1',
      '^test/(.*)$': '<rootDir>/src/test/$1',
    },
  }
}
