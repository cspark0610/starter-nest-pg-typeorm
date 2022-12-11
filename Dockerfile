FROM node:16.15-alpine3.15 AS base

RUN apk --no-cache add dumb-init

RUN mkdir -p /home/node/app && chown node:node /home/node/app

WORKDIR /home/node/app

USER node

RUN mkdir tmp


FROM base AS dependencies

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --non-interactive

COPY --chown=node:node . .


FROM dependencies AS build

RUN yarn build


FROM base AS production

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --production

COPY --chown=node:node . .

COPY --chown=node:node --from=build /home/node/app/dist ./dist

CMD [ "dumb-init", "node", "dist/main" ]
