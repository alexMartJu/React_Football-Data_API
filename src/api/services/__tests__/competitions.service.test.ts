/**
 * @module api/services/__tests__/competitions.service.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CompetitionsService } from '../competitions.service'
import axiosInstance from '../../axios.config'
import { mockCompetition, mockCompetitionsResponse } from '../../../test/mockData'

// Mock del módulo axios
vi.mock('../../axios.config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('CompetitionsService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks()
  })

  describe('getCompetitions', () => {
    it('debería obtener la lista de competiciones correctamente', async () => {
      // Arrange - Configurar el mock
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockCompetitionsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      // Act - Ejecutar el método
      const result = await CompetitionsService.getCompetitions()

      // Assert - Verificar resultados
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith('/competitions')
      expect(result).toEqual(mockCompetitionsResponse)
      expect(result.count).toBe(2)
      expect(result.competitions).toHaveLength(2)
    })

    it('debería pasar filtros correctamente en la petición', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockCompetitionsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const options = { areas: '2077,2088' }

      // Act
      await CompetitionsService.getCompetitions(options)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/competitions?areas=2077%2C2088')
    })

    it('debería manejar errores de red correctamente', async () => {
      // Arrange
      const errorMessage = 'Network Error'
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error(errorMessage))

      // Act & Assert
      await expect(CompetitionsService.getCompetitions()).rejects.toThrow(errorMessage)
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getCompetitionByCode', () => {
    it('debería obtener una competición por código correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockCompetition,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const code = 'PL'

      // Act
      const result = await CompetitionsService.getCompetitionByCode(code)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/competitions/${code}`)
      expect(result).toEqual(mockCompetition)
      expect(result.code).toBe('PL')
      expect(result.name).toBe('Premier League')
    })

    it('debería manejar error 404 cuando la competición no existe', async () => {
      // Arrange
      const error = {
        response: {
          status: 404,
          data: { message: 'Competition not found' },
        },
      }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(error)

      // Act & Assert
      await expect(CompetitionsService.getCompetitionByCode('INVALID')).rejects.toEqual(error)
    })
  })

  describe('getCompetitionById', () => {
    it('debería obtener una competición por ID correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockCompetition,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const id = 2021

      // Act
      const result = await CompetitionsService.getCompetitionById(id)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/competitions/${id}`)
      expect(result).toEqual(mockCompetition)
      expect(result.id).toBe(2021)
    })

    it('debería manejar error 403 cuando no hay permisos', async () => {
      // Arrange
      const error = {
        response: {
          status: 403,
          data: { message: 'Restricted resource' },
        },
      }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(error)

      // Act & Assert
      await expect(CompetitionsService.getCompetitionById(9999)).rejects.toEqual(error)
    })
  })
})
