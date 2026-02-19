/**
 * @module api/services/__tests__/matches.service.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MatchesService } from '../matches.service'
import axiosInstance from '../../axios.config'
import { mockMatch, mockMatchesResponse } from '../../../test/mockData'

// Mock del módulo axios
vi.mock('../../axios.config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('MatchesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMatches', () => {
    it('debería obtener lista de partidos correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      // Act
      const result = await MatchesService.getMatches()

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches', {
        params: {},
        headers: {},
      })
      expect(result).toEqual(mockMatchesResponse)
      expect(result.matches).toHaveLength(1)
    })

    it('debería incluir headers X-Unfold cuando se especifican opciones', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const unfoldOptions = {
        lineups: true,
        goals: true,
        bookings: false,
      }

      // Act
      await MatchesService.getMatches({}, unfoldOptions)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches', {
        params: {},
        headers: {
          'X-Unfold-Lineups': 'true',
          'X-Unfold-Goals': 'true',
          'X-Unfold-Bookings': 'false',
        },
      })
    })

    it('debería pasar filtros de fecha correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const options = {
        dateFrom: '2024-02-01',
        dateTo: '2024-02-28',
        status: 'FINISHED' as const,
      }

      // Act
      await MatchesService.getMatches(options)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches', {
        params: {
          dateFrom: '2024-02-01',
          dateTo: '2024-02-28',
          status: 'FINISHED',
        },
        headers: {},
      })
    })

    it('debería manejar errores de petición', async () => {
      // Arrange
      const errorMessage = 'Too many requests'
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(new Error(errorMessage))

      // Act & Assert
      await expect(MatchesService.getMatches()).rejects.toThrow(errorMessage)
    })
  })

  describe('getMatchById', () => {
    it('debería obtener un partido por ID correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatch,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const matchId = 327291

      // Act
      const result = await MatchesService.getMatchById(matchId)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/matches/${matchId}`, {
        headers: {},
      })
      expect(result).toEqual(mockMatch)
      expect(result.id).toBe(327291)
    })

    it('debería desplegar información detallada con headers X-Unfold', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatch,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const unfoldOptions = {
        lineups: true,
        bookings: true,
        substitutions: true,
        goals: true,
      }

      // Act
      await MatchesService.getMatchById(327291, unfoldOptions)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches/327291', {
        headers: {
          'X-Unfold-Lineups': 'true',
          'X-Unfold-Bookings': 'true',
          'X-Unfold-Subs': 'true',
          'X-Unfold-Goals': 'true',
        },
      })
    })
  })

  describe('getHead2Head', () => {
    it('debería obtener enfrentamientos previos correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const matchId = 327291

      // Act
      const result = await MatchesService.getHead2Head(matchId)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/matches/${matchId}/head2head`, {
        params: { limit: 10 },
        headers: {},
      })
      expect(result).toEqual(mockMatchesResponse)
    })

    it('debería aplicar límite de resultados', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      // Act
      await MatchesService.getHead2Head(327291, 5)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches/327291/head2head', {
        params: { limit: 5 },
        headers: {},
      })
    })
  })

  describe('getTodayMatches', () => {
    it('debería obtener partidos de hoy sin filtros adicionales', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      // Act
      await MatchesService.getTodayMatches()

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith('/matches', {
        params: {},
        headers: {},
      })
    })
  })
})
