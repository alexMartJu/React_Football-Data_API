/**
 * @module components/competitions/CompetitionCard
 */

import { Card, Image, Text, Badge, Stack, Group } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import type { Competition } from '../../types/football.types';

/**
 * Props del componente CompetitionCard
 */
export interface CompetitionCardProps {
  /** Datos de la competición a mostrar */
  competition: Competition;
  /** Handler para click en el card (opcional) */
  onClick?: () => void;
}

/**
 * Mapeo de tipos de competición a colores
 */
const COMPETITION_TYPE_COLORS: Record<string, string> = {
  LEAGUE: 'green',
  CUP: 'blue',
  LEAGUE_CUP: 'grape',
  PLAYOFFS: 'orange',
};

/**
 * Mapeo de tipos de competición a etiquetas en español
 */
const COMPETITION_TYPE_LABELS: Record<string, string> = {
  LEAGUE: 'Liga',
  CUP: 'Copa',
  LEAGUE_CUP: 'Copa de Liga',
  PLAYOFFS: 'Playoffs',
};

/**
 * Componente CompetitionCard
 * 
 * Muestra la información de una competición en formato de tarjeta incluyendo:
 * - Logo/emblema de la competición
 * - Nombre y código
 * - Tipo (Liga, Copa, etc.)
 * - Área/país
 * 
 * Implementa gestión de imágenes de forma eficiente (caché del navegador).
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la tarjeta de la competición
 * 
 * @example
 * ```tsx
 * <CompetitionCard 
 *   competition={competitionData} 
 *   onClick={() => navigate(`/competitions/${competitionData.code}`)} 
 * />
 * ```
 */
export function CompetitionCard({ competition, onClick }: CompetitionCardProps) {
  const typeColor = COMPETITION_TYPE_COLORS[competition.type] || 'gray';
  const typeLabel = COMPETITION_TYPE_LABELS[competition.type] || competition.type;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: '#25262b',
        borderColor: '#373A40',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      <Stack gap="md">
        {/* Logo de la competición */}
        <Group justify="center" style={{ minHeight: 120 }}>
          {competition.emblem ? (
            <Image
              src={competition.emblem}
              alt={`${competition.name} logo`}
              fit="contain"
              h={100}
              w="auto"
              fallbackSrc="https://placehold.co/100x100/373A40/51cf66?text=%3F"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
              }}
            />
          ) : (
            <Group
              justify="center"
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                backgroundColor: '#373A40',
              }}
            >
              <IconTrophy size={48} color="#51cf66" />
            </Group>
          )}
        </Group>

        {/* Información de la competición */}
        <Stack gap="xs">
          {/* Nombre */}
          <Text
            size="lg"
            fw={700}
            c="white"
            lineClamp={2}
            ta="center"
            style={{ minHeight: 56 }}
          >
            {competition.name}
          </Text>

          {/* Código y tipo */}
          <Group justify="center" gap="xs">
            <Badge color="gray" variant="light" size="sm">
              {competition.code}
            </Badge>
            <Badge color={typeColor} variant="filled" size="sm">
              {typeLabel}
            </Badge>
          </Group>

          {/* Área/País */}
          {competition.area && (
            <Group justify="center" gap="xs" mt="xs">
              <Text size="sm" c="dimmed" ta="center">
                {competition.area.name}
              </Text>
            </Group>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
