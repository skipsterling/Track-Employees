SELECT * FROM department;
SELECT employee_role.id AS id, employee_role.title AS title, department.department_name AS department, employee_role.salary AS salary FROM employee_role JOIN department ON employee_role.department_id = department.id;
SELECT employee1.id AS id, employee1.first_name AS first_name, employee1.last_name AS last_name, employee_role.title AS title, department.department_name AS department, employee_role.salary AS salary, concat(employee2.first_name, " ", employee2.last_name) AS manager FROM employee employee1 JOIN employee_role ON employee1.role_id = employee_role.id JOIN department ON employee_role.department_id = department.id LEFT JOIN employee employee2 ON employee1.manager_id = employee2.id;
SELECT SUM(employee_role.salary) AS utilized_budget, department.department_name AS department FROM employee_role JOIN department ON employee_role.department_id = department.id GROUP BY department_id

