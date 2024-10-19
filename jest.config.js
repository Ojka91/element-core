module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    verbose: true,
    // Coverage options
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.test.ts',
    ],
    coverageDirectory: 'build/coverage',
};
