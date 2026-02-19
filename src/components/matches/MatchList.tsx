/**
 * @module components/matches/MatchList
 */

import { SimpleGrid, Text, Stack, Paper, Center } from '@mantine/core';
import { IconBallFootball } from '@tabler/icons-react';
import type { Match } from '../../types/football.types';
import { MatchCard } from './MatchCard';

/**
 * Props del componente MatchList
 */
export interface MatchListProps {
  /** Array de partidos a mostrar */
  matches: Match[];
  /** Handler para click en un partido (opcional) */
  onMatchClick?: (matchId: number) => void;
  /** Mensaje cuando no hay partidos (opcional) */
  emptyMessage?: string;
}

/**
 * Componente MatchList
 * 
 * Muestra una lista de partidos en formato de grid responsive.
 * Maneja el estado vacío con un mensaje personalizado.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX con la lista de partidos
 * 
 * @example
 * ```tsx
 * <MatchList 
 *   matches={matches} 
 *   onMatchClick={(id) => navigate(`/match/${id}`)}
 *   emptyMessage="No hay partidos programados para hoy"
 * />
 * ```
 */
export function MatchList({ matches, onMatchClick, emptyMessage }: MatchListProps) {
  if (matches.length === 0) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          borderColor: '#373A40',
        }}
        withBorder
      >
        <Center>
          <Stack align="center" gap="md">
            <IconBallFootball size={48} color="#868e96" />
            <Text size="lg" c="dimmed" ta="center">
              {emptyMessage || 'No se encontraron partidos'}
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <SimpleGrid
      cols={{
        base: 1,
        sm: 2,
        lg: 3,
      }}
      spacing="lg"
    >
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onClick={onMatchClick ? () => onMatchClick(match.id) : undefined}
        />
      ))}
    </SimpleGrid>
  );
}
