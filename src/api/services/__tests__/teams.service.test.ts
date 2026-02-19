/**
 * @module api/services/__tests__/teams.service.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TeamsService } from '../teams.service'
import axiosInstance from '../../axios.config'
import { mockTeam, mockMatchesResponse } from '../../../test/mockData'
import type { TeamDetail } from '../../../types/football.types'

// Mock del módulo axios
vi.mock('../../axios.config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('TeamsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getTeamById', () => {
    it('debería obtener información completa de un equipo por ID', async () => {
      // Arrange
      const mockTeamDetail: TeamDetail = {
        ...mockTeam,
        area: {
          id: 2224,
          name: 'Spain',
          code: 'ESP',
          flag: 'https://crests.football-data.org/760.svg',
        },
        address: 'Avenida de Concha Espina 1 Madrid 28036',
        website: 'http://www.realmadrid.com',
        founded: 1902,
        clubColors: 'White / Purple',
        venue: 'Estadio Santiago Bernabéu',
        runningCompetitions: [],
        coach: {
          id: 3,
          name: 'Carlo Ancelotti',
          firstName: 'Carlo',
          lastName: 'Ancelotti',
          dateOfBirth: '1959-06-10',
          nationality: 'Italy',
          contract: {
            start: '2021-06',
            until: '2024-06',
          },
        },
        squad: [],
        staff: [],
        lastUpdated: '2024-02-18T10:00:00Z',
      }

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockTeamDetail,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const teamId = 86

      // Act
      const result = await TeamsService.getTeamById(teamId)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}`)
      expect(result).toEqual(mockTeamDetail)
      expect(result.id).toBe(86)
      expect(result.name).toBe('Real Madrid CF')
      expect(result.coach).toBeDefined()
      expect(result.squad).toBeDefined()
    })

    it('debería manejar error cuando el equipo no existe', async () => {
      // Arrange
      const error = {
        response: {
          status: 404,
          data: { message: 'Team not found' },
        },
      }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(error)

      // Act & Assert
      await expect(TeamsService.getTeamById(99999)).rejects.toEqual(error)
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getTeamMatches', () => {
    it('debería obtener partidos de un equipo correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const teamId = 86

      // Act
      const result = await TeamsService.getTeamMatches(teamId)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledTimes(1)
      expect(axiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}/matches`, {
        params: {},
      })
      expect(result).toEqual(mockMatchesResponse)
    })

    it('debería aplicar filtros de estado y límite correctamente', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const teamId = 86
      const options = {
        status: 'FINISHED' as const,
        limit: 5,
        venue: 'HOME' as const,
      }

      // Act
      await TeamsService.getTeamMatches(teamId, options)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}/matches`, {
        params: {
          status: 'FINISHED',
          limit: 5,
          venue: 'HOME',
        },
      })
    })

    it('debería aplicar filtro de rango de fechas', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const teamId = 86
      const options = {
        dateFrom: '2024-01-01',
        dateTo: '2024-02-01',
      }

      // Act
      await TeamsService.getTeamMatches(teamId, options)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}/matches`, {
        params: {
          dateFrom: '2024-01-01',
          dateTo: '2024-02-01',
        },
      })
    })

    it('debería filtrar por competiciones específicas', async () => {
      // Arrange
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockMatchesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      })

      const teamId = 86
      const options = {
        competitions: 'PD,CL',
        season: '2023',
      }

      // Act
      await TeamsService.getTeamMatches(teamId, options)

      // Assert
      expect(axiosInstance.get).toHaveBeenCalledWith(`/teams/${teamId}/matches`, {
        params: {
          competitions: 'PD,CL',
          season: '2023',
        },
      })
    })

    it('debería manejar error 403 de acceso restringido', async () => {
      // Arrange
      const error = {
        response: {
          status: 403,
          data: { message: 'Restricted resource' },
        },
      }
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(error)

      // Act & Assert
      await expect(TeamsService.getTeamMatches(86)).rejects.toEqual(error)
    })
  })
})
