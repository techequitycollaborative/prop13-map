// Require the express module, built in bodyParser middlware, and set our app and port variables
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Allows retriving variables from the .env file

// Defined in .env file, defaults to 8000
const port = process.env.PORT || 8000;

// To get all the exported functions from queries.js, we'll 'require' the file and assign it to a variable.
const db = require('./queries.js')

// Use bodyParser to parse JSON
app.use(cors());
app.use(bodyParser.json())

app.get("/server/testConnect", db.testConnect)
app.get("/server/fetchMarkers", db.fetchMarkers)

// Tell a route making a GET request on the root (/) URL to head to the HomePage
app.get("/server/", (request, response) => {
    if (error) {
        throw error;
    }
    response.sendFile(__dirname + '/build/index.html');
})

// Static file declaration, which is the location of the React app
// Used in deployment by React app to access index.js
app.use(express.static(path.join(__dirname, '/frontend/build')));

// Put this last among all routes. Otherwise, it will return HTML to all fetch requests and trip up CORS. They interrupt each other
// For any request that doesn't match, this sends the index.html file from the client. This is used for all of our React code.
// Eliminates need to set redirect in package.json at start script with concurrently
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
})

/// Set the app to listen on the defined port
app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})
