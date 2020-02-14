// required dependencies
var mysql = require("mysql");
var inquirer = req("inquirer");
var consoleTable = require("console.table");
var chalk = require("chalk");
var tracker = require("./Assets/tracker");
var queries = require("./Assets/query");

// Created connection info for the mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nikola4mysql2020",
    database: "employeeTracker_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    startTracker();
});