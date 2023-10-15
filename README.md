# Infoware Assignment
Employee API's with Reltaionship mapping using NodeJs

## Initialize Project
        git clone <project url>

### open terminal: To install all the dependencies run 
                npm install 

### Make changes in the env files with your data.

### Run the file to insert data in database
               node migration_dummy_employee_data.js

### Once data has been inserted run the following command
                npm start

### Execute the following query in MYSQL Workbench
 
                ALTER USER 'root'@'localhost' IDENTIFIED WITH
                mysql_native_password BY 'password';

Where root as your user localhost as your URL and password as your password

Then run this query to refresh privileges:

                flush privileges;





