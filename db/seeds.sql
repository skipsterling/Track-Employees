INSERT INTO department (department_name)
VALUES ("Engineering"),
("Finance"),
("Sales"),
("Legal");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 3),
        ("Salesperson", 80000, 3),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 1250000, 2),
       ("Legal Team Lead", 2500000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
        ("Mike", "Chan", 2, 1),
        ("Ashley", "Rodriguez", 3, null),
        ("Kevin", "Tupik", 4, 3),
        ("Kunal", "Singh", 5, null),
        ("Malia", "Brown", 6, 5),
        ("Sarah", "Lourd", 7, null),
        ("Tom", "Allen", 8, 7);