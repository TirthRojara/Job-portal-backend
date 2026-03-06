import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    roots: ['<rootDir>/src'],

    moduleFileExtensions: ['ts', 'js'],

    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1'
    },

    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

    testMatch: ['**/?(*.)+(test).ts'],

    transform: {
        '^.+\\.ts$': 'ts-jest'
    },

    clearMocks: true
};

export default config;
