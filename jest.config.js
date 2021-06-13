// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
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
        transformIgnorePatterns: ['<rootDir>/node_modules/'],
        verbose: true,
        clearMocks: true,
        rootDir: '.',
        moduleDirectories: ['node_modules', 'src'],
        preset: 'ts-jest/presets/js-with-babel',
        setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
        moduleNameMapper: {
            '^types/(.*)$': '<rootDir>/src/types/$1',
            '^store/(.*)$': '<rootDir>/src/store/$1',
            '^client$': '<rootDir>/src/client',
            '^client/(.*)$': '<rootDir>/src/client/$1',
            '^constants$': '<rootDir>/src/constants',
            '^constants/(.*)$': '<rootDir>/src/constants/$1',
            '^utils$': '<rootDir>/src/utils',
            '^utils/(.*)$': '<rootDir>/src/utils/$1',
            '^testlib$': '<rootDir>/src/testlib',
            '^testlib/(.*)$': '<rootDir>/src/testlib/$1',
            '^action_types$': '<rootDir>/src/action_types',
            '^action_types/(.*)$': '<rootDir>/src/action_types/$1',
            '^actions$': '<rootDir>/src/actions',
            '^actions/(.*)$': '<rootDir>/src/actions/$1',
            '^reducers$': '<rootDir>/src/reducers',
            '^reducers/(.*)$': '<rootDir>/src/reducers/$1',
            '^selectors$': '<rootDir>/src/selectors',
            '^selectors/(.*)$': '<rootDir>/src/selectors/$1',
            '^modules$': '<rootDir>/src/modules',
            '^modules/(.*)$': '<rootDir>/src/modules/$1',
            '^saga-modular$': '<rootDir>/src/hkredux/saga-modular',
            '^saga-modular/(.*)$': '<rootDir>/src/hkredux/saga-modular/$1',
            '^sagas$': '<rootDir>/src/sagas',
            '^sagas/(.*)$': '<rootDir>/src/sagas/$1',
            '^redux$': '<rootDir>/src/hkredux',
            '^redux/(.*)$': '<rootDir>/src/hkredux/$1',
        },
        testMatch: [
            '<rootDir>/src/**/*.test.js',
        ],
        setupFiles: [
            'core-js',
        ],
    };
};
