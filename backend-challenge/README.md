## Prerequisites

Please install following on local host machine

| Package                                                                      | Version |
| ---------------------------------------------------------------------------- | ------- |
| [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)                 | 0.39.7  |
| [node](#development-environment-setup)                                       | 20.11.1 |
| [mysql](https://dev.mysql.com/doc/refman/8.1/en/macos-installation-pkg.html) | 8.0.41  |
| [typeorm](https://www.npmjs.com/package/typeorm)                             | 0.3.21  |


## Project setup

```bash
$ npm install
```

#### Create database if not already

```sql
create database backend-challenge
```

#### Setup environment file

- Create environment file `.env`

## Configuration

Include '.env' file with following variables

| Variable             | Description                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| DB_HOST              | Optional (Defauls to localhost)                                                                     |
| DB_USER              | Required                                                                                            |
| DB_PASS              | Required                                                                                            |
| DB_PORT              | Optional (Defaults to 3306)                                                                         |
| DB_SYNC              | true                                                                                                |
| DB_NAME              | backend-challenge                                                                                   |


## Creating tables and Seeing Data Into Database

#### Run migration script

```sh
npm run typeorm:run-migrations
```

#### Run rollback script

```sh
npm run typeorm:revert-migrations
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

