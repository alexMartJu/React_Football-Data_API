/**
 * @module components/competitions/TopScorersList
 */

import { Paper, Group, Text, Avatar, Stack, Badge, rem } from '@mantine/core';
import { IconBallFootball, IconShoe } from '@tabler/icons-react';
import type { Scorer } from '../../types/football.types';

/**
 * Props del componente TopScorersList
 */
export interface TopScorersListProps {
  /** Array de goleadores */
  scorers: Scorer[];
  /** Título de la sección (opcional) */
  title?: string;
}

/**
 * Componente TopScorersList
 * 
 * Muestra la lista de máximos goleadores de una competición incluyendo:
 * - Posición en el ranking
 * - Nombre del jugador y nacionalidad
 * - Equipo con escudo
 * - Número de goles
 * - Asistencias (si disponible)
 * - Penaltis (si disponible)
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la lista de goleadores
 * 
 * @example
 * ```tsx
 * <TopScorersList 
 *   scorers={scorersData.scorers} 
 *   title="Máximos Goleadores"
 * />
 * ```
 */
export function TopScorersList({ scorers, title = 'Máximos Goleadores' }: TopScorersListProps) {
  /**
   * Obtiene el color del badge según la posición
   */
  const getPositionColor = (index: number): string => {
    if (index === 0) return 'gold';
    if (index === 1) return 'gray';
    if (index === 2) return '#cd7f32';
    return 'dark';
  };

  /**
   * Obtiene el emoji según la posición
   */
  const getPositionEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
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
      <Stack gap="md">
        <Group justify="space-between" mb="xs">
          <Group gap="xs">
            <IconBallFootball size={24} color="#51cf66" />
            <Text size="lg" fw={600} c="white">
              {title}
            </Text>
          </Group>
          <Badge color="gray" variant="light">
            Top {scorers.length}
          </Badge>
        </Group>

        <Stack gap="sm">
          {scorers.map((scorer, index) => (
            <Paper
              key={`${scorer.player.id}-${scorer.team.id}`}
              p="md"
              radius="md"
              style={{
                backgroundColor: '#1a1b1e',
                borderColor: index < 3 ? '#51cf66' : '#373A40',
                borderWidth: index < 3 ? '2px' : '1px',
                borderStyle: 'solid',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(81, 207, 102, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                {/* Posición y jugador */}
                <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
                  <Badge
                    color={getPositionColor(index)}
                    variant="filled"
                    size="xl"
                    style={{ minWidth: rem(32) }}
                  >
                    {getPositionEmoji(index) || index + 1}
                  </Badge>

                  <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={600} c="white" truncate>
                      {scorer.player.name}
                    </Text>
                    <Group gap="xs">
                      <Avatar
                        src={scorer.team.crest}
                        alt={scorer.team.name}
                        size={20}
                        radius="sm"
                      />
                      <Text size="xs" c="dimmed" truncate>
                        {scorer.team.shortName}
                      </Text>
                      {scorer.player.nationality && (
                        <>
                          <Text size="xs" c="dimmed">
                            •
                          </Text>
                          <Text size="xs" c="dimmed">
                            {scorer.player.nationality}
                          </Text>
                        </>
                      )}
                    </Group>
                  </Stack>
                </Group>

                {/* Estadísticas */}
                <Group gap="md" wrap="nowrap">
                  {/* Goles */}
                  <Stack gap={2} align="center" style={{ minWidth: rem(60) }}>
                    <Group gap={4}>
                      <IconBallFootball size={16} color="#51cf66" />
                      <Text size="xl" fw={700} c="#51cf66">
                        {scorer.goals}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Goles
                    </Text>
                  </Stack>

                  {/* Asistencias */}
                  {scorer.assists !== null && scorer.assists > 0 && (
                    <Stack gap={2} align="center" style={{ minWidth: rem(60) }}>
                      <Group gap={4}>
                        <IconShoe size={16} color="#4dabf7" />
                        <Text size="lg" fw={600} c="#4dabf7">
                          {scorer.assists}
                        </Text>
                      </Group>
                      <Text size="xs" c="dimmed">
                        Asist.
                      </Text>
                    </Stack>
                  )}

                  {/* Penaltis */}
                  {scorer.penalties !== null && scorer.penalties > 0 && (
                    <Stack gap={2} align="center" style={{ minWidth: rem(50) }}>
                      <Badge color="yellow" variant="light" size="lg">
                        {scorer.penalties}
                      </Badge>
                      <Text size="xs" c="dimmed">
                        Penal.
                      </Text>
                    </Stack>
                  )}
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>

        {scorers.length === 0 && (
          <Paper p="xl" radius="md" style={{ backgroundColor: '#1a1b1e' }}>
            <Stack align="center" gap="md">
              <IconBallFootball size={48} color="#868e96" />
              <Text size="lg" c="dimmed" ta="center">
                No hay datos de goleadores disponibles
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
