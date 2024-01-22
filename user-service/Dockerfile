ARG DOCKER_SRC=docker.io

FROM ${DOCKER_SRC}/node:20.7.0-slim AS builder

WORKDIR /app/user-service

COPY package.json package-lock.json ./
RUN \
  npm pkg delete scripts.prepare && \
  npm ci --only-production --no-audit --no-fund

COPY . .
RUN npm run build

FROM ${DOCKER_SRC}/node:20.7.0-slim AS runner
WORKDIR /app/user-service

ENV \
  TZ=Australia/Sydney \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV=production

COPY --from=builder --chown=node:node /app/user-service/package*.json ./
COPY --from=builder --chown=node:node /app/user-service/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/user-service/dist/ ./dist/

USER node

EXPOSE 3004

CMD ["npm", "run", "start"]
