FROM node:22-alpine as builder

ENV NODE_ENV build

RUN apk update && apk upgrade --no-cache
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run build \
    && npm prune --omit=dev

FROM node:22-alpine

ENV NODE_ENV production

RUN apk update && apk upgrade --no-cache
RUN apk add --no-cache \
    ca-certificates \
    && rm -rf /var/cache/apk/*

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]