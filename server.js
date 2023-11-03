//----Packages needed for this application----//
const express = require('express');
const inquirer = require('inquirer');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

//----Express middleware----//
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//----Async function to perform database queries----//
async function executeQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//----Async function for the Menu----//
async function mainMenu() {

  try {
    const action = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Welcome to your CMS. What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]  
  });

switch (action.action) {
  case 'View all departments':
      const departments = await executeQuery('SELECT * FROM departments;');
      console.log();
      console.table(departments);
      console.log();
  break;

  case 'View all roles':
      const roles = await executeQuery('SELECT roles.id AS role_id, title, salary, departments.department AS department FROM roles LEFT JOIN departments ON department_id = departments.id;');
      console.log();
      console.table(roles);
      console.log();
  break;

  case 'View all employees':
        const employees = await executeQuery('SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.title AS title, departments.department AS department, roles.salary, employees.manager AS manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id ORDER BY employee_id;');
        console.log();
        console.table(employees);
        console.log();
  break;

  case 'Add a department': 
      const newDeptResponse = await inquirer.prompt([
        {
          type: 'input',
          message: 'What is the name of the new department?',
          name: 'newDept'
        }
      ]);

      const { newDept } = newDeptResponse;
      await executeQuery(`INSERT INTO departments (department) VALUES ("${newDept}")`);

      console.log('\nDepartment added successfully!\n');
  break;

  case 'Add a role': 
    try {
      // Query the database to get department names and ids
        const departments = await executeQuery('SELECT id, department FROM departments;');
        const departmentChoices = departments.map(department => ({
          name: department.department,
          value: department.id
      }))

      const newRoleResponse = await inquirer.prompt([
        {
          type: 'input',
          message: 'What is the name of the new role?',
          name: 'newRole'
        },
        {
          type: 'input',
          message: 'What is the salary?',
          name: 'newSalary'
        },
        {
          type: 'list',
          message: 'What is the department?',
          name: 'newDepartmentId',
          choices: departmentChoices
        },
      ]);

      const { newRole, newSalary, newDepartmentId } = newRoleResponse;
      await executeQuery(`INSERT INTO roles (title, department_id, salary) VALUES ("${newRole}", ${newDepartmentId}, ${newSalary})`);

      console.log('\nNew role added successfully!\n');
    
    } catch (err) {
      console.error(err);
    }

  break;

  case 'Add an employee':
    try {
      // Query the database to get employee names and ids
        const employees = await executeQuery('SELECT id, first_name FROM employees;');
        const managerChoices = employees.map(employee => ({
          name: employee.first_name,
          value: employee.id
      }))

      const roles = await executeQuery('SELECT id, title FROM roles;');
        const roleChoices = roles.map(role => ({
          name: role.title,
          value: role.id
      }))

      const newEmployeeResponse = await inquirer.prompt([
        {
          type: 'input',
          message: 'What is the first name of the new employee?',
          name: 'newFirstName'
        },
        {
          type: 'input',
          message: 'What is the last name of the new employee?',
          name: 'newLastName'
        },
        {
          type: 'list',
          message: 'What is the role?',
          name: 'newRole',
          choices: roleChoices
        },
        {
          type: 'list',
          message: 'Who is the manager?',
          name: 'newManager',
          choices: managerChoices
        },
      ]);

      const { newFirstName, newLastName, newRole, newManager } = newEmployeeResponse;
      await executeQuery(`INSERT INTO employees (first_name, last_name, manager, role_id) VALUES ("${newFirstName}", "${newLastName}", ${newManager}, "${newRole}")`);

      console.log('\nNew employee added successfully!\n');
    
    } catch (err) {
      console.error(err);
    }

  break;

  case 'Update an employee role':

    try {

      const employees = await executeQuery('SELECT id, first_name FROM employees;');
      const employeeChoices = employees.map(employee => ({
        name: employee.first_name,
        value: employee.id
    }))

      const roles = await executeQuery('SELECT id, title FROM roles;');
        const roleChoices = roles.map(role => ({
          name: role.title,
          value: role.id
      }))

      const updateEmployeeResponse = await inquirer.prompt([
        {
          type: 'list',
          message: 'What is the first name of the employee to update?',
          name: 'updateEmployee',
          choices: employeeChoices
        },
        {
          type: 'list',
          message: 'What is their new role?',
          name: 'newRole',
          choices: roleChoices
        }
      ]);

      const { updateEmployee , newRole } = updateEmployeeResponse;
      await executeQuery(`UPDATE employees SET role_id = ${newRole} WHERE id = ${updateEmployee}`);

      console.log('\nEmployee role updated successfully!\n');
    
    } catch (err) {
      console.error(err);
    }

  break;

  default: 
    console.log('Invalid choice');
}

  const { continueAction } = await inquirer.prompt({
    type: 'confirm',
    name: 'continueAction',
    message: 'Do you want to perform another action?',
    default: true,
  });

  if (continueAction) {
    await mainMenu(); // Recursive call to mainMenu
  } else {
    console.log('Goodbye!');
    db.end(); // Close the database connection when the user chooses to exit
  }
} catch (err) {
  console.error(err);
}
};

mainMenu();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});