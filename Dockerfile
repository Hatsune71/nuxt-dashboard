FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./


ENV NUXT_PUBLIC_API_BASE_URL="https://api.aeraapps.my.id/api/v1"
ENV NUXT_AUTH_SECRET="secret_key_yang_sangat_aman_dan_panjang"
ENV AUTH_TRUST_HOST="true"
ENV AUTH_ORIGIN="http://localhost/api/auth"
ENV API_KEY="super-secret-gez-studio-up-2354132352523w5!!!!@@@$!@^&^^%^^^-API"
ENV NITRO_PORT=3001

CMD ["node", ".output/server/index.mjs"]