// Dependences
const mysql = require("mysql2");
const inquirer =  require("inquirer");
const cTable = require("console.table");
// const { response } = require("express");
// const connection = require("./db/db")

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
                console.log(`Successfully added ${response.name} department at id ${res.insertID}`);
            });
        })
        .catch(err => {
            console.error(err);
        });
    }

    const addRole = () => {
        const departments = [];
        connections.query("SELECT * FROM DEPARTMENT", (err, res) => {
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
                    type: "input",
                    name: "department",
                    message: "Which department does the role belong to?"
                }
            ];

            inquirer.promt(questions)
            .then(response => {
                const query = `INSERT INTO ROLE (title, salary, department_id) VALUES(?)`;
                connection.query(query, [[response.title, response.salary, response.department]], (err, res) => {
                    if (err) throw err;
                    console.log(`Succeefully added ${response.title} role at id ${res.insertId}`);
                });
            })
            .catch(err => {
                console.log(err);
            });
        });
    }

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

            connection.query("SELECT * FROM ROLE", (err, rolRes) => {
                if (err) throw err;
                const roleChoice = [];
                rolRes.forEach(({title, id}) => {
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
                connection.query(query, [[response.first_name, response.last_name, response.role_id, response.manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log(`Successfully added ${response.first_name} ${response.last_name} with id ${res.insertId}`);
                    startPrompt();
                });
            })
            .catch(err => {
                console.log(err);
            });

          })
        })
    };
