USE emptracker_db;

-- Insert into department table
INSERT INTO emptracker_db.department
    (name)
VALUES
    ("Technology"),
    ("Human Resources"),
    ("Sales/Marketing"),
    ("Accounting/Finance");

-- Insert into role table
INSERT INTO emptracker_db.role
    (title, salary, department_id)
VALUES
    ('Engineer', 90000, 1),
    ('HR Business Partner', 80000, 2),
    ('Sales Manager', 64990, 3),
    ('Accountant', 75000, 4);

-- Insert into employee table
INSERT INTO emptracker_db.employee
    (first_name, last_name, role_id)
VALUES
    ('Niko', 'Jovanovic', 1),
    ('Gene', 'Edwards', 2),
    ('Lusio', 'Filiba', 4),
    ('Lawrence', 'Kirk', 1),
    ('Marvin', 'Castro', 3),
    ('Siavash', 'Ashkiani', 1),
    ('Ranjan', 'Biswas', 4);

-- Add a manager to two employees
UPDATE emptracker_db.employee
SET manager_id = 7
WHERE (id = 1 OR id = 6)