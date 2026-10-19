require('dotenv').config();

const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGODB_URI);

const database = client.db('my_social_media');

module.exports = { database }