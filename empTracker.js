// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
const chalk = require("chalk");
const trackerOptions = require("./assets/trackerOptions");
var queries = require("./assets/queries");

//Gets rid of the too many listeners warning
require("events").EventEmitter.defaultMaxListeners = 300;

//Create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "nikola4mysql2020",
    database: "empTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    startTracker();
});

// function which initiates the actions within the employee tracker
startTracker = () => {
    inquirer
        .prompt({
            name: "trackerList",
            type: "list",
            message: "Please choose an action to get started:",
            choices: trackerOptions
        })
        .then(function(trackerChoice) {
            //Perform action based on user choice
            trackerAction(trackerChoice);
        });
};

// Using a function to store the if/else statement for the user choice
trackerAction = choice => {
    if (choice.trackerList === "View all departments") {
        viewAllDepartments();
    } else if (choice.trackerList === "View all roles") {
        viewAllRoles();
    } else if (choice.trackerList === "View all employees") {
        viewAllEmployees();
    } else if (choice.trackerList === "Add a department") {
        addDepartment();
    } else if (choice.trackerList === "Add a role") {
        addRole();
    } else if (choice.trackerList === "Add an employee") {
        addEmployee();
    } else if (choice.trackerList === "Update an employee role") {
        updateEmpRole();
    } else if (choice.trackerList === "Delete an employee") {
        deleteEmp();
    } else if (choice.trackerList === `I'm done`) {
        console.log(chalk.bgRed("Finish!"));
        connection.end();
    }
};

// Function to view all of the departments
viewAllDepartments = () => {
    connection.query(
        queries.selectAllDepts(), ["emptracker_db.department"],
        function(err, results) {
            if (results.length > 0) {
                if (err) throw err;
                console.log(chalk.blue(cTable.getTable("Departments View", results)));
                console.log("-----------------------------");
            } else {
                console.log(
                    chalk.redBright(
                        "There are no departments in the database. Please add a department."
                    )
                );
            }
            startTracker();
        }
    );
};

// Function to view all of the roles
viewAllRoles = () => {
    connection.query(
        queries.selectAllRoles(), [
            "id",
            "title",
            "salary",
            "name",
            "emptracker_db.role",
            "emptracker_db.department",
            "department_id",
            "id"
        ],
        function(err, results) {
            if (results.length > 0) {
                if (err) throw err;
                console.log(chalk.green(cTable.getTable("Roles View", results)));
                console.log("-----------------------------");
            } else {
                console.log(
                    chalk.redBright(
                        "There are no roles in the database. Please add a role."
                    )
                );
            }
            startTracker();
        }
    );
};

// Function to view all employees
viewAllEmployees = () => {
    connection.query(
        queries.selectAllEmployees(), [
            "id",
            "first_name",
            "last_name",
            "empName",
            "title",
            "name",
            "salary",
            "first_name",
            "last_name",
            "emptracker_db.employee",
            "emptracker_db.role",
            "role_id",
            "id",
            "emptracker_db.department",
            "department_id",
            "id",
            "emptracker_db.employee",
            "manager_id",
            "id"
        ],
        function(err, results) {
            if (results.length > 0) {
                if (err) throw err;
                console.log(
                    chalk.yellowBright(cTable.getTable("Employees View", results))
                );
                console.log("-----------------------------");
            } else {
                console.log(
                    chalk.redBright(
                        "There are no employees in the database. Please add an employee."
                    )
                );
            }

            startTracker();
        }
    );
};

// Function to add a department
addDepartment = () => {
    inquirer
        .prompt([{
            name: "dept",
            type: "input",
            message: "What is the Department name you would like to add?"
        }])
        .then(function(answer) {
            connection.query(queries.insertDepartment(answer.dept), function(err) {
                if (err) throw err;
                console.log(
                    chalk.greenBright(`${answer.dept} department added successfully!`)
                );
                console.log("-----------------------------");
                startTracker();
            });
        });
};

// Function to add a role
addRole = () => {
    // query the database for all departments
    connection.query(
        queries.selectAllDepts(), ["emptracker_db.department"],
        function(err, results) {
            inquirer
                .prompt([{
                        name: "title",
                        type: "input",
                        message: "Enter the title of the role:"
                    },
                    {
                        name: "salary",
                        type: "input",
                        message: "Enter the salary of the role:",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            console.log(chalk.magentaBright(" Please enter a number."));
                            return false;
                        }
                    },
                    {
                        name: "department",
                        type: "list",
                        message: "Please choose a department for the role:",
                        choices: function() {
                            var deptArray = [];
                            for (var i = 0; i < results.length; i++) {
                                deptArray.push(results[i].name);
                            }
                            return deptArray;
                        }
                    }
                ])
                .then(function(answer) {
                    connection.query(
                        queries.insertRole(answer.title, answer.salary, answer.department),
                        function(err) {
                            if (err) throw err;
                            console.log(
                                chalk.greenBright(`${answer.title} role added successfully!`)
                            );
                            console.log("-----------------------------");
                            startTracker();
                        }
                    );
                });
        }
    );
};

//Function to add employee
addEmployee = () => {
    // query the database for all roles
    connection.query(
        queries.selectAllRoles(), [
            "id",
            "title",
            "salary",
            "name",
            "emptracker_db.role",
            "emptracker_db.department",
            "department_id",
            "id"
        ],
        function(err, results) {
            inquirer
                .prompt([{
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's first name?"
                    },
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's last name?"
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employee's role",
                        choices: function() {
                            var rolesArray = [];
                            for (var i = 0; i < results.length; i++) {
                                rolesArray.push(results[i].title);
                            }
                            return rolesArray;
                        }
                    }
                ])
                .then(function(answer) {
                    connection.query(
                        queries.insertEmployee(
                            answer.firstName,
                            answer.lastName,
                            answer.role
                        ),
                        function(err) {
                            if (err) throw err;

                            console.log(
                                chalk.greenBright(
                                    `Employee ${answer.firstName} ${answer.lastName} added successfully!`
                                )
                            );
                            console.log("-----------------------------");
                            // addManager();
                            startTracker();
                        }
                    );
                });
        }
    );
};

// Function to view all of the roles
updateEmpRole = () => {
    connection.query(
        queries.selectAllEmployees(), [
            "id",
            "first_name",
            "last_name",
            "empName",
            "title",
            "name",
            "salary",
            "first_name",
            "last_name",
            "emptracker_db.employee",
            "emptracker_db.role",
            "role_id",
            "id",
            "emptracker_db.department",
            "department_id",
            "id",
            "emptracker_db.employee",
            "manager_id",
            "id"
        ],
        function(err, results) {
            inquirer
                .prompt([{
                    name: "emp",
                    type: "list",
                    message: "Which employee's role would you like to update?",
                    choices: function() {
                        var empArray = [];
                        for (var i = 0; i < results.length; i++) {
                            empArray.push(results[i].empName);
                        }
                        return empArray;
                    }
                }])
                .then(function(empNameAnswer) {
                    connection.query(
                        queries.selectAllRawRoles(), ["emptracker_db.role"],
                        function(err, results) {
                            inquirer
                                .prompt([{
                                    name: "role",
                                    type: "list",
                                    message: "What role would you like to give this employee?",
                                    choices: function() {
                                        var rolesArray = [];
                                        for (var i = 0; i < results.length; i++) {
                                            rolesArray.push(results[i].title);
                                        }
                                        return rolesArray;
                                    }
                                }])
                                .then(function(roleTitleAnswer) {
                                    connection.query(
                                        queries.updateEmpRole(
                                            roleTitleAnswer.role,
                                            empNameAnswer.emp
                                        ),
                                        function(err) {
                                            if (err) throw err;

                                            console.log(
                                                chalk.greenBright(
                                                    `${empNameAnswer.emp}'s role has been updated to ${roleTitleAnswer.role} successfully!`
                                                )
                                            );
                                            console.log("-----------------------------");
                                            startTracker();
                                        }
                                    );
                                });
                        }
                    );
                });
        }
    );
};

// Function to delete an employee
deleteEmp = () => {
    connection.query(
        queries.selectAllEmployees(), [
            "id",
            "first_name",
            "last_name",
            "empName",
            "title",
            "name",
            "salary",
            "first_name",
            "last_name",
            "emptracker_db.employee",
            "emptracker_db.role",
            "role_id",
            "id",
            "emptracker_db.department",
            "department_id",
            "id",
            "emptracker_db.employee",
            "manager_id",
            "id"
        ],
        function(err, results) {
            inquirer
                .prompt([{
                    name: "emp",
                    type: "list",
                    message: "Which employee record would you like to delete?",
                    choices: function() {
                        var empArray = [];
                        for (var i = 0; i < results.length; i++) {
                            empArray.push(results[i].empName);
                        }
                        return empArray;
                    }
                }])
                .then(function(empNameAnswer) {
                    connection.query(queries.deleteEmployee(empNameAnswer.emp), function(
                        err
                    ) {
                        if (err) throw err;

                        console.log(
                            chalk.greenBright(`${empNameAnswer.emp} has been deleted.`)
                        );
                        console.log("-----------------------------");
                        startTracker();
                    });
                });
        }
    );
};