require('dotenv').config();
const mongodb = require('mongodb').MongoClient;

const url = process.env.DB_URL;

const client = new mongodb(url);

async function connect() {
    try {
        await client.connect();
        console.log('Estamos Conectados.');
    } catch (err) {
        console.log('Não estamos conectados devido ao erro: ' + err);
    }
}

connect();

module.exports = client;