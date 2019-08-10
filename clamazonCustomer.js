//  node modules
const Table = require('cli-table');
const mysql = require('mysql');
const inquirer = require('inquirer');
const connection = require('./connection');


//  mysql connection function using connection.js file initiates when application loads
connection.connect(err => {
    if (err) throw err;

    //  clamazon cli graphic
    console.log(`


          ██████╗██╗      █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗
         ██╔════╝██║     ██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║
         ██║     ██║     ███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║
         ██║     ██║     ██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║
         ╚██████╗███████╗██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║
          ╚═════╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝
          
                 
          `);

    //  initiating first user interface with clamazon
    chooseDept();
});


//  function asking user to select inventory by department
let chooseDept = () => {

    //  using inquirer to obtain user input
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
        .then(answer => {

            //  using a switch statement to run a specific function based on user's selection
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
                    console.log(`
                    
                    
    Thank you for shopping at Clamazon!
                    
                    
                    `);
                    connection.end();
                    break;
            }
        });
}


//  navigation for the user between inventory views
let navigate = res => {
    inquirer
        .prompt({
            type: "list",
            name: "confirm",
            message: `Please choose from the following options:     `,
            choices: [
                new inquirer.Separator(),
                "Purchase inventory",
                "Choose new department",
                new inquirer.Separator(),
                "Exit"
            ],
            pageSize: 7
        })
        .then(answer => {

            switch (answer.confirm) {
                case "Purchase inventory":
                    //  calling the purchase function and passing through the mysql database query response
                    purchase(res);
                    break;
                case "Choose new department":
                    chooseDept();
                    break;
                case "Exit":
                    console.log("Thank you for shopping at Clamazon!")
                    connection.end();
                    break;
            }
        });
}


//  using cli-table to create a pretty table to display product inventory
const table = new Table({
    head: ['ITEM ID', 'DEPARTMENT', 'PRODUCT NAME', 'PRICE/CASE', 'STOCK'],
    colWidths: [10, 20, 30, 15, 10]
});


//  function to fill the new table with data from mysql database
let newTable = (query, answer, res) => {

    //  Emptying table contents but keeping the header.
    table.length = 0;

    //  performing mysql query
    connection.query(query, [answer.dept], (err, res) => {

        //  displaying error if it exists
        if (err) throw err;

        //  for loop to push each row of data into cli table
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].department_name, res[i].product_name, res[i].price, res[i].stock]
            );
        }
        //  displaying newly filled table in the cli
        console.log('\n' + table.toString() + '\n\n\n');

        //  calling the navigate function and passing through the mysql database query response
        navigate(res);
    });
}


//  function to view all inventory sorted by department
let viewAll = (answer, res) => {

    //  SQL SELECT command to query inventory data
    let query = "SELECT * FROM products ORDER BY department_name, item_id";

    //  newTable function eliminates redundancy in view functions
    newTable(query, answer, res);
}


//  one variable to hold mysql query parameters for searching a specific department
const deptQuery = "SELECT * FROM products WHERE department_name = ?";


//  function to view produce inventory
let viewProduce = (answer, res) => {
    let query = deptQuery;
    newTable(query, answer, res);
}


//  bakery
let viewBakery = (answer, res) => {
    let query = deptQuery;
    newTable(query, answer, res);
}


//  you get it yet?
let viewDairy = (answer, res) => {
    let query = deptQuery;
    newTable(query, answer, res);
}


//  function to purchase items from inventory using item_id and quanity of stock. passing in mysql query response
let purchase = res => {

    inquirer
    //  asking for ITEM ID
        .prompt({
            type: "input",
            name: "item",
            message: "Please enter ITEM ID."
        })
        .then(answer => {

            //  looping through mysql query response for user input validation
            for (var i = 0; i < res.length; i++) {

                //  validating user's input against each item_id in database
                if (answer.item == res[i].item_id) {

                    //  variable to hold user's input to pass into the next inquirer promise
                    let itemID = answer.item;

                    //  variable to hold subarray of user's input to pass into the next inquirer promise
                    let j = i;

                    //  asking user for the amount of stock they wish to purchase
                    inquirer
                        .prompt({
                            type: "input",
                            name: "quantity",
                            message: "Enter the amount you would like to purchase.",

                            //  validating user's input to make sure it is a number
                            validate: value => {
                                if (isNaN(value) == false) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }).then(answer => {

                            //  checking if there is sufficient stock available for user to purchase
                            if ((res[j].stock - answer.quantity) >= 0) {

                                //  updating the mysql clamazonDB database with the new stock quantity if purchase was successful
                                connection.query("UPDATE products SET stock='" + (res[j].stock - answer.quantity) + "' WHERE item_id='" + itemID + "'", (err, result) => {
                                    if (err) throw err;

                                    console.log(`


    Your purchase has been made.
    Cost: $${res[j].price * answer.quantity}
                                    
                                                                                 
                                    `);

                                    //  restarting application if purchase was successful
                                    chooseDept();
                                })
                            } else {
                                console.log(`
                                
                                
    Insufficient stock available.  Please select a smaller quantity.
                            
                                
                                `);

                                //  restarting purchase function if stock is not available for user
                                purchase(res);
                            }
                        })
                }
            }
        });
}