FROM node:24-alpine AS stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=stage /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --ommit=dev

expose 3000

CMD ["node", "dist/main.js"]