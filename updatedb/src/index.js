#!/usr/bin/env node

const log = require('./log')(module);
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;

const args = parseArgs(process.argv.slice(2));
dowork(args);

async function dowork({ url }) {
    log.info("Starting putting data to mongo");


    const db = await mongo.connect(url);
    log.info("Connected to mongo");

    try {
        log.debug("hello");
    } finally {
        log.info("Disconnecting from mongo");
        db.close();
    }
}

function parseArgs(args) {
    return {
        url: args[0] || "mongodb://mongo:27017/poccron"
    };
}
