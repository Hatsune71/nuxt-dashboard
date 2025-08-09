FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

# Copy hanya output yang diperlukan tanpa node_modules internal .output
COPY --from=builder /app/.output/server /app/.output/server
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]