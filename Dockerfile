FROM node:20-alpine

WORKDIR /app

# Asegurar entorno de desarrollo (instalar devDependencies)
ENV NODE_ENV=development

# Copiar package.json y lockfile para instalación reproducible
COPY package*.json ./

RUN npm ci

# Copiar el resto del código (en dev se montará el volumen desde host)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
