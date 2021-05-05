<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center"><strong>POLARIS</strong></h3>
  <p align="center">
    <a href="https://github.com/SectorLabs/polaris">View Demo</a>
    <br />
</p>

<details open="open">
  <summary>Table of Contents</summary>

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Run](#run)
  - [Test](#test)
- [Development Guide](#development-guide)
- [Acknowledgements](#acknowledgements)

</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a monorepo for Polaris.

### Built With

- [Typescript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [Express](https://expressjs.com/)
- [Node](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)

<!-- DEVELOPMENT SETUP -->

## Development Setup

To get this project up and running locally, follow the steps below.

### Prerequisites

- [Node](https://gist.github.com/d2s/372b5943bce17b964a79)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
- [PostgreSQL](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)
- [KeyCloak](https://www.keycloak.org/docs/latest/server_installation/#installation)

### Setup

Clone the repo

```sh
git clone https://github.com/SectorLabs/polaris.git
```

Install dependencies

```sh
yarn install
```

Build Polaris Api

```sh
yarn api:build
```

Ask for the `.env` file from existing contributors and copy it to project root. Update postgreSQL, Prisma and Keycloak env variables accordingly.

### Run

Run Polaris Api

```sh
yarn api:start
```

Run Polaris Angular App

```sh
yarn angular:start
```

Polaris Api would be accessible at http://localhost:3000 and Polaris Angular at http://localhost:4200

### Test

Polaris Angular uses Jasmine and Karma for unit tests.

To run Polaris Api tests

```sh
yarn api:test
```

To run Polaris Angular App tests

```sh
yarn angular:test
```

<!-- CONTRIBUTING -->

## Development Guide

Read through the [development](docs/development.md) guidelines and coding rules.

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/)
- [Karma](https://karma-runner.github.io/latest/index.html)
- [Jasmine](https://jasmine.github.io/index.html)
