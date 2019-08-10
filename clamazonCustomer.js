//////////  node modules
const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection');


//////////  mysql connection function using connection.js file initiates when application loads
connection.connect((err) => {
    if (err) throw err;

    //////////  clamazon cli graphic
    console.log('\n ██████╗██╗      █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗\n' +
        '██╔════╝██║     ██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║\n' +
        '██║     ██║     ███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║\n' +
        '██║     ██║     ██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║\n' +
        '╚██████╗███████╗██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║\n' +
        ' ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝\n');

    //////////  initiating first user interface with clamazon
    chooseDept();
});


//////////  function asking user to select inventory by department
let chooseDept = () => {

    //////////  using inquirer to obtain user input
    inquirer
        .prompt({
            type: "list",
            name: "dept",
            message: "Select a department to view products.",
            default: "All",
            choices: [
                new inquirer.Separator(),
                "All",
                "Produce",
                "Bakery",
                "Dairy",
                new inquirer.Separator(),
                "Exit"
            ],
            pageSize: 7
        })
        .then((answer) => {

            //////////  using a switch statement to run a specific function based on user's selection
            switch (answer.dept) {
                case "All":
                    viewAll(answer);
                    break;
                case "Produce":
                    viewProduce(answer);
                    break;
                case "Bakery":
                    viewBakery(answer);
                    break;
                case "Dairy":
                    viewDairy(answer);
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}


//////////  navigation for the user between inventory views
let navigate = () => {
    inquirer
        .prompt({
            type: "list",
            name: "confirm",
            message: "\n\nPlease choose from the following options:     ",
            choices: [
                "Purchase inventory",
                new inquirer.Separator(),
                "Choose department",
                new inquirer.Separator(),
                "Exit\n"
            ],
            pageSize: 7,
            prefix: ""
        })
        .then((answer) => {

            switch (answer.confirm) {
                case "Purchase inventory":
                    purchase();
                    break;
                case "Choose department":
                    chooseDept();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}


//////////  using cli-table to create a pretty table to display product inventory
const table = new Table({
    head: ['ITEM ID', 'DEPARTMENT', 'PRODUCT NAME', 'PRICE/CASE', 'STOCK'],
    colWidths: [10, 20, 30, 15, 10]
});


//////////  function to fill the new table with data from mysql database
let newTable = (query, answer) => {

    //////////  Emptying table contents but keeping the header.
    table.length = 0;

    //////////  performing mysql query
    connection.query(query, [answer.dept], (err, res) => {

        //////////  displaying error if it exists
        if (err) throw err;

        //////////  for loop to push each row of data into cli table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].department_name, res[i].product_name, res[i].price, res[i].stock]
            );
        }
        //////////  displaying newly filled table in the cli
        console.log('\n' + table.toString() + '\n\n\n');
    });
}


//////////  function to view all inventory sorted by department
let viewAll = (answer) => {

    //////////  SQL SELECT command to query inventory data
    let query = "SELECT * FROM products ORDER BY department_name, item_id";

    newTable(query, answer);
    navigate();
}

let deptQuery = "SELECT * FROM products WHERE department_name = ?";

let viewProduce = (answer) => {
    let query = deptQuery;
    newTable(query, answer);
    navigate();
}


let viewBakery = (answer) => {
    let query = deptQuery;
    newTable(query, answer);
    navigate();
}


let viewDairy = (answer) => {
    let query = deptQuery;
    newTable(query, answer);
    navigate();
}

let purchase = () => {
    console.log("TESTING purchase();");
    navigate();
}