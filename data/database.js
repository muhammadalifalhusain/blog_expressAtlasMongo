const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let database;
async function connect() {
    const client = await MongoClient.connect('mongodb+srv://user1:Husain123@latihan1.4vpdp.mongodb.net/?retryWrites=true&w=majority&appName=latihan1');
    database = client.db('blog');
}

function getDb() {
    if (!database) {
        throw { message: 'database cnonection not establish' }
    }
    return database;
}
module.exports = {
    connectToDb: connect,
    getDb: getDb
}