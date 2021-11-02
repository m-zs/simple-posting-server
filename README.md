# Simple CRUD based on NestJS

http://simple-posting-app.herokuapp.com/

http://simple-posting-app.herokuapp.com/api

## TODO:
 - FE based on SSR next.js (only setup done)
 - e2e / integration tests
 - cache with redis or memory
 - more feats like following / likes?

## Stack
- nestJS and friends (ts, swagger, jest, etc)
- next.js for views
- postgres for storage (aws rdb)
- heroku for host (it uses HTTP 1.1, but its free :D)
- circleci for CI/CD

## Installation
1. Remember to use current nvm version
2. Run installation with:
```bash
$ npm install
```
3. If any [husky](https://www.npmjs.com/package/husky) related error occurs - try to install it globally with:
```bash
$ npm i husky -g
```

<br>

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<br>

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
