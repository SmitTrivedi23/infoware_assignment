const mysql = require('mysql');
const dotenv = require("dotenv");
dotenv.config();


const host = process.env.MY_SQL_HOST 
const user = process.env.MY_SQL_USER
const pass = process.env.MY_SQL_PASSWORD
const database = process.env.MY_SQL_DATABASE

const db = mysql.createConnection({
  host: host,
  user: user,
  password: pass,
  database: database,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

const createTableEmployee = `
CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  hire_date DATE,
  salary DECIMAL(10, 2),
  job_title VARCHAR(50),
  PRIMARY KEY (id)
);
`;

const insertDummyDataEmployee = `
INSERT INTO employee (first_name, last_name, email, hire_date, salary, job_title) VALUES
    ('John', 'Doe', 'john.doe@example.com', '2022-01-15', 60000.00, 'HR'),
    ('Jane', 'Smith', 'jane.smith@example.com', '2021-08-20', 55000.00, 'Sales'),
    ('Robert', 'Johnson', 'robert.johnson@example.com', '2020-03-10', 70000.00, 'Engineering'),
    ('Sarah', 'Wilson', 'sarah.wilson@example.com', '2019-06-05', 75000.00, 'Marketing'),
    ('Michael', 'Brown', 'michael.brown@example.com', '2018-05-12', 65000.00, 'IT'),
    ('Emily', 'Davis', 'emily.davis@example.com', '2017-04-09', 60000.00, 'Sales'),
    ('William', 'Lee', 'william.lee@example.com', '2016-03-07', 72000.00, 'Engineering'),
    ('Olivia', 'Anderson', 'olivia.anderson@example.com', '2015-02-03', 73000.00, 'Marketing'),
    ('James', 'Garcia', 'james.garcia@example.com', '2014-01-01', 67000.00, 'IT'),
    ('Charlotte', 'Martinez', 'charlotte.martinez@example.com', '2013-12-29', 59000.00, 'HR'),
    ('Daniel', 'Hernandez', 'daniel.hernandez@example.com', '2012-11-25', 71000.00, 'Sales'),
    ('Sophia', 'Lopez', 'sophia.lopez@example.com', '2011-10-21', 73000.00, 'Engineering'),
    ('David', 'Taylor', 'david.taylor@example.com', '2010-09-17', 72000.00, 'Marketing'),
    ('Emma', 'Scott', 'emma.scott@example.com', '2009-08-13', 62000.00, 'IT'),
    ('Joseph', 'Green', 'joseph.green@example.com', '2008-07-09', 69000.00, 'HR'),
    ('Benjamin', 'Hall', 'benjamin.hall@example.com', '2007-06-05', 68000.00, 'Sales'),
    ('Mia', 'Adams', 'mia.adams@example.com', '2006-05-01', 70000.00, 'Engineering'),
    ('Elijah', 'Baker', 'elijah.baker@example.com', '2005-03-27', 71000.00, 'Marketing'),
    ('Evelyn', 'Rivera', 'evelyn.rivera@example.com', '2004-02-23', 59000.00, 'IT'),
    ('Alexander', 'Campbell', 'alexander.campbell@example.com', '2003-01-19', 67000.00, 'HR'),
    ('William', 'Mitchell', 'william.mitchell@example.com', '2002-12-15', 70000.00, 'Sales'),
    ('Sofia', 'Gonzalez', 'sofia.gonzalez@example.com', '2001-11-11', 71000.00, 'Engineering'),
    ('Mason', 'Walker', 'mason.walker@example.com', '2000-10-07', 68000.00, 'Marketing'),
    ('Harper', 'Perez', 'harper.perez@example.com', '1999-09-03', 66000.00, 'IT'),
    ('Evelyn', 'Morris', 'evelyn.morris@example.com', '1998-08-29', 75000.00, 'HR'),
    ('Logan', 'Hall', 'logan.hall@example.com', '1997-07-25', 70000.00, 'Sales'),
    ('Aria', 'Adams', 'aria.adams@example.com', '1996-06-21', 69000.00, 'Engineering'),
    ('Lucas', 'Flores', 'lucas.flores@example.com', '1995-05-17', 72000.00, 'Marketing'),
    ('Avery', 'Lopez', 'avery.lopez@example.com', '1994-04-13', 65000.00, 'IT'),
    ('Liam', 'Wright', 'liam.wright@example.com', '1993-03-09', 68000.00, 'HR');
`;

const createTablesContacts = `
CREATE TABLE contact_details (
  id INT AUTO_INCREMENT,
  employee_id INT,
  phone_number VARCHAR(15),
  address VARCHAR(100),
  city VARCHAR(20),
  state VARCHAR(10),
  relationship VARCHAR(10),
  PRIMARY KEY (id),
  FOREIGN KEY (employee_id) REFERENCES employee(id)
);
`;

const insertDummyDataContacts = `
INSERT INTO contact_details (employee_id, phone_number, address, city, state, relationship) VALUES
    (1, '555-123-4567', '123 Main St', 'Anytown', 'USA', 'Friend'),
    (2, '555-987-6543', '456 Elm St', 'Othertown', 'USA', 'Family'),
    (3, '555-555-5555', '789 Oak St', 'Anotherplace', 'USA', 'Colleague'),
    (4, '555-111-2222', '101 Pine St', 'Yetanotherplace', 'USA', 'Friend'),
    (5, '555-222-3333', '222 Elm St', 'Sometown', 'USA', 'Family'),
    (6, '555-777-8888', '987 Oak St', 'Yetanotherplace', 'USA', 'Colleague'),
    (7, '555-444-9999', '777 Maple St', 'Othertown', 'USA', 'Friend'),
    (8, '555-555-1234', '321 Pine St', 'Anytown', 'USA', 'Family'),
    (9, '555-321-9876', '555 Birch St', 'Anotherplace', 'USA', 'Colleague'),
    (10, '555-111-2222', '101 Cedar St', 'Sometown', 'USA', 'Friend'),
    (11, '555-777-9999', '789 Oak St', 'Yetanotherplace', 'USA', 'Family'),
    (12, '555-666-4444', '123 Birch St', 'Anytown', 'USA', 'Colleague'),
    (13, '555-333-8888', '456 Pine St', 'Othertown', 'USA', 'Friend'),
    (14, '555-777-5555', '555 Elm St', 'Sometown', 'USA', 'Family'),
    (15, '555-555-1111', '321 Oak St', 'Anotherplace', 'USA', 'Colleague'),
    (16, '555-222-8888', '987 Maple St', 'Yetanotherplace', 'USA', 'Friend'),
    (17, '555-666-5555', '777 Cedar St', 'Anytown', 'USA', 'Family'),
    (18, '555-555-5555', '111 Birch St', 'Othertown', 'USA', 'Colleague'),
    (19, '555-333-9999', '555 Oak St', 'Sometown', 'USA', 'Friend'),
    (20, '555-999-3333', '321 Elm St', 'Anotherplace', 'USA', 'Family'),
    (21, '555-777-1234', '987 Pine St', 'Yetanotherplace', 'USA', 'Colleague'),
    (22, '555-888-6666', '101 Cedar St', 'Anytown', 'USA', 'Friend'),
    (23, '555-444-2222', '555 Birch St', 'Othertown', 'USA', 'Family'),
    (24, '555-111-7777', '123 Oak St', 'Sometown', 'USA', 'Colleague'),
    (25, '555-666-8888', '456 Elm St', 'Anotherplace', 'USA', 'Friend'),
    (26, '555-333-5555', '555 Maple St', 'Yetanotherplace', 'USA', 'Family'),
    (27, '555-555-5555', '777 Cedar St', 'Anytown', 'USA', 'Colleague'),
    (28, '555-222-9999', '321 Pine St', 'Othertown', 'USA', 'Friend'),
    (29, '555-999-1111', '987 Birch St', 'Sometown', 'USA', 'Family'),
    (30, '555-777-6666', '111 Elm St', 'Anotherplace', 'USA', 'Colleague');
`;



db.query(createTableEmployee, (err) => {
  if (err) throw err;
  console.log('Tables created');

  db.query(insertDummyDataEmployee, (err) => {
    if (err) throw err;
    console.log('Dummy data inserted');
    db.end(); 
  });
});

db.query(createTablesContacts, (err) => {
  if (err) throw err;
  console.log('Tables created');

  db.query(insertDummyDataContacts, (err) => {
    if (err) throw err;
    console.log('Dummy data inserted');
    db.end(); 
  });
});
