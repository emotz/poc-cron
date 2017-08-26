const json2csv = require('json2csv');
const log = require('./log')(module);

const fse = require('fs-extra');
const path = require('path');
const EXPORT_PATH = path.resolve('./export');

async function exportToCSV(entries) {
    const csv = json2csv({ data: entries });
    const filestr = path.join(EXPORT_PATH, `export-${entries[entries.length - 1].id}.csv`);

    await ensureDirectoryExistence(filestr);
    log.debug("Writing csv to", filestr);
    await fse.writeFile(filestr, csv);

    return filestr;
}

async function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    let res = await fse.exists(dirname);
    if (res) {
        return true;
    }
    await ensureDirectoryExistence(dirname);
    return fse.mkdir(dirname);
}

module.exports.exportToCSV = exportToCSV;
