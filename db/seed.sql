INSERT INTO department (name)
VALUES ("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", "150000", "1"),
       ("Software Engineer", "125000", "1"),
       ("Sales VP", "105000", "2"),
       ("Sales Rep", "75000", "2"),
       ("Account Manager", "175000", "3"),
       ("Accountant", "120000", "3"),
       ("Legal Team VP", "230000", "4"),
       ("Lawyer", "190000", "4");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gandalf", "White", "1", null),
       ("Adem", "Sahil", "2", "1"),
       ("Frodo", "Baggins", "3", null),
       ("Samwise", "Gamgee", "4", "3"),
       ("Arwen", "Alf", "5", null),
       ("Harry", "Potter", "6", "5"),
       ("Virginia", "Filangee", "7", null),
       ("Ken", "Adams", "8", "7");

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
