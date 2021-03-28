const mysql = require("mysql2");
const cTable = require("console.table");
const getData = require("./lib/getData");
const fs = require("fs");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your MySQL username
  user: "root",
  // Your MySQL password
  password: "",
  database: "employeeTracker_db",
});

connectionEnd = () => {
  console.log("Good Bye!");
  connection.end();
};

connection.connect((err) => {
  if (err) throw err;
  viewAllEmployees = () => {
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
      promptUser();
    });
  };

  viewAllDepartments = () => {
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    });
  };

  viewAllRoles = () => {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    });
  };

  addEmployee = () => {
    function createRoleList() {
      let rolesArr = [];
      let sql = `SELECT id, title FROM role`;

      connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          rolesArr.push(res[i].id + ": " + res[i].title);
        }
      });
      return [rolesArr];
    }

    function getManagerName() {
      let managersArr = [];
      let sql = `SELECT id, first_name, last_name FROM employee`;
      connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          managersArr.push(
            res[i].id + ": " + res[i].first_name + " " + res[i].last_name
          );
        }
      });
      return [managersArr];
    }

    let roleList = createRoleList();
    let managerList = getManagerName();

    inquirer
      .prompt([
        {
          type: "text",
          name: "firstName",
          message: "Please enter the employee's first name.",
          validate: (firstNameInput) => {
            if (firstNameInput) {
              return true;
            } else {
              console.log("Please enter first name!");
              return false;
            }
          },
        },
        {
          type: "text",
          name: "lastName",
          message: "Please enter the employee's last name.",
          validate: (lastNameInput) => {
            if (lastNameInput) {
              return true;
            } else {
              console.log("Please enter first name!");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "roleName",
          message: "Please select the employee's role.",
          choices: roleList[0],
        },
        {
          type: "list",
          name: "managerName",
          message: "Please select the employee's manager.",
          choices: managerList[0],
        },
      ])
      .then((selection) => {
        var FN = selection.firstName;
        var LN = selection.lastName;
        var RID = selection.roleName;
        var RoleIDArr = RID.split(":");
        var RoleID = RoleIDArr[0];
        var MN = selection.managerName;
        var MNArr = MN.split(" ");
        var MNID = MNArr[0].split(":");
        var ManagerID = MNID[0];

        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: FN,
            last_name: LN,
            role_id: RoleID,
            manager_id: ManagerID,
          },
          function (err, res) {
            if (err) throw err;
            console.log("New Employee " + FN + " " + LN + " has been added!");
          }
        );
        promptUser();
      });
  };

  addDepartment = () => {
    inquirer
      .prompt([
        {
          type: "text",
          name: "departmentName",
          message: "Please enter the new Department's Name",
          validate: (departmentNameInput) => {
            if (departmentNameInput) {
              return true;
            } else {
              console.log("Please enter a department name.");
              return false;
            }
          },
        },
      ])
      .then((selection) => {
        var DN = selection.departmentName;

        const query = connection.query(
          "INSERT INTO department SET ?",
          {
            name: DN,
          },
          function (err, res) {
            if (err) throw err;
            console.log("Your new department " + DN + " has been created!");
            promptUser();
          }
        );
      });
  };

  addRole = () => {
    function createDepartmentList() {
      let departmentsArr = [];
      let sql = `SELECT id, name FROM department`;
      connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          departmentsArr.push(res[i].id + ": " + res[i].name);
        }
      });
      return [departmentsArr];
    }

    let departmentList = createDepartmentList();

    inquirer
      .prompt([
        {
          type: "text",
          name: "roleName",
          message: "Please enter the new role.",
          validate: (roleInput) => {
            if (roleInput) {
              return true;
            } else {
              console.log("Please enter a new role.");
              return false;
            }
          },
        },
        {
          type: "number",
          name: "salaryNumber",
          message: "Please enter the salary for this role.",
          validate: (salaryInput) => {
            if (typeof salaryInput === "number") {
              return true;
            } else {
              console.log("Please enter a number.");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "departmentName",
          message: "Please select the department this role sits in.",
          choices: departmentList[0],
        },
      ])
      .then((selection) => {
        var RN = selection.roleName;
        var SN = selection.salaryNumber;
        var DN = selection.departmentName;
        var DNIDArr = DN.split(":");
        var DepartmentID = DNIDArr[0];
        const query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: RN,
            salary: SN,
            department_id: DepartmentID,
          },
          function (err, res) {
            if (err) throw err;
            console.log("Your new role " + RN + " has been created!");
            promptUser();
          }
        );
      });
  };

  updateEmployeeRole = () => {
    function createEmployeeList() {
      let employeesArr = [];
      let sql = `SELECT id, first_name, last_name FROM employee`;
      connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          employeesArr.push(
            res[i].id + ": " + res[i].first_name + " " + res[i].last_name
          );
        }
      });
      return [employeesArr];
    }

    function createRoleList() {
      let rolesArr = [];
      let sql = `SELECT id, title FROM role`;

      connection.query(sql, function (err, res, fields) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          rolesArr.push(res[i].id + ": " + res[i].title);
        }
      });
      return [rolesArr];
    }

    let EmployeeList = createEmployeeList();
    let RoleList = createRoleList();

    inquirer
      .prompt([
        {
          type: "text",
          name: "roleName",
          message:
            "Please have the employee and new role ready to input. Press enter to continue.",
        },
        {
          type: "list",
          name: "employeeName",
          message: "Please select the employee you would like to update.",
          choices: EmployeeList[0],
        },
        {
          type: "list",
          name: "newRoleName",
          message:
            "Please select the role you would like the employee to have now.",
          choices: RoleList[0],
        },
      ])
      .then((selection) => {
        let EN = selection.employeeName;
        let RL = selection.newRoleName;
        let ENIDArr = EN.split(":");
        let EmployeeID = ENIDArr[0];
        let EmployeeFullName = ENIDArr[1];
        let RLIDArr = RL.split(":");
        let RoleID = RLIDArr[0];
        let newRoleName = RLIDArr[1];

        const query = connection.query(
          "UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: RoleID,
            },
            {
              id: EmployeeID,
            },
          ],
          function (err, res) {
            if (err) throw err;
            console.log(
              EmployeeFullName + " role updated to: " + newRoleName + "."
            );
            promptUser();
          }
        );
      });
  };

  const promptUser = () => {
    inquirer
      .prompt({
        type: "list",
        name: "type",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Employee",
          "Add a Department",
          "Add a New Role",
          "Update Employee Role",
          "Quit",
        ],
      })
      .then((selection) => {
        if (selection.type === "View All Employees") {
          return viewAllEmployees();
        } else if (selection.type === "View All Departments") {
          return viewAllDepartments();
        } else if (selection.type === "View All Roles") {
          return viewAllRoles();
        } else if (selection.type === "Add Employee") {
          return addEmployee();
        } else if (selection.type === "Add a Department") {
          return addDepartment();
        } else if (selection.type === "Add a New Role") {
          return addRole();
        } else if (selection.type === "Update Employee Role") {
          return updateEmployeeRole();
        } else if (selection.type === "Quit") {
          return connectionEnd();
        }
      });
  };

  promptUser();
});
