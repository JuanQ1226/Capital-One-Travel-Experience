const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',  // Use 'localhost' or the IP of the Docker container
  database: 'CapitalOneTravel',
  password: 'secretpassword',
  port: 5431, 
});

client.connect()
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Connection error", err.stack));

// Use client.query or any other method to interact with the DB
module.exports = client;