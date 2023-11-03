--VIEW ALL DEPARTMENTS
SELECT * FROM departments;

--VIEW ALL ROLES
SELECT roles.id AS role_id , title, salary, departments.department AS department
FROM roles
LEFT JOIN departments ON department_id = departments.id;

--VIEW ALL EMPLOYEES
SELECT employees.id AS employee_id, 
       employees.first_name, 
       employees.last_name, 
       roles.title AS title, 
       departments.department AS department, 
       roles.salary, 
       employees.manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY employee_id;

--ADD A DEPARTMENT
INSERT INTO departments (department) VALUES ("department");

--ADD A ROLE
INSERT INTO roles (title, department_id, salary) VALUES ("title", "department", "salary");

--ADD AN EMPLOYEE
INSERT INTO employees (first_name, last_name, manager, role_id) VALUES ("first_name", "last_name", "manager", "title");

--UPDATE AN EMPLOYEE
UPDATE employees
SET role_id = "New Role"
WHERE id = "Employee_ID";