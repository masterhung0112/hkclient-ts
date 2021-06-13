// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
            diagnostics: true,
        },
        NODE_ENV: 'test',
    },
    preset: 'ts-jest/presets/js-with-babel',
    rootDir: '.',
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    testMatch: [
        '<rootDir>/src/**/*.(spec|test).(ts|js)?(x)',
    ],
    setupFiles: [
        'core-js',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
    clearMocks: true,
    verbose: true,
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^saga-modular$': '<rootDir>/src/hkredux/saga-modular',
        '^saga-modular/(.*)$': '<rootDir>/src/hkredux/saga-modular/$1',
        '^sagas$': '<rootDir>/src/sagas',
        '^sagas/(.*)$': '<rootDir>/src/sagas/$1',
        '^hkredux$': '<rootDir>/src/hkredux',
        '^hkredux/(.*)$': '<rootDir>/src/hkredux/$1',
    },
};
