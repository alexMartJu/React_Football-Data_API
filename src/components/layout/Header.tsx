/**
 * @module components/layout/Header
 */

import { Group, Title, Container, rem, Anchor } from '@mantine/core';
import { IconBallFootball, IconHome, IconTrophy } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Componente Header
 * 
 * Proporciona la barra de navegación superior con el logo, título de la aplicación
 * y enlaces de navegación a las diferentes páginas.
 * 
 * @returns Elemento JSX del header
 */
export function Header() {
  const location = useLocation();

  /**
   * Verifica si la ruta actual es la indicada
   */
  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        height: rem(60),
        backgroundColor: '#1a1b1e',
        borderBottom: '1px solid #2c2e33',
      }}
    >
      <Container size="xl" h="100%">
        <Group h="100%" justify="space-between">
          {/* Logo y título */}
          <Group>
            <IconBallFootball size={32} color="#51cf66" />
            <Title order={2} c="white" style={{ fontWeight: 700 }}>
              Football Data
            </Title>
          </Group>

          {/* Enlaces de navegación */}
          <Group gap="xl">
            <Anchor
              component={Link}
              to="/"
              underline="never"
              style={{
                color: isActive('/') ? '#51cf66' : '#c1c2c5',
                fontWeight: isActive('/') ? 600 : 400,
                fontSize: rem(15),
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.color = '#51cf66';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/')) {
                  e.currentTarget.style.color = '#c1c2c5';
                }
              }}
            >
              <Group gap="xs">
                <IconHome size={18} />
                <span>Inicio</span>
              </Group>
            </Anchor>

            <Anchor
              component={Link}
              to="/competitions"
              underline="never"
              style={{
                color: isActive('/competitions') ? '#51cf66' : '#c1c2c5',
                fontWeight: isActive('/competitions') ? 600 : 400,
                fontSize: rem(15),
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/competitions')) {
                  e.currentTarget.style.color = '#51cf66';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/competitions')) {
                  e.currentTarget.style.color = '#c1c2c5';
                }
              }}
            >
              <Group gap="xs">
                <IconTrophy size={18} />
                <span>Competiciones</span>
              </Group>
            </Anchor>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
