# eCommerce REST API

[![Build Status](https://travis-ci.com/gboyegadada/ecommerce-api.svg?token=kWsW2pqG86CpBXZyuBHc&branch=master)](https://travis-ci.com/gboyegadada/ecommerce-api)

A REST API based on NodeJS, Express, MySQL, and Knex using JSON Web Tokens (JWT) for authentication.

# Project structure


## Architecture

This is an API first monolith app that uses a typical MVP flow. To improve performance I chose not use an ORM for the models but to use a query builder instead. Models are in `/repositories`, while Controllers are in `/controllers`. There are no views as they do not really apply here.

![](./dist/readme/express-rest-api.jpg)

## Technologies 

### Server 
- NodeJS + Express JS
- PM2 for process management and clusters
- MySQL for database
- Redis for caching and for rate limiter middleware
- `compression` node library for gzip compression
- `helmet` node library for header security
- Knex query builder

### Development
- Docker containers (app, redis and mysql) with Docker Compose
- Travis CI for integrated tests on pull requests
- Snyk for npm package vulnerability scans
- Mocha with Istanbul for testing and test coverage reporting
- Bash scripts for docker compose hooks (e.g. waiting for MySQL container before running the server)

