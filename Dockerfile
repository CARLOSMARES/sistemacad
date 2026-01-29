# Etapa 1: Construcción (Builder)
# Nota: Usamos node:20 o 22 ya que la 24 aún no es LTS estable para todos los entornos
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

RUN npm i -g npm

# Instalamos todas las dependencias
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# Etapa 2: Producción (Runner)
FROM node:20-alpine AS production

WORKDIR /app

# IMPORTANTE: El nombre después de --from debe coincidir con el 'AS' de arriba
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Corrección de typo: es --omit (con una sola 'm')
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main.js"]
