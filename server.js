const inquirer = require('inquirer');
const mysql = require('mysql2');
const conTab = require('console.table');
require('dotenv').config();

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`You are now linked to the employee_db database.`)
);
function viewDepartments() {
  const sql = 'SELECT id, department_name AS department FROM department ORDER BY id;';
  db.query(sql, function (err, results) {
    console.table(results);
    companyList();
  });
}
function viewRoles() {
  const sql =
    'SELECT employee_role.id AS id, employee_role.title AS title, department.department_name AS department, employee_role.salary AS salary FROM employee_role JOIN department ON employee_role.department_id = department.id ORDER BY employee_role.id;';
  db.query(sql, function (err, results) {
    console.table(results);
    companyList();
  });
}
function viewEmployees() {
  const sql =
    'SELECT employee1.id AS id, employee1.first_name AS first_name, employee1.last_name AS last_name, employee_role.title AS title, department.department_name AS department, employee_role.salary AS salary, concat(employee2.first_name, " ", employee2.last_name) AS manager FROM employee employee1 JOIN employee_role ON employee1.role_id = employee_role.id JOIN department ON employee_role.department_id = department.id LEFT JOIN employee employee2 ON employee1.manager_id = employee2.id ORDER BY employee1.id;';
  db.query(sql, function (err, results) {
    console.table(results);
    companyList();
  });
}
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'department',
      message: 'What is the name of the department',
    })
    .then((data) => {
      const sql = `INSERT INTO department(department_name) VALUES (?)`;
      const param = [data.department];
      console.log(param);
      db.query(sql, param, (err, results) => {
        if (err) {
          throw err;
        }

        companyList();
      });
    });
}

function addRole() {
  var departmentOptions = [];
  db.query(`SELECT department_name FROM department;`, function (err, data) {
    if (err) throw err;
    for (var i = 0; i < data.length; i++) {
      departmentOptions.push(data[i].department_name);
    }
  });
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'role',
        message: 'What is the name of the role?',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this role?',
      },
      {
        type: 'list',
        name: 'deptOfRole',
        message: 'What department does the role belong to?',
        choices: departmentOptions,
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO employee_role(title, salary, department_id) VALUES (?, ?, ?)`;
      const dept = departmentOptions.indexOf(data.deptOfRole) + 1;
      console.log(dept);
      const param = [data.role, data.salary, dept];
      db.query(sql, param, (err, results) => {
        if (err) {
          throw err;
        }
        console.log(data.role + ' added to database');

        companyList();
      });
    });
}
function addEmployee() {
  var roleOptions = [];
  db.query(`SELECT title FROM employee_role;`, function (err, data) {
    if (err) throw err;
    for (var i = 0; i < data.length; i++) {
      roleOptions.push(data[i].title);
    }
  });
  var managerOptions = [];
  db.query(
    `SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;`,
    function (err, data) {
      if (err) throw err;
      for (var i = 0; i < data.length; i++) {
        managerOptions.push(data[i].name);
      }
    }
  );
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "What is the employee's last name?",
      },
      {
        type: 'list',
        name: 'employee_role',
        message: "What is the employee's role?",
        choices: roleOptions,
      },
      {
        type: 'list',
        name: 'employee_manager',
        message: "Who is the employee's manager?",
        choices: managerOptions,
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      const role = roleOptions.indexOf(data.employee_role) + 1;
      const manager = managerOptions.indexOf(data.employee_manager) + 1;
      const param = [data.first_name, data.last_name, role, manager];
      db.query(sql, param, (err, results) => {
        if (err) {
          throw err;
        }
        console.log(
          data.first_name + ' ' + data.last_name + ' added to database'
        );

        companyList();
      });
    });
}
function updateEmployee() {
  var employee_options = [];
  var role_options = [];
  db.promise()
    .query(`SELECT CONCAT(first_name, " ", last_name) AS name FROM employee;`)
    .then(function ([employees]) {
      for (var i = 0; i < employees.length; i++) {
        employee_options.push(employees[i].name);
      }
      return db.promise().query(`SELECT title FROM employee_role;`);
    })
    .then(function ([roles]) {
      for (var i = 0; i < roles.length; i++) {
        role_options.push(roles[i].title);
      }
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_update',
            message: 'Which employees role do you want to update?',
            choices: employee_options,
          },
          {
            type: 'list',
            name: 'employee_role',
            message: 'Which role do you want to assign the selected employee?',
            choices: role_options,
          },
        ])
        .then((data) => {
          const sql = `UPDATE employee SET role_id = (?) WHERE id = (?);`;
          const emp = employee_options.indexOf(data.employee_update) + 1;
          const roleOpt = role_options.indexOf(data.employee_role) + 1;
          const param = [roleOpt, emp];

          db.promise()
            .query(sql, param)
            .then(
              console.log(
                data.employee_update + ' role has been changed to ' + data.employee_role
              )
            );

          companyList();
        });
    });
}

var companyList = () => {
  inquirer
    .prompt({
      type: 'list',
      name: 'company_list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update employee role',
        'Quit',
      ],
    })
    .then((data) => {
      switch (data.company_list) {
        case 'View all departments':
          return viewDepartments();
        case 'View all roles':
          return viewRoles();
        case 'View all employees':
          return viewEmployees();
        case 'Add a department':
          return addDepartment();
        case 'Add a role':
          return addRole();
        case 'Add an employee':
          return addEmployee();
        case 'Update employee role':
          return updateEmployee();
        case 'Quit':
          return console.log('Bye');
      }
    });
};

companyList();
