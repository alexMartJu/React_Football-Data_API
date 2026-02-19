/**
 * @module App
 * Configura providers globales (Mantine, React Query) y define
 * la estructura principal de la aplicación con layout y rutas.
 */

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Competitions } from './pages/Competitions';
import { CompetitionDetail } from './pages/CompetitionDetail';
import { TeamDetail } from './pages/TeamDetail';
import MatchDetail from './pages/MatchDetail';
import '@mantine/core/styles.css';
import './App.css';

/**
 * Cliente de React Query configurado con opciones optimizadas
 * 
 * Configuración:
 * - Reintentos: 2 intentos en caso de error
 * - Cache time: 5 minutos
 * - Stale time: 2 minutos
 * - Refetch on window focus: habilitado para datos frescos
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      staleTime: 2 * 60 * 1000, // 2 minutos
      gcTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

/**
 * Componente principal de la aplicación
 * 
 * Proporciona:
 * - Configuración de tema con Mantine (modo oscuro)
 * - Provider de React Query para gestión de estado asíncrono
 * - Router para navegación
 * - Layout común (Header)
 * - Devtools de React Query en desarrollo
 * 
 * @returns Elemento JSX de la aplicación
 */
function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'green',
        defaultRadius: 'md',
      }}
      defaultColorScheme="dark"
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', backgroundColor: '#1a1b1e' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/competitions/:code" element={<CompetitionDetail />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
            </Routes>
          </div>
        </BrowserRouter>
        {/* Devtools solo en desarrollo */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
