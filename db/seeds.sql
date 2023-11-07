INSERT INTO departments (id, department)
VALUES 
(1, "Sales"),
(2, "Engineering"),
(3, "Finance"),
(4, "Legal");

INSERT INTO roles (id, title, department_id, salary)
VALUES 
(1, "Sales Lead", 1, 100000),
(2, "Salesperson", 1, 80000),
(3, "Lead Engineer", 2, 150000),
(4, "Software Engineer", 2, 120000),
(5, "Account Manager", 3, 160000),
(6, "Accountant", 3, 125000),
(7, "Legal Team Lead", 4, 250000),
(8, "Lawyer", 4, 190000);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager)
VALUES 
("John","Doe",1,1,NULL),
("Mike","Chan",2,1,NULL),
("Ashley","Rodriguez",3,2,NULL),
("Kevin","Tupik",4,2,3),
("Kunal","Singh",5,3,NULL),
("Malia","Brown",6,3,5),
("Sarah","Lourd",7,4,NULL),
("Tom","Allen",8,4,7),
("Leah","Nelson",4,2,2);