#!/usr/bin/env node

const mysql = require('mysql');
const log = require('./log')(module);
const exportToCSV = require('./export').exportToCSV;

const config = parseConfig(process.env);
log.debug("Using config", config);
dowork(config);

function dowork(config) {
    log.info("Starting extracting data from database");

    const connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
    });
    connection.connect(function (err) {
        if (err) handleError(err, "Error connecting to database");
        log.info(`Connected to database ${config.mysql.database} as id ${connection.threadId}`);

        log.info("Selecting data");
        connection.query('SELECT * FROM mytable', function (err, res, fields) {
            if (err) handleError(err, "Error selecting data");

            log.debug("res", res);
            log.debug("fields", fields);
            if (res.length) {
                exportToCSV(res)
                    .then(function (filestr) {
                        log.info(`Exported ${res.length} entries to`, filestr);

                        log.info("Deleting exported rows");
                        const ids = res.map(r => r.id).join(', ');
                        connection.query(`DELETE FROM mytable WHERE id IN (${ids})`, function (err, res) {
                            if (err) handleError(err);

                            log.info("res", res);

                            log.info("Disconnecting from database");
                            connection.end(function (err) {
                                if (err) handleError(err, "Error disconnecting from database");
                                log.info("Disconnected from database");
                            });
                        });
                    })
                    .catch(function (err) {
                        handleError(err);
                    });
            } else {
                log.info("No entries availabe for export");
            }
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
