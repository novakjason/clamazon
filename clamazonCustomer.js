const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection');
const Table = require('cli-table');

connection.connect(function(err) {
    if (err) throw err;
    console.log('TEST TEST TEST');
    chooseDept();
});