//////////  node modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection');
const Table = require('cli-table');


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
const chooseDept = (auth, answer) => {

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

                case "exit":
                    connection.end();
                    break;
            }
        });
}