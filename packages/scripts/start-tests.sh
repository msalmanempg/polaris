#!/bin/bash

cd "$(dirname "$0")"

echo "Setting up a test database for Polaris integration tests"

# On dev environment, get the TEST_DATABASE_URL from polaris-api .env
# On circleci build, it will be set in the environment

if ! [ -v TEST_DATABASE_URL ] ; then
  TEST_DATABASE_URL=$(grep TEST_DATABASE_URL ../../.envrc | cut -d '=' -f2)
fi

export DATABASE_URL=$TEST_DATABASE_URL

echo "Compiling database schema"
prisma-merge \
-b ../prisma/models/base.prisma \
-s ../prisma/models/**/*.prisma \
-o ../prisma/schema.prisma 

echo "Generating prisma client"
prisma generate --schema=../prisma/schema.prisma

echo "Migrating database"
prisma migrate reset --force --preview-feature --schema=../prisma/schema.prisma
