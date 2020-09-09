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
      '^hkclient$': '<rootDir>/src/hkclient',
      '^hkclient/(.*)$': '<rootDir>/src/hkclient/$1',
      '^constants/(.*)$': '<rootDir>/src/constants/$1',
      '^utils$': '<rootDir>/src/utils',
      '^utils/(.*)$': '<rootDir>/src/utils/$1',
      '^test/(.*)$': '<rootDir>/src/test/$1',
      '^action-types$': '<rootDir>/src/action-types',
      '^action-types/(.*)$': '<rootDir>/src/action-types/$1',
      '^actions$': '<rootDir>/src/actions',
      '^actions/(.*)$': '<rootDir>/src/actions/$1',
      '^reducers$': '<rootDir>/src/reducers',
      '^reducers/(.*)$': '<rootDir>/src/reducers/$1',
      '^selectors$': '<rootDir>/src/selectors',
      '^selectors/(.*)$': '<rootDir>/src/selectors/$1',
    },
  }
}
