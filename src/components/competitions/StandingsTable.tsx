/**
 * @module components/competitions/StandingsTable
 */

import { Table, Paper, Group, Text, Avatar, Stack, Badge, rem } from '@mantine/core';
import type { Standing } from '../../types/football.types';

/**
 * Props del componente StandingsTable
 */
export interface StandingsTableProps {
  /** Datos de la clasificación */
  standing: Standing;
  /** Mostrar todas las columnas o versión compacta para móvil */
  compact?: boolean;
}

/**
 * Componente StandingsTable
 * 
 * Muestra la tabla de clasificación de una competición incluyendo:
 * - Posición del equipo
 * - Escudo y nombre del equipo
 * - Estadísticas: partidos jugados, victorias, empates, derrotas
 * - Puntos, goles a favor/en contra, diferencia de goles
 * - Forma reciente (últimos 5 partidos)
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la tabla de clasificación
 * 
 * @example
 * ```tsx
 * <StandingsTable standing={standingsData.standings[0]} />
 * ```
 */
export function StandingsTable({ standing, compact = false }: StandingsTableProps) {
  /**
   * Obtiene el color del badge según la posición
   */
  const getPositionColor = (position: number): string => {
    // Champions League (1-4)
    if (position <= 4) return '#51cf66';
    // Europa League (5-6)
    if (position <= 6) return '#4dabf7';
    // Relegación (últimos 3)
    if (position >= standing.table.length - 2) return '#ff6b6b';
    // Resto
    return '#868e96';
  };

  /**
   * Parsea la forma reciente para mostrar badges
   */
  const parseForm = (form: string | null): string[] => {
    if (!form) return [];
    return form.split(',').filter((f) => f.length > 0);
  };

  /**
   * Obtiene el color del badge de forma
   */
  const getFormColor = (result: string): string => {
    switch (result) {
      case 'W':
        return 'green';
      case 'D':
        return 'yellow';
      case 'L':
        return 'red';
      default:
        return 'gray';
    }
  };

  /**
   * Obtiene la letra del resultado
   */
  const getFormLabel = (result: string): string => {
    switch (result) {
      case 'W':
        return 'V';
      case 'D':
        return 'E';
      case 'L':
        return 'D';
      default:
        return result;
    }
  };

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        borderColor: '#373A40',
      }}
      withBorder
    >
      <Stack gap="xs">
        <Group justify="space-between" mb="sm">
          <Text size="lg" fw={600} c="white">
            {standing.type === 'TOTAL' && 'Clasificación General'}
            {standing.type === 'HOME' && 'Clasificación Local'}
            {standing.type === 'AWAY' && 'Clasificación Visitante'}
          </Text>
          {standing.group && (
            <Badge color="gray" variant="light">
              {standing.group}
            </Badge>
          )}
        </Group>

        <div style={{ overflowX: 'auto' }}>
          <Table
            striped
            highlightOnHover
            withTableBorder={false}
            withColumnBorders={false}
            style={{
              minWidth: compact ? '600px' : '800px',
            }}
          >
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#1a1b1e' }}>
                <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50) }}>
                  Pos
                </Table.Th>
                <Table.Th style={{ color: '#c1c2c5', fontWeight: 600 }}>Equipo</Table.Th>
                <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                  PJ
                </Table.Th>
                {!compact && (
                  <>
                    <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                      G
                    </Table.Th>
                    <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                      E
                    </Table.Th>
                    <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                      P
                    </Table.Th>
                    <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                      GF
                    </Table.Th>
                    <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                      GC
                    </Table.Th>
                  </>
                )}
                <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(50), textAlign: 'center' }}>
                  DG
                </Table.Th>
                <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(60), textAlign: 'center' }}>
                  Pts
                </Table.Th>
                {!compact && (
                  <Table.Th style={{ color: '#c1c2c5', fontWeight: 600, width: rem(120), textAlign: 'center' }}>
                    Forma
                  </Table.Th>
                )}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {standing.table.map((position) => (
                <Table.Tr
                  key={position.team.id}
                  style={{
                    backgroundColor: '#25262b',
                  }}
                >
                  <Table.Td>
                    <Badge
                      color={getPositionColor(position.position)}
                      variant="filled"
                      size="lg"
                      circle
                    >
                      {position.position}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        src={position.team.crest}
                        alt={position.team.name}
                        size={32}
                        radius="sm"
                      />
                      <div style={{ minWidth: 0 }}>
                        <Text size="sm" fw={500} c="white" truncate>
                          {position.team.name}
                        </Text>
                        <Text size="xs" c="dimmed" truncate>
                          {position.team.shortName}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Text size="sm" c="white">
                      {position.playedGames}
                    </Text>
                  </Table.Td>
                  {!compact && (
                    <>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm" c="white">
                          {position.won}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm" c="white">
                          {position.draw}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm" c="white">
                          {position.lost}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm" c="white">
                          {position.goalsFor}
                        </Text>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm" c="white">
                          {position.goalsAgainst}
                        </Text>
                      </Table.Td>
                    </>
                  )}
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Text
                      size="sm"
                      fw={600}
                      c={position.goalDifference > 0 ? 'green' : position.goalDifference < 0 ? 'red' : 'white'}
                    >
                      {position.goalDifference > 0 && '+'}
                      {position.goalDifference}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: 'center' }}>
                    <Text size="sm" fw={700} c="#51cf66">
                      {position.points}
                    </Text>
                  </Table.Td>
                  {!compact && (
                    <Table.Td>
                      <Group gap={4} justify="center" wrap="nowrap">
                        {parseForm(position.form).map((result, idx) => (
                          <Badge
                            key={idx}
                            color={getFormColor(result)}
                            variant="filled"
                            size="sm"
                            style={{ minWidth: rem(24) }}
                          >
                            {getFormLabel(result)}
                          </Badge>
                        ))}
                      </Group>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Stack>
    </Paper>
  );
}
