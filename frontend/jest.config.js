/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Mock CSS modules
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // Mock Next.js Image component
    '^next/image$': '<rootDir>/__mocks__/next/image.js',
    // Mock Next.js Link component
    '^next/link$': '<rootDir>/__mocks__/next/link.js',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
}
