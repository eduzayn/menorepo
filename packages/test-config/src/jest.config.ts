import { join } from 'path';

interface JestConfigOptions {
  rootDir?: string;
  coverageThreshold?: {
    global?: {
      branches?: number;
      functions?: number;
      lines?: number;
      statements?: number;
    };
  };
  testMatch?: string[];
  setupFilesAfterEnv?: string[];
  moduleNameMapper?: Record<string, string>;
}

export function createJestConfig(options: JestConfigOptions = {}) {
  const {
    rootDir = './',
    coverageThreshold = {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    testMatch = ['**/__tests__/**/*.test.(ts|tsx)'],
    setupFilesAfterEnv = [join(__dirname, 'jest.setup.ts')],
    moduleNameMapper = {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  } = options;

  return {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    rootDir,
    setupFilesAfterEnv,
    moduleNameMapper: {
      ...moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch,
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: join(rootDir, 'tsconfig.json'),
      }],
    },
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/**/index.{ts,tsx}',
      '!src/**/*.stories.{ts,tsx}',
      '!src/setupTests.ts',
    ],
    coverageThreshold,
    coverageReporters: ['text', 'lcov', 'html'],
  };
} 