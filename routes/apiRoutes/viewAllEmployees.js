const fs = require("fs");
const inquirer = require("inquirer");
const { prompt } = require("../server");

function viewAllEmployees() {
  const sql = `SELECT 
    emp.id AS Employee_ID,
    emp.first_name AS First_Name,
    emp.last_name AS Last_Name,
    rl.title AS Job_Title,
    dep.name AS Department,
    rl.salary AS Salary,
    mgr.first_name AS Manager_First_Name,
    mgr.last_name AS Manager_Last_Name
    FROM employee emp
    LEFT JOIN employee mgr
    ON emp.manager_id = mgr.id
    JOIN role rl ON emp.role_id = rl.id
    JOIN department dep ON rl.department_id = dep.id`;
  connection.query(sql, function (err, res) {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}

module.exports = viewAllEmployees;
