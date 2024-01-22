ARG DOCKER_SRC=docker.io

FROM ${DOCKER_SRC}/node:20.7.0-slim AS builder

WORKDIR /app/car-service

COPY package.json package-lock.json ./
RUN \
  npm pkg delete scripts.prepare && \
  npm ci --only-production --no-audit --no-fund

COPY . .
RUN npm run build

FROM ${DOCKER_SRC}/node:20.7.0-slim AS runner
WORKDIR /app/car-service

ENV \
  TZ=Australia/Sydney \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV=production

COPY --from=builder --chown=node:node /app/car-service/package*.json ./
COPY --from=builder --chown=node:node /app/car-service/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/car-service/dist/ ./dist/

USER node

EXPOSE 3003
EXPOSE 3008

CMD ["npm", "run", "start"]
