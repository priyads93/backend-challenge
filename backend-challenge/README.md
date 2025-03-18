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

# test coverage
$ npm run test:cov
```

## API End Points

### Create a node with a specified parent

<domain -  defaults to localhost:3000>/nodes - POST Method for creating new nodes

#### Sample Input Body:

For root node:
```sh
{
    "name": "Alpha PC"    
}
```
For child nodes:
```sh
{
    "name": "Storage",
    "parent": "1"    
}
```

### Add a new property on a specific existing node

<domain -  defaults to localhost:3000>/properties - POST Method for adding a new property on the specified node

#### Sample Input Body:
```sh
{
    "name": "Capacity",
    "nodeId": 6,
    "value": 1024.00
}
```

### Return the subtree of nodes with their properties for a provided node path

<domain -  defaults to localhost:3000>/nodes?nodeId={} - GET Method for returning the subtree of nodes with their properties for a provided node Id (If node Id isn't added in query params, then all the nodes from DB will be returned)

#### Sample URL Link with query params:

```sh
localhost:3000/nodes?nodeId=2
```

