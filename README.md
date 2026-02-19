# ⚽ Football Data API - Web Application

Aplicación web desarrollada con **React + Vite + TypeScript** para consumir la API de [Football-Data.org](https://www.football-data.org/). El proyecto demuestra buenas prácticas en el consumo de APIs REST, gestión asíncrona, separación de hilos, caché y manejo de estados.

---

## 📋 Descripción del Proyecto

Esta aplicación permite consultar información en tiempo real sobre competiciones de fútbol, equipos, partidos y jugadores. Consume múltiples endpoints de la API de Football-Data y presenta los datos de forma profesional con una interfaz moderna basada en Mantine UI.

### ✨ Características Principales

- 🔐 **Autenticación segura** mediante API Key en headers
- 🌐 **Consumo de 10+ endpoints** diferentes de la API
- 📊 **Múltiples páginas**: Home, Competiciones, Detalle de Competición, Detalle de Equipo, Detalle de Partido
- ⚡ **Operaciones asíncronas** con React Query (TanStack Query)
- 💾 **Sistema de caché** automático para optimizar peticiones
- 🎨 **Interfaz moderna** con Mantine Components
- 📱 **Diseño responsive** adaptado a móviles y escritorio
- 🧪 **Tests unitarios** con Vitest y Testing Library
- 📚 **Documentación técnica** generada con TypeDoc
- 🐳 **Dockerización** completa del proyecto

---

## 🏆 API Utilizada

**API:** [Football-Data v4](https://www.football-data.org/)  
**Plan:** Free Tier  
**Autenticación:** API Key (X-Auth-Token header)

### Competiciones Disponibles (Free Plan)

| Código | Nombre                        | País/Continente |
|--------|-------------------------------|-----------------|
| WC     | FIFA World Cup                | Mundial         |
| CL     | UEFA Champions League         | Europa          |
| BL1    | Bundesliga                    | Alemania        |
| DED    | Eredivisie                    | Países Bajos    |
| BSA    | Campeonato Brasileiro Série A | Brasil          |
| PD     | Primera División              | España          |
| FL1    | Ligue 1                       | Francia         |
| ELC    | Championship                  | Inglaterra      |
| PPL    | Primeira Liga                 | Portugal        |
| EC     | European Championship         | Europa          |
| SA     | Serie A                       | Italia          |
| PL     | Premier League                | Inglaterra      |

### Límites del Plan Gratuito

- **10 requests/minuto**
- Acceso a las 12 competiciones listadas arriba
- Histórico completo de partidos y estadísticas

---

## 🛠️ Tecnologías y Dependencias

### Stack Principal

- **React 19.2.0** - Librería UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **React Router DOM 7.13.0** - Navegación SPA

### Gestión de Estado y Datos

- **@tanstack/react-query 5.90.21** - Gestión de estado asíncrono y caché
- **Axios 1.13.5** - Cliente HTTP
- **Zod 4.3.6** - Validación de schemas

### UI Components

- **@mantine/core 8.3.14** - Librería de componentes
- **@mantine/hooks 8.3.14** - Hooks de utilidades
- **@tabler/icons-react 3.36.1** - Iconos
- **@emotion/react 11.14.0** - CSS-in-JS

### Utilidades

- **date-fns 4.1.0** - Manejo de fechas

### Testing

- **Vitest** - Framework de testing
- **@testing-library/react** - Testing de componentes
- **@testing-library/jest-dom** - Matchers de DOM
- **@vitest/ui** - Interfaz visual de tests
- **msw** - Mock Service Worker para simular API

### Documentación

- **TypeDoc** - Generación de documentación técnica a partir de JSDoc

### DevTools

- **ESLint** - Linter
- **TypeScript ESLint** - Reglas TypeScript
- **@tanstack/react-query-devtools** - Debugging React Query

---

## 📦 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Cuenta en Football-Data.org** (gratuita) para obtener API Key

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ConnexioAPI_FootballData_AlexMartinez
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de Football-Data
VITE_FOOTBALL_API_KEY=tu_api_key_aqui

# URL base de la API (solo se usa en producción)
# En desarrollo se usa el proxy de Vite para evitar CORS
VITE_FOOTBALL_API_BASE_URL=https://api.football-data.org/v4
```

> 🔑 **Obtener API Key:** Regístrate en [Football-Data.org](https://www.football-data.org/client/register) y copia tu API key.

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### ⚠️ Nota importante (Desarrollo vs Build)

Actualmente la aplicación está preparada para funcionar correctamente en **modo desarrollo** usando el servidor de Vite (`npm run dev`) con el proxy que evita problemas de CORS y añade el header `X-Auth-Token` desde tu `.env` local. El `build` y `npm run preview` pueden presentar errores de CORS al consumir la API de Football-Data (por ejemplo: diferencias de origen que provoquen que el header `Access-Control-Allow-Origin` no coincida), por lo que **de momento no está garantizado que la versión de producción funcione sin un proxy o servidor intermedio que inyecte la API Key de forma segura**.

- Para desarrollo (recomendado para la demo): usa `npm run dev` y abre la URL que indique Vite (por defecto `http://localhost:5173`).
- No subas la variable `VITE_FOOTBALL_API_KEY` al repositorio; guárala en `.env`.
- Si necesitas desplegar en producción, lo recomendado es añadir un proxy/server (Express, serverless function o reverse-proxy) que gestione `X-Auth-Token` desde variables de entorno y evite exponer la API Key al cliente.


### Modo Producción

```bash
# Compilar el proyecto
npm run build

# Previsualizar build de producción
npm run preview
```

---

## 📜 Scripts Disponibles

| Script              | Descripción                                           |
|---------------------|-------------------------------------------------------|
| `npm run dev`       | Inicia servidor de desarrollo con hot reload          |
| `npm run build`     | Compila el proyecto para producción                   |
| `npm run preview`   | Previsualiza el build de producción                   |
| `npm run lint`      | Ejecuta ESLint para verificar código                  |
| `npm run test`      | Ejecuta tests en modo watch                           |
| `npm run test:ui`   | Abre interfaz visual de Vitest                        |
| `npm run test:run`  | Ejecuta tests una sola vez                            |
| `npm run test:coverage` | Genera reporte de cobertura de tests             |
| `npm run docs`      | Genera documentación técnica con TypeDoc              |
| `npm run docs:serve`| Genera docs y observa cambios                         |

---

## 📁 Estructura del Proyecto

```
ConnexioAPI_FootballData_AlexMartinez/
├── src/
│   ├── api/                    # Configuración Axios y servicios API
│   │   ├── axios.config.ts     # Cliente HTTP + interceptors
│   │   └── services/           # Servicios por recurso
│   │       ├── competitions.service.ts
│   │       ├── matches.service.ts
│   │       └── teams.service.ts
│   ├── components/             # Componentes React
│   │   ├── common/             # Componentes compartidos
│   │   ├── competitions/       # Componentes de competiciones
│   │   ├── layout/             # Layout y navegación
│   │   ├── matches/            # Componentes de partidos
│   │   └── teams/              # Componentes de equipos
│   ├── hooks/                  # Custom hooks React Query
│   │   ├── useCompetitions.ts
│   │   ├── useCompetitionDetail.ts
│   │   ├── useMatches.ts
│   │   └── useTeamDetail.ts
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Home.tsx
│   │   ├── Competitions.tsx
│   │   ├── CompetitionDetail.tsx
│   │   ├── TeamDetail.tsx
│   │   └── MatchDetail.tsx
│   ├── types/                  # Tipos TypeScript
│   │   └── football.types.ts
│   ├── constants/              # Constantes y configuración
│   │   └── competitions.ts
│   ├── test/                   # Tests y mocks
│   │   ├── setup.ts
│   │   └── mockData.ts
│   ├── App.tsx                 # Componente raíz
│   ├── main.tsx                # Entry point
│   └── index.css               # Estilos globales
├── coverage/                   # Reportes de cobertura de tests
├── docs/                       # Documentación generada (TypeDoc)
├── public/                     # Assets estáticos
├── .env                        # Variables de entorno (no versionado)
├── docker-compose.yml          # Configuración Docker Compose
├── Dockerfile                  # Imagen Docker
├── vite.config.ts              # Configuración Vite
├── vitest.config.ts            # Configuración Vitest
├── tsconfig.json               # Configuración TypeScript
├── typedoc.json                # Configuración TypeDoc
└── package.json                # Dependencias y scripts
```

---

## 🌐 Endpoints Consumidos

### Competiciones
- `GET /v4/competitions` - Lista todas las competiciones disponibles
- `GET /v4/competitions/{code}` - Detalle de una competición
- `GET /v4/competitions/{code}/standings` - Clasificación
- `GET /v4/competitions/{code}/matches` - Partidos (con filtros)
- `GET /v4/competitions/{code}/scorers` - Máximos goleadores
- `GET /v4/competitions/{code}/teams` - Equipos participantes

### Equipos
- `GET /v4/teams/{id}` - Información completa del equipo
- `GET /v4/teams/{id}/matches` - Partidos del equipo (con filtros)

### Partidos
- `GET /v4/matches` - Lista de partidos (con filtros)
- `GET /v4/matches/{id}` - Detalle completo de un partido
- `GET /v4/matches/{id}/head2head` - Enfrentamientos previos

### Headers Especiales Utilizados
- `X-Auth-Token` - Autenticación
- `X-Unfold-Lineups` - Desplegar alineaciones
- `X-Unfold-Goals` - Desplegar goles
- `X-Unfold-Bookings` - Desplegar tarjetas
- `X-Unfold-Subs` - Desplegar sustituciones

---

## 🎯 Funcionalidades Implementadas

### Página Home
- Muestra partidos del día actual de todas las competiciones
- Filtros por competición
- Scroll infinito o paginación

### Página Competiciones
- Lista las 12 competiciones disponibles
- Cards con emblema, nombre y tipo de competición
- Click en competición → navega al detalle

### Detalle de Competición
- **Tabs organizados:**
  - **Clasificación:** Tabla completa con forma reciente
  - **Partidos:** Próximos partidos programados
  - **Goleadores:** Top 10 scorers con estadísticas
  - **Equipos:** Grid de equipos participantes
- **Consume 5 endpoints diferentes**

### Detalle de Equipo
- Información general (estadio, fundación, colores)
- **Tabs:**
  - **Plantilla:** Tabla completa de jugadores con posiciones
  - **Entrenador:** Card con información del técnico
  - **Últimos partidos:** Últimos 5 resultados
  - **Próximos partidos:** Próximos 5 encuentros
- **Consume 3 endpoints diferentes**

### Detalle de Partido
- Header con equipos, escudos y resultado
- **Tabs condicionales (solo si hay datos):**
  - **Alineaciones:** Formación, titulares y suplentes
  - **Estadísticas:** Posesión, tiros, corners, etc. (barras comparativas)
  - **Cronología:** Timeline de goles, tarjetas y sustituciones
  - **H2H:** Historial de enfrentamientos directos
- Utiliza **headers X-Unfold-*** para obtener datos completos

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Modo watch (desarrollo)
npm run test

# Interfaz visual
npm run test:ui

# Ejecutar una vez (CI)
npm run test:run

# Con reporte de cobertura
npm run test:coverage
```

### Tests Implementados

- ✅ **Servicios API**: `competitions.service.test.ts`, `matches.service.test.ts`, `teams.service.test.ts`
- ✅ **Mocks de datos**: Datos de prueba en `mockData.ts`
- ✅ **Setup de tests**: Configuración global en `setup.ts`

**Reporte de cobertura** disponible en `coverage/index.html` tras ejecutar `npm run test:coverage`.

---

## 📚 Documentación Técnica

### Generar Documentación

```bash
npm run docs
```

La documentación estará disponible en `docs/index.html`.

### Características de la Documentación

- Generada con **TypeDoc**
- Incluye todos los módulos, clases, interfaces y funciones
- Comentarios JSDoc en:
  - Servicios API
  - Hooks personalizados
  - Componentes principales
  - Tipos e interfaces

---

## 🐳 Docker

### Ejecución con Docker Compose

```bash
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.

### Estructura Docker

- **Dockerfile**: Imagen multi-stage (build + serve)
- **docker-compose.yml**: Orquestación completa
- Variables de entorno inyectadas desde `.env`

---

## 🔧 Configuración de Vite

### Proxy para desarrollo (evitar CORS)

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.football-data.org/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Auth-Token', process.env.VITE_FOOTBALL_API_KEY);
          });
        },
      },
    },
  },
});
```

En desarrollo, las peticiones a `/api/*` se redirigen automáticamente a la API real con el header de autenticación.

---

## 🤝 Contribuciones

Este proyecto es educativo y forma parte del módulo **PSP (Programación de Servicios y Procesos)** de 2º DAM.

---

## 📄 Licencia

Este proyecto utiliza la **API gratuita de Football-Data.org** bajo los términos de su licencia.

---

## 👨‍💻 Autor

**Alex Martinez Juan**  
- 💼 GitHub: [@alexMartJu](https://github.com/alexMartJu)

---

## 📞 Soporte

Para problemas con la API, consulta la [documentación oficial](https://www.football-data.org/documentation/quickstart).

---

**🎉 ¡Disfruta explorando el mundo del fútbol con datos en tiempo real!**
