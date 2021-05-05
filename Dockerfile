FROM node:15-alpine

ENV DATABASE_URL                postgresql://dev:zameen123@polaris-db.cutwsobzkxmi.eu-west-1.rds.amazonaws.com:5432/polaris
ENV HOST                        0.0.0.0
ENV PORT                        3000
ENV APP_SECRET                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
ENV APP_ENABLE_COMPRESSION      true
ENV APP_ENVIRONMENT             stage
ENV KEYCLOAK_REALM              polaris
ENV KEYCLOAK_CLIENT_ID          polaris-api
ENV KEYCLOAK_CLIENT_SECRET      5b8a031e-7b92-4bca-ba45-9d06176b2ec3
ENV KEYCLOAK_AUTH_SERVER_URL    http://polaris-keycloak-service.local:8080/auth

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