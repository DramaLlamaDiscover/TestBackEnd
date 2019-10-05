var express = require('express')
var mysql = require('mysql')
var cors = require('cors')
var app = express()

/*
 * Replaces all RDS Variables used previously. You will copy this verbatim as it works for
 * all NodeJS apps. This make break when run locally
*/
var vcap_services = JSON.parse(process.env.VCAP_SERVICES)

//creating connection object
var connection = mysql.createConnection({
  host     : vcap_services["p.mysql"][0].credentials.hostname,
  user     : vcap_services["p.mysql"][0].credentials.username,
  password : vcap_services["p.mysql"][0].credentials.password,
  port     : vcap_services["p.mysql"][0].credentials.port,
  database : vcap_services["p.mysql"][0].credentials.name,
  multipleStatements: true //used for running an sql file
});
var conn_succ = false; //checks connection status

//connect to db
connection.connect(function(err) {
  if (err) {
    conn_succ = false;
    console.log('Not Connected to database.');
    return;
  }
  conn_succ = true;
  console.log('Connected to database.');
});

module.exports = connection;
