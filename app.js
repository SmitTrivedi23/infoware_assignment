const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const mysql = require("mysql");

const app = express();
dotenv.config();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json());
const host = process.env.MY_SQL_HOST;
const user = process.env.MY_SQL_USER;
const pass = process.env.MY_SQL_PASSWORD;
const database = process.env.MY_SQL_DATABASE;

const db = mysql.createConnection({
  host: host,
  user: user,
  password: pass,
  database: database,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database.");
});

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /save_employees:
 *   post:
 *     summary: Create a new employee with contacts
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 hire_date:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 job_title:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       phone_number:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       relationship:
 *                          type: string
 *     responses:
 *       '201':
 *         description: Employee and contacts created successfully
 *       '500':
 *         description: Unable to create employee and contacts
 */
app.post("/save_employees", (req, res) => {
  const employeeData = req.body;

  if (!Array.isArray(employeeData)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing employee data array" });
  }

  const insertEmployeePromises = [];

  employeeData.forEach((employee) => {
    if (!Array.isArray(employee.contacts)) {
      return res
        .status(400)
        .json({ error: "Invalid or missing contacts array" });
    }

    const employeeInsertPromise = new Promise((resolve, reject) => {
      const {
        first_name,
        last_name,
        email,
        hire_date,
        salary,
        job_title,
        contacts,
      } = employee;

      const employeeDict = {
        first_name,
        last_name,
        email,
        hire_date,
        salary,
        job_title,
      };

      db.query("INSERT INTO employee SET ?", employeeDict, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        const employeeId = result.insertId;

        const contactInsertPromises = contacts.map((contact) => {
          return new Promise((resolve, reject) => {
            const contactData = {
              employee_id: employeeId,
              phone_number: contact.phone_number,
              address: contact.address,
            };

            db.query(
              "INSERT INTO contact_details SET ?",
              contactData,
              (err, result) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
        });

        Promise.all(contactInsertPromises)
          .then(() => {
            resolve(
              `Employee and contacts created successfully (Employee ID: ${employeeId})`
            );
          })
          .catch((error) => {
            reject(error);
          });
      });
    });

    insertEmployeePromises.push(employeeInsertPromise);
  });

  Promise.all(insertEmployeePromises)
    .then((results) => {
      res.status(201).json({
        message: "Employees and contacts created successfully",
        results,
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Unable to create employees and contacts", error });
    });
});

/**
 * @swagger
 * /fetch_employees:
 *   get:
 *     summary: List employees with pagination
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       '200':
 *         description: List of employee names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       '500':
 *         description: Unable to retrieve employees
 */
app.get("/fetch_employees", (req, res) => {
  const { page, pageSize } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limit = parseInt(pageSize) || 10;
  const offset = (pageNumber - 1) * limit;

  const query =
    "SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employee LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to retrieve employees" });
    } else {
      const employeeNames = results.map((row) => row.employee);
      res.status(200).json(employeeNames);
    }
  });
});

/**
 * @swagger
 * /update_employees/{id}:
 *   put:
 *     summary: Update an employee's details and contacts
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 hire_date:
 *                   type: string
 *                 salary:
 *                   type: number
 *                 job_title:
 *                   type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       phone_number:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       relationship:
 *                          type: string
 *     responses:
 *       '200':
 *         description: Employee and contact details updated successfully
 *       '500':
 *         description: Unable to update employee and contact details
 */
app.put("/update_employees/:id", (req, res) => {
  const employeeId = req.params.id;
  const {
    first_name,
    last_name,
    email,
    hire_date,
    salary,
    job_title,
    contacts,
  } = req.body;

  // Update the employee details in the 'employee' table
  const employeeData = {
    first_name,
    last_name,
    email,
    hire_date,
    salary,
    job_title,
  };

  db.query(
    "UPDATE employee SET ? WHERE id = ?",
    [employeeData, employeeId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Unable to update employee data" });
      }

      // Delete existing contact details for the employee
      db.query(
        "DELETE FROM contact_details WHERE employee_id = ?",
        employeeId,
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Unable to update contact details" });
          }
          console.log(contacts);

          // Insert new contact details for the employee
          const contactInsertPromises = contacts.map((contact) => {
            return new Promise((resolve, reject) => {
              const contactData = {
                employee_id: employeeId,
                phone_number: contact.phone_number,
                address: contact.address,
                city: contact.city,
                state: contact.state,
                relationship: contact.relationship,
              };

              db.query(
                "INSERT INTO contact_details SET ?",
                contactData,
                (err, result) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    resolve(result);
                  }
                }
              );
            });
          });

          Promise.all(contactInsertPromises)
            .then(() => {
              res.status(200).json({
                message: "Employee and contact details updated successfully",
              });
            })
            .catch((error) => {
              res
                .status(500)
                .json({ error: "Unable to update contact details" });
            });
        }
      );
    }
  );
});

/**
 * @swagger
 * /delete_employees:
 *   delete:
 *     summary: Delete one or more employees and their contact details
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         collectionFormat: multi
 *         required: true
 *         description: An array of employee IDs to delete
 *     responses:
 *       '200':
 *         description: Employees and contact details deleted successfully
 *       '500':
 *         description: Unable to delete employees and contact details
 */

app.delete("/delete_employees", (req, res) => {
  let ids;
  const newids = eval(req.query.ids);
  if (!Array.isArray(newids)) {
    ids = [newids];
  } else {
    ids = newids;
  }

  if (!ids) {
    return res
      .status(400)
      .json({ error: "Invalid or missing employee IDs array" });
  }

  // Convert the array elements to integers
  const employeeIdArray = ids.map((id) => parseInt(id, 10));

  // Delete the contact details for the specified employees
  db.query(
    "DELETE FROM contact_details WHERE employee_id IN (?)",
    [employeeIdArray],
    (err, contactResult) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Unable to delete contact details" });
      }

      // Delete the employees
      db.query(
        "DELETE FROM employee WHERE id IN (?)",
        [employeeIdArray],
        (err, employeeResult) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Unable to delete employees" });
          }

          res.status(200).json({
            message: "Employees and contact details deleted successfully",
          });
        }
      );
    }
  );
});

/**
 * @swagger
 * /get_employee:
 *   get:
 *     summary: Get employee details with contact information
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the employee to retrieve
 *     responses:
 *       '200':
 *         description: Employee details with contact information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     hire_date:
 *                       type: string
 *                     salary:
 *                       type: number
 *                     job_title:
 *                       type: string
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       employee_id:
 *                         type: integer
 *                       phone_number:
 *                         type: string
 *                       address:
 *                         type: string
 *       '400':
 *         description: Missing employee ID in query parameters
 *       '404':
 *         description: Employee not found
 *       '500':
 *         description: Unable to retrieve employee details or contact information
 */
app.get("/get_employee", (req, res) => {
  const employeeId = req.query.id;

  if (!employeeId) {
    return res
      .status(400)
      .json({ error: "Missing employee ID in query parameters" });
  }

  db.query(
    "SELECT * FROM employee WHERE id = ?",
    employeeId,
    (err, employeeResult) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Unable to retrieve employee details" });
      }

      if (employeeResult.length === 0) {
        return res.status(404).json({ error: "Employee not found" });
      }

      db.query(
        "SELECT * FROM contact_details WHERE employee_id = ?",
        employeeId,
        (err, contactResult) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Unable to retrieve contact details" });
          }

          const employeeWithContacts = {
            employee: employeeResult[0],
            contacts: contactResult,
          };

          res.status(200).json(employeeWithContacts);
        }
      );
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
