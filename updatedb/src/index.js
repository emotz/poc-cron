#!/usr/bin/env node

const mysql = require('mysql');
const log = require('./log')(module);

log.debug("process.env", process.env);
const config = parseConfig(process.env);
log.debug("Using config", config);
dowork(config);

function dowork(config) {
    log.info("Starting putting data to database");

    const connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password
    });
    connection.connect(function (err) {
        if (err) handleError(err, "Error connecting to database");
        log.info("Connected to database as id", connection.threadId);

        connection.query('CREATE DATABASE IF NOT EXISTS my_db', function (err) {
            if (err) handleError(err, "Error creating database");

            connection.changeUser({ database: config.mysql.database }, function (err) {
                if (err) handleError(err, "Couldn't change database for the connection");

                connection.query('CREATE TABLE IF NOT EXISTS mytable (id INT, name CHAR(100), title CHAR(50))', function (err) {
                    if (err) handleError(err, "Error creating table");

                    const entry = generateEntry();

                    connection.query('INSERT INTO mytable SET ?', entry, function (err, res, fields) {
                        if (err) handleError(err, "Error inserting data", entry);

                        log.debug("res", res);
                        log.debug("fields", fields);
                        log.info("Success! Inserted entry", entry);

                        log.info("Disconnecting from database");
                        connection.end(function (err) {
                            if (err) handleError(err, "Error disconnecting from database");
                            log.info("Disconnected from database");
                        });
                    });
                });
            });
        });

    });
}

function parseConfig(envArgs) {
    return {
        mysql: {
            user: envArgs.MYSQL_USER,
            password: envArgs.MYSQL_PASSWORD,
            host: envArgs.MYSQL_HOST,
            database: envArgs.MYSQL_DB
        }
    };
}

function handleError(error, msg) {
    msg = msg || "Error happened";
    log.error(msg, error);
    throw error;
}

function generateEntry() {
    return {
        name: "myname",
        title: "mytitle"
    };
}
