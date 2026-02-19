/**
 * @module components/competitions/CompetitionList
 */

import { SimpleGrid, Text, Stack, Paper, Center } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import type { Competition } from '../../types/football.types';
import { CompetitionCard } from './CompetitionCard';

/**
 * Props del componente CompetitionList
 */
export interface CompetitionListProps {
  /** Array de competiciones a mostrar */
  competitions: Competition[];
  /** Handler para click en una competición (opcional) */
  onCompetitionClick?: (competition: Competition) => void;
  /** Mensaje cuando no hay competiciones (opcional) */
  emptyMessage?: string;
}

/**
 * Componente CompetitionList
 * 
 * Muestra una lista de competiciones en formato de grid responsive.
 * Maneja el estado vacío con un mensaje personalizado.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX con la lista de competiciones
 * 
 * @example
 * ```tsx
 * <CompetitionList 
 *   competitions={competitions} 
 *   onCompetitionClick={(comp) => navigate(`/competitions/${comp.code}`)}
 *   emptyMessage="No hay competiciones disponibles"
 * />
 * ```
 */
export function CompetitionList({
  competitions,
  onCompetitionClick,
  emptyMessage,
}: CompetitionListProps) {
  if (competitions.length === 0) {
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
            <IconTrophy size={48} color="#868e96" />
            <Text size="lg" c="dimmed" ta="center">
              {emptyMessage || 'No se encontraron competiciones'}
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
        md: 3,
        lg: 4,
      }}
      spacing="lg"
    >
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
          onClick={
            onCompetitionClick
              ? () => onCompetitionClick(competition)
              : undefined
          }
        />
      ))}
    </SimpleGrid>
  );
}
