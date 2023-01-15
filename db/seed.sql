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
       ("Adem", "Sahil", "1", "1"),
       ("Frodo", "Baggins", "2", null),
       ("Samwise", "Gamgee", "2", "3"),
       ("Arwen", "Alf", "3", null),
       ("Harry", "Potter", "3", "5"),
       ("Virginia", "Filangee", "4", null),
       ("Ken", "Adams", "4", "7");

SELECT * FROM role;
SELECT * FROM employee;