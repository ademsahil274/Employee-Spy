// Dependences
const mysql = require("mysql2");
const inquirer =  require("inquirer");
const cTable = require("console.table");
// const { response } = require("express");
// const connection = require("./db/db")

// connection to database
const connection = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    port: 3306,
    password: 'MyNewPass',
    database: "company_db",
});

connection.connect((err) => {
    if (err) throw err;
   console.log("connected as Id" + connection.threadId)
   
});

 startPrompt();
// initial prompts

function startPrompt() {
    const startList = [{
            type: "list",
            name: "action", // or "choice"
            message: "What would you like to do?",
            loop: false,
            choices: [
                      "View All Employees",
                      "Add Employee",
                      "Update Employee Role",
                      "View All Roles",
                      "Add Role",
                      "View All Departments",
                      "Add Department",
                      "Quit",
                    ]
        }]

        inquirer.prompt(startList)
        .then(response => {
            switch (response.action) {
                case "View All Employees":
                    viewAll("EMPLOYEE");
                break;

                case "Add Employee":
                    addEmployee();
                break;

                case "Update Employee Role":
                    updateEmployee();
                break;

                case "View All Roles":
                    viewAll("ROLE");
                break;

                case "Add Role":
                    addRole();
                break;

                case "View All Departments":
                    viewAll("DEPARTMENT");
                break;

                case "Add Department":
                    addDepartment();
                break;

               default:
                connection.end();
        }
    })
                .catch(err => {
                    console.error(err);
                });
}

    //function view all departments
    const viewAllDepartment = () => {

    }

    const viewAll = (table) => {
        let query;
        if (table === "DEPARTMENT") {
            query = `SELECT * FROM DEPARTMENT`;
        } else if (table === "ROLE") {
            query = `SELECT R.id AS id, title, salary, D.name AS department FROM ROLE AS R LEFT JOIN DEPARTMENT AS D
            ON R.department_id = D.id;`;
        } else {
            query = `SELECT E.id AS id, E.first_name AS first_name, E.last_name AS last_name, R.title AS role, D.name AS department, CONCAT(M.first_name, " ", M.last_name) AS manager
            FROM EMPLOYEE AS E LEFT JOIN ROLE AS R ON E.role_id = R.id
            LEFT JOIN DEPARTMENT AS D ON R.department_id = D.id
            LEFT JOIN EMPLOYEE AS M ON E.manager_id = M.id;`;
        }

        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
        
            startPrompt();
          });
    };
    //function update employee
    const updateEmployee = () => {
        connection.query("SELECT * FROM EMPLOYEE", (err, empRes) => {
            if (err) throw err;
            const employeeChoice = [];
            empRes.forEach(({ first_name, last_name, id }) => {
                employeeChoice.push({
                    name: first_name + " " + last_name,
                    value: id
                });
            });

    connection.query("SELECT * FROM ROLE", (err, roleRes) => {
        if(err) throw err;
        const roleChoice = [];
        roleRes.forEach(({ title, id }) => {
            roleChoice.push({
                name: title,
                value: id
            });
        });

        let questions = [
            {
                type: "list",
                name: "id",
                choices: employeeChoice,
                message: "Which employee's role do you want to update?"
            },
            {
                type: "list",
                name: "role_id",
                choices: roleChoice,
                message: "Which role do you want to assign the selected employee?"
            },
            
        ]

        inquirer.prompt(questions)
        .then(response => {
            const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?`;
            connection.query(query, [
                {role_id: response.role_id}, "id", response.id
            ], (err, res) => {
                if(err) throw err;

                console.log("Updated employee's role!"),
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    })
        });
    }
    
    //function add department
    const addDepartment = () => {
        let questions = [
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?"
            }
        ];

        inquirer.prompt(questions)
        .then(response => {
            const query = `INSERT INTO department (name) VALUES (?)`;
            connection.query(query, [response.name], (err, res) => {
                if (err) throw err;
                console.log(`Added ${response.name} to the database`);
                startPrompt();
            });
        })
        .catch(err => {
            console.error(err);
        });
    }
    //function add role
    const addRole = () => {
        const departments = [];
        connection.query("SELECT * FROM DEPARTMENT", (err, res) => {
            if (err) throw err;

            res.forEach(dep => {
                let depRole = {
                    name: dep.name,
                    value: dep.id
                }
                departments.push(depRole)
            });

            let questions = [
                {
                    type: "input",
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department",
                    choices: departments,
                    message: "Which department does the role belong to?"
                }
            ];

            inquirer.prompt(questions) 
            .then(response => {
                const query = `INSERT INTO ROLE (title, salary, department_id) VALUES(?)`;
                connection.query(query, [[response.title, response.salary, response.department]], (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${response.title} the the database`);
                    startPrompt();
                });
            })
            .catch(err => {
                console.log(err);
            });
        });
    }
    //function add employee
    const addEmployee = () => {
        connection.query("SELECT * FROM EMPLOYEE", (err, empRes) => {
            if (err) throw err;
            const employeeChoice = [
                {
                    name: 'none',
                    value: 0
                }
            ];
            empRes.forEach(({ first_name, last_name, id }) => {
                employeeChoice.push({
                    name: first_name + " " + last_name,
                    value: id
                });
            });

            connection.query("SELECT * FROM ROLE", (err, roleRes) => {
                if (err) throw err;
                const roleChoice = [];
                roleRes.forEach(({title, id}) => {
                    roleChoice.push({
                        name: title,
                        value: id
                    });
                });

            let questions = [
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "role_id",
                    choices: roleChoice,
                    message: "What is the employee's role?"
                },
                {
                    type: "list",
                    name: "manager_id",
                    choices: employeeChoice,
                    message: "Who is the employee's manager?"
                },
            ]

            inquirer.prompt(questions)
            .then(response => {
                const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
                let manager_id = response.manager_id !== 0? response.manager_id: null;
                connection.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${response.first_name} ${response.last_name} to the databse`);
                    startPrompt();
                });
            })
            .catch(err => {
                console.log(err);
            });

          })
        })
    };
