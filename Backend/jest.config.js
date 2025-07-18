/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',  
    testEnvironment: 'node', 
    transform: {
      '^.+\\.tsx?$': 'ts-jest',  
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: ['<rootDir>/src', '<rootDir>/test'], 
  };
  