/**
 * @module components/teams/SquadTable
 */

import { Table, Badge, Group, Text, Avatar, Stack, ScrollArea } from '@mantine/core';
import { IconUser, IconShirt, IconCoin } from '@tabler/icons-react';
import type { SquadPlayer } from '../../types/football.types';

/**
 * Props del componente SquadTable
 */
export interface SquadTableProps {
  /** Array de jugadores */
  squad: SquadPlayer[];
  /** Filtrar por posición (opcional) */
  position?: 'Goalkeeper' | 'Defence' | 'Midfield' | 'Offence';
}

/**
 * Componente SquadTable
 * 
 * Muestra la plantilla de un equipo en formato tabla incluyendo:
 * - Dorsal
 * - Nombre del jugador
 * - Posición
 * - Nacionalidad
 * - Edad
 * - Valor de mercado
 * - Contrato
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la tabla de plantilla
 * 
 * @example
 * ```tsx
 * <SquadTable squad={team.squad} />
 * <SquadTable squad={team.squad} position="Goalkeeper" />
 * ```
 */
export function SquadTable({ squad, position }: SquadTableProps) {
  /**
   * Filtra jugadores por posición si se especifica
   */
  const filteredSquad = position
    ? squad.filter((player) => player.position === position)
    : squad;

  /**
   * Agrupa jugadores por posición
   */
  /**
   * Normaliza las posiciones variadas de la API a 4 grupos básicos
   */
  const normalizePosition = (pos?: string | null) => {
    if (!pos) return 'Unknown';
    const p = pos.toLowerCase().trim();

    // Mapas exactos según el JSON proporcionado por el usuario:
    // - goalkeeper = Porteros
    // - defence, right-back, left-back, centre-back = Defensas
    // - midfield, attacking midfield, defensive midfield = Centrocampistas
    // - offence, centre-forward, right winger, left winger = Delanteros

    // Goalkeeper
    const reGoal = /\b(goalkeeper|goalie|keeper)\b/i;
    if (reGoal.test(p)) return 'Goalkeeper';

    // Defence
    const reDefence = /\b(centre-back|centre back|center-back|center back|right-back|left-back|right back|left back|full-back|full back|back|defence|defender|defense)\b/i;
    if (reDefence.test(p)) return 'Defence';

    // Midfield (chequear antes que Offence)
    const reMid = /\b(attacking midfield|attacking-midfield|defensive midfield|defensive-midfield|midfield|midfielder|central midfield|central-midfield|mid)\b/i;
    if (reMid.test(p)) return 'Midfield';

    // Offence
    const reOff = /\b(centre-forward|centre forward|center-forward|center forward|right winger|left winger|right-winger|left-winger|winger|wing|forward|striker|attacker|offence|offensive)\b/i;
    if (reOff.test(p)) return 'Offence';

    return 'Unknown';
  };

  const groupedSquad = filteredSquad.reduce((acc, player) => {
    const pos = normalizePosition(player.position || null);
    if (!acc[pos]) {
      acc[pos] = [];
    }
    acc[pos].push(player);
    return acc;
  }, {} as Record<string, SquadPlayer[]>);

  /**
   * Orden de posiciones
   */
  const positionOrder = ['Goalkeeper', 'Defence', 'Midfield', 'Offence', 'Unknown'];

  /**
   * Calcula la edad a partir de la fecha de nacimiento
   */
  const calculateAge = (dateOfBirth: string | null): string => {
    if (!dateOfBirth) return '-';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  /**
   * Formatea el valor de mercado
   */
  const formatMarketValue = (value: number | null): string => {
    if (!value) return '-';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K €`;
    }
    return `${value} €`;
  };

  /**
   * Color del badge según la posición
   */
  const getPositionColor = (position: string): string => {
    switch (position) {
      case 'Goalkeeper':
        return 'yellow';
      case 'Defence':
        return 'blue';
      case 'Midfield':
        return 'green';
      case 'Offence':
        return 'red';
      default:
        return 'gray';
    }
  };

  /**
   * Etiqueta de posición en español
   */
  const getPositionLabel = (position: string): string => {
    switch (position) {
      case 'Goalkeeper':
        return 'Portero';
      case 'Defence':
        return 'Defensa';
      case 'Midfield':
        return 'Centrocampista';
      case 'Offence':
        return 'Delantero';
      default:
        return 'Desconocido';
    }
  };

  if (filteredSquad.length === 0) {
    return (
      <Stack align="center" gap="md" py="xl">
        <IconUser size={48} color="#868e96" />
        <Text c="dimmed" size="lg">
          No hay jugadores en esta posición
        </Text>
      </Stack>
    );
  }

  return (
    <ScrollArea>
      <Stack gap="xl">
        {positionOrder.map((pos) => {
          const players = groupedSquad[pos];
          if (!players || players.length === 0) return null;

          return (
            <div key={pos}>
              {/* Header de posición */}
              <Group mb="md">
                <Badge
                  size="lg"
                  color={getPositionColor(pos)}
                  variant="filled"
                  radius="sm"
                >
                  {getPositionLabel(pos)} ({players.length})
                </Badge>
              </Group>

              {/* Tabla de jugadores */}
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                style={{
                  backgroundColor: '#25262b',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ textAlign: 'center', width: '60px' }}>
                      <IconShirt size={18} />
                    </Table.Th>
                    <Table.Th>Jugador</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Nacionalidad</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Edad</Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>
                      <Group gap={4} justify="center">
                        <IconCoin size={18} />
                        <span>Valor</span>
                      </Group>
                    </Table.Th>
                    <Table.Th style={{ textAlign: 'center' }}>Contrato</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {players.map((player) => (
                    <Table.Tr key={player.id}>
                      {/* Dorsal */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge
                          size="lg"
                          color="dark"
                          variant="light"
                          radius="sm"
                          style={{ fontWeight: 700 }}
                        >
                          {player.shirtNumber || '-'}
                        </Badge>
                      </Table.Td>

                      {/* Jugador */}
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar color="green" radius="xl" size="md">
                            <IconUser size={20} />
                          </Avatar>
                          <div>
                            <Text fw={600} size="sm">
                              {player.name}
                            </Text>
                            {player.firstName && player.lastName && (
                              <Text size="xs" c="dimmed">
                                {player.firstName} {player.lastName}
                              </Text>
                            )}
                          </div>
                        </Group>
                      </Table.Td>

                      {/* Nacionalidad */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm">{player.nationality || '-'}</Text>
                      </Table.Td>

                      {/* Edad */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Text size="sm">{calculateAge(player.dateOfBirth)}</Text>
                      </Table.Td>

                      {/* Valor de mercado */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        <Badge
                          color={player.marketValue ? 'green' : 'gray'}
                          variant="light"
                          size="md"
                        >
                          {formatMarketValue(player.marketValue)}
                        </Badge>
                      </Table.Td>

                      {/* Contrato */}
                      <Table.Td style={{ textAlign: 'center' }}>
                        {player.contract ? (
                          <Text size="xs" c="dimmed">
                            {new Date(player.contract.start).getFullYear()} -{' '}
                            {new Date(player.contract.until).getFullYear()}
                          </Text>
                        ) : (
                          <Text size="xs" c="dimmed">
                            -
                          </Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          );
        })}
      </Stack>
    </ScrollArea>
  );
}
