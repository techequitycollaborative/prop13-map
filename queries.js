require('dotenv').config(); // Allows retriving variables from the .env file

//For Heroku postgres
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false }
});
client.connect();

async function testConnect(request, response) {
    response.status(200).json('Successfully connected to database');
}

async function fetchMarkers(request, response) {
    console.log('Request to fetch markers received');

    try{
        console.log('Succesfully connected')
        const rowList = await client.query("SELECT * FROM la_manual_est_table WHERE address != '' AND lat != '' AND long != ''");
        const results = { 'results': (rowList) ? rowList.rows : null};
        // console.log(results);
        response.status(200).send(results);
    } catch (error){
        response.status(400).json('SERVER RESP: Error retrieving userrecords. Log:'+error)
        console.log('Error retrieving userrecords. Log:')
        console.log(error);
    }
}

module.exports = {
    testConnect,
    fetchMarkers
}