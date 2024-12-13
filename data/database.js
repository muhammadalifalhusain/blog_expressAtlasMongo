const mongodb = require('mongodb');
const MongoCLient = mongodb.MongoClient;
let database;
async function connect() {
    const client = await MongoCLient.connect('mongodb+srv://user1:@FF8ifBAftQ-b9f@latihan1.4vpdp.mongodb.net/?retryWrites=true&w=majority&appName=latihan1');
    database = client.db('latihan1');

}

function getDb() {
    if (!database) {
        throw {
            message: 'database conection not estabilish'
        }
    }
    return database;
}

module.exports = {
    connectToDb: connect,
    getDb: getDb
}