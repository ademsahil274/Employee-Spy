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
                    //   "View Employee By Manager",
                    //   "Update Manager",
                    //   "Delete a Department",
                    //   "Delete a Role",
                    //   "Delete an Employee",
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

                // case "View Employees By Manager":
                //     viewEmployeeByMAnager();
                // break;

                // case "Update Employee's Manager":
                //     updateManager();
                // break;

                // case "Delete Department":
                //     deleteDepartment();
                // break;

                // case "Delete Role":
                //     deleteRole();
                // break;

                // case "Delete Employee":
                //     deleteEmployee();
                // break;
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
     

    
// function viewAllEmployees() {
//     // "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;"
//     //"SELECT * FROM employee"
//     connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
//     function(err, res) {
//       if (err) throw err
//       console.table(res)
//       startPrompt()
//   })
// }
// //============= View All Roles ==========================//
// function viewAllRoles() {
//   connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
//   function(err, res) {
//   if (err) throw err
//   console.table(res)
//   startPrompt()
//   })
// }
// //============= View All Employees By Departments ==========================//
// function viewAllDepartments() {
//   connection.query("SELECT department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
//   function(err, res) {
//     if (err) throw err
//     console.table(res)
//     startPrompt()
//   })
// }

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







//================= Select Role Quieries Role Title for Add Employee Prompt ===========//
// var roleArr = [];
// function selectRole() {
//   connection.query("SELECT * FROM role", function(err, res) {
//     if (err) throw err
//     for (var i = 0; i < res.length; i++) {
//       roleArr.push(res[i].title);
//     }

//   })
//   return roleArr;
// }
// //================= Select Role Quieries The Managers for Add Employee Prompt ===========//
// var managersArr = [];
// function selectManager() {
//   connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
//     if (err) throw err
//     for (var i = 0; i < res.length; i++) {
//       managersArr.push(res[i].first_name);
//     }

//   })
//   return managersArr;
// }
// //============= Add Employee ==========================//
// function addEmployee() { 
//     inquirer.prompt([
//         {
//           name: "firstname",
//           type: "input",
//           message: "Enter their first name "
//         },
//         {
//           name: "lastname",
//           type: "input",
//           message: "Enter their last name "
//         },
//         {
//           name: "role",
//           type: "list",
//           message: "What is their role? ",
//           choices: selectRole()
//         },
//         {
//             name: "choice",
//             type: "rawlist",
//             message: "Whats their managers name?",
//             choices: selectManager()
//         }
//     ]).then(function (val) {
//       var roleId = selectRole().indexOf(val.role) + 1
//       var managerId = selectManager().indexOf(val.choice) + 1
//       connection.query("INSERT INTO employee SET ?", 
//       {
//           first_name: val.firstName,
//           last_name: val.lastName,
//           manager_id: managerId,
//           role_id: roleId
          
//       }, function(err){
//           if (err) throw err
//           console.table(val)
//           startPrompt()
//       })

//   })
// }
// //============= Update Employee ==========================//
//   function updateEmployee() {
//     connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
//     // console.log(res)
//      if (err) throw err
//      console.log(res)
//     inquirer.prompt([
//           {
//             name: "lastName",
//             type: "rawlist",
//             choices: function() {
//               var lastName = [];
//               for (var i = 0; i < res.length; i++) {
//                 lastName.push(res[i].last_name);
//               }
//               return lastName;
//             },
//             message: "What is the Employee's last name? ",
//           },
//           {
//             name: "role",
//             type: "rawlist",
//             message: "What is the Employees new title? ",
//             choices: selectRole()
//           },
//       ]).then(function(val) {
//         var roleId = selectRole().indexOf(val.role) + 1
//         connection.query("UPDATE employee SET WHERE ?", 
//         {
//           last_name: val.lastName
           
//         }, 
//         {
//           role_id: roleId
           
//         }, 
//         function(err){
//             if (err) throw err
//             console.table(val)
//             startPrompt()
//         })
  
//     });
//   });

//   }
// //============= Add Employee Role ==========================//
// function addRole() { 
//   connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
//     inquirer.prompt([
//         {
//           name: "Title",
//           type: "input",
//           message: "What is the roles Title?"
//         },
//         {
//           name: "Salary",
//           type: "input",
//           message: "What is the Salary?"

//         } 
//     ]).then(function(res) {
//         connection.query(
//             "INSERT INTO role SET ?",
//             {
//               title: res.Title,
//               salary: res.Salary,
//             },
//             function(err) {
//                 if (err) throw err
//                 console.table(res);
//                 startPrompt();
//             }
//         )

//     });
//   });
//   }
// //============= Add Department ==========================//
// function addDepartment() { 

//     inquirer.prompt([
//         {
//           name: "name",
//           type: "input",
//           message: "What Department would you like to add?"
//         }
//     ]).then(function(res) {
//         var query = connection.query(
//             "INSERT INTO department SET ? ",
//             {
//               name: res.name
            
//             },
//             function(err) {
//                 if (err) throw err
//                 console.table(res);
//                 startPrompt();
//             }
//         )
//     })
//   }