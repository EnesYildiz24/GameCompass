/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov', 'cobertura'],
      reportsDirectory: './coverage',
      exclude: [
        'src/model/**',
        'dist/**',
        'src/Resources.ts',
        'vitest.config.ts',
        'jest.config.js',
      ]
    },
  },
  // @ts-expect-error  Vitest-Typen kennen typecheck noch nicht
  typecheck: {
    tsconfig: './tsconfig.vitest.json'
  }
});
