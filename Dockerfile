FROM node:15-alpine

ENV DATABASE_URL    $DATABASE_URL
ENV HOST    $HOST
ENV PORT    $PORT
ENV APP_SECRET  $APP_SECRET
ENV APP_ENABLE_COMPRESSION  $APP_ENABLE_COMPRESSION
ENV APP_ENVIRONMENT $APP_ENVIRONMENT
ENV KEYCLOAK_REALM  $KEYCLOAK_REALM
ENV KEYCLOAK_CLIENT_ID  $KEYCLOAK_CLIENT_ID
ENV KEYCLOAK_CLIENT_SECRET  $KEYCLOAK_CLIENT_SECRET
ENV KEYCLOAK_AUTH_SERVER_URL    $KEYCLOAK_AUTH_SERVER_URL

RUN apk --no-cache add curl

WORKDIR /usr/src

COPY packages ./packages
COPY package.json .

RUN yarn install --pure-lockfile --non-interactive; yarn global add prisma prisma-merge @angular/cli

RUN yarn db:setup

RUN yarn build:all

RUN yarn angular:build:prod

RUN mkdir static

ENTRYPOINT [ "node", "packages/polaris-api/dist/server.js" ]

EXPOSE 3000