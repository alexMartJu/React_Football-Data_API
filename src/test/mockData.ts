/**
 * @module test/mockData
 */

import type { 
  Competition, 
  Match, 
  Team,
  MatchesResponse 
} from '../types/football.types'
import type { CompetitionsResponse } from '../api/services/competitions.service'

/**
 * Mock de una competición de ejemplo
 */
export const mockCompetition: Competition = {
  id: 2021,
  name: 'Premier League',
  code: 'PL',
  type: 'LEAGUE',
  emblem: 'https://crests.football-data.org/PL.png',
}

/**
 * Mock de respuesta de lista de competiciones
 */
export const mockCompetitionsResponse: CompetitionsResponse = {
  count: 2,
  filters: {},
  competitions: [
    mockCompetition,
    {
      id: 2014,
      name: 'Primera Division',
      code: 'PD',
      type: 'LEAGUE',
      emblem: 'https://crests.football-data.org/PD.png',
    },
  ],
}

/**
 * Mock de un equipo de ejemplo
 */
export const mockTeam: Team = {
  id: 86,
  name: 'Real Madrid CF',
  shortName: 'Real Madrid',
  tla: 'RMA',
  crest: 'https://crests.football-data.org/86.png',
}

/**
 * Mock de un partido de ejemplo
 */
export const mockMatch: Match = {
  area: {
    id: 2224,
    name: 'Spain',
    code: 'ESP',
    flag: 'https://crests.football-data.org/760.svg',
  },
  competition: mockCompetition,
  season: {
    id: 1564,
    startDate: '2023-08-11',
    endDate: '2024-05-19',
    currentMatchday: 25,
    winner: null,
    stages: ['REGULAR_SEASON'],
  },
  id: 327291,
  utcDate: '2024-02-18T15:00:00Z',
  status: 'FINISHED',
  minute: null,
  injuryTime: null,
  attendance: 78512,
  venue: 'Estadio Santiago Bernabéu',
  matchday: 25,
  stage: 'REGULAR_SEASON',
  group: null,
  lastUpdated: '2024-02-18T17:00:00Z',
  homeTeam: {
    id: 86,
    name: 'Real Madrid CF',
    shortName: 'Real Madrid',
    tla: 'RMA',
    crest: 'https://crests.football-data.org/86.png',
  },
  awayTeam: {
    id: 81,
    name: 'FC Barcelona',
    shortName: 'Barcelona',
    tla: 'FCB',
    crest: 'https://crests.football-data.org/81.svg',
  },
  score: {
    winner: 'HOME_TEAM',
    duration: 'REGULAR',
    fullTime: {
      home: 2,
      away: 1,
    },
    halfTime: {
      home: 1,
      away: 0,
    },
  },
  odds: undefined,
  referees: [],
}

/**
 * Mock de respuesta de lista de partidos
 */
export const mockMatchesResponse: MatchesResponse = {
  filters: {
    date: '2024-02-18',
  },
  resultSet: {
    count: 1,
    first: '2024-02-18',
    last: '2024-02-18',
    played: 1,
  },
  matches: [mockMatch],
}
