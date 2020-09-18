/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    }
};
