import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['spec/**/*.spec.ts'],
    setupFiles: ['spec/mocks/setup.ts'],
    server: {
      deps: {
        // Inline these packages so vi.mock can intercept their fs imports
        inline: ['find-up', 'locate-path', 'p-locate', 'p-limit'],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
})
