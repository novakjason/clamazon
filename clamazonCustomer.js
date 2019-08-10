//////////  node modules
const Table = require('cli-table');
const mysql = require('mysql');
var inquirer = require('inquirer');
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
const chooseDept = () => {

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
        .then(function(answer) {

            //////////  using a switch statement to run a specific function based on user's selection
            switch (answer.dept) {
                case "All":
                    viewAll();
                    break;
                case "Produce":
                    viewProduce();
                    break;
                case "Bakery":
                    viewBakery();
                    break;
                case "Dairy":
                    viewDairy();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}


//////////  navigation for the user between inventory views
function navigate() {
    inquirer
        .prompt({
            type: "list",
            name: "confirm",
            message: "Please choose from the following options: \n",
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
        .then(function(answer) {

            switch (answer.confirm) {
                case "Purchase inventory":
                    // purchase();
                    console.log("TESTING purchase();");
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


//////////  function to view all inventory sorted by department
let viewAll = () => {

    //////////  Emptying table contents but keeping the header.
    table.length = 0;

    //////////  SQL SELECT command to query inventory data
    var query = "SELECT * FROM products ORDER BY department_name, item_id";

    //////////  performing mysql query
    connection.query(query, (err, res) => {

        //////////  for loop to push each row of data into cli table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].department_name, res[i].product_name, res[i].price, res[i].stock]
            );
        }
        //////////  displaying newly filled table in the cli
        console.log('\n' + table.toString() + '\n\n\n');
    });

    navigate();
}