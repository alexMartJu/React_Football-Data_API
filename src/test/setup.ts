/**
 * @module test/setup
 */

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup después de cada test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Configuración global de expect
expect.extend({})
