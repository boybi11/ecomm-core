'use strict';
const pkg = require('./package.json')
require('dotenv').config()

const node_env = "";
const Settings = {
    "Author": pkg.author,
    "AppKey": process.env.APP_KEY,
    "ClientToken": process.env.API_CLIENT_TOKEN,
    "host": "localhost:5000",
    "URL": {
        "base": process.env[`${node_env}BASE_URL`],
        "site": process.env[`${node_env}SITE_URL`],
        "front": process.env[`${node_env}STORE_URL`],
    },
    "DB": {
        "host": process.env[`${node_env}DB_HOST`],
        "user": process.env[`${node_env}DB_USERNAME`],
        "password": process.env[`${node_env}DB_PASSWORD`],
        "database": process.env[`${node_env}DB_DATABASE`]
    }
};

module.exports = Settings;