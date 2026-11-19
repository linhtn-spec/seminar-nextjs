import { configDefaults, defineConfig } from 'vitest/config'
import { failureScenario } from './lib/test-scenarios'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: process.env.POKEDEX_TEST_MODE === 'failure' ? [failureScenario.file] : configDefaults.include,
  },
})
