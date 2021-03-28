const fs = require("fs");
const inquirer = require("inquirer");
const {
  viewAllEmployees,
  addEmployee,
  updateEmployee,
  viewAllDepartments,
  addDepartment,
  viewAllRoles,
  addRole,
  connectionEnd,
} = require("../server");

// const promptManager = () => {
//     inquirer
//       .prompt([
//         {
//           type: "text",
//           name: "name",
//           message: "Please enter the Team Manager's Name.",
//           validate: (nameInput) => {
//             if (nameInput) {
//               return true;
//             } else {
//               console.log("Please enter the Manager's name!");
//               return false;
//             }
//           },
//         },
//         {
//           type: "text",
//           name: "id",
//           message: "Please enter the Team Manager's Employee ID.",
//           validate: (idInput) => {
//             if (idInput) {
//               return true;
//             } else {
//               console.log("Please enter an ID!");
//               return false;
//             }
//           },
//         },
//         {
//           type: "text",
//           name: "email",
//           message: "Please enter the Team Manager's Email Address.",
//           validate: (emailInput) => {
//             if (emailInput) {
//               return true;
//             } else {
//               console.log("Please enter an email address!");
//               return false;
//             }
//           },
//         },
//         {
//           type: "text",
//           name: "officeNumber",
//           message: "Please enter the Team Manager's Office Number",
//           validate: (officeInput) => {
//             if (officeInput) {
//               return true;
//             } else {
//               console.log("Please enter the office number!");
//               return false;
//             }
//           },
//         },
//       ])
//       .then((responses) => {
//         const manager = new Manager(
//           responses.name,
//           Manager.prototype.getRole(),
//           responses.id,
//           responses.email,
//           responses.officeNumber
//         );
//         employeeData.push(manager);
//         promptNextEmployee();
//       });
//   };

const prompt = () => {
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
    .then(({ selection }) => {
      if (selection === "View All Employees") {
        return viewAllEmployees();
      } else if (selection === "View All Departments") {
        return viewAllDepartments();
      } else if (selection === "View All Roles") {
        return viewAllRoles();
      } else if (selection === "Add Employee") {
        return addEmployee();
      } else if (selection === "Add a Department") {
        return addDepartment();
      } else if (selection === "Add a New Role") {
        return addRole();
      } else if (selection === "Update Employee Role") {
        return updateEmployee();
      } else if (selection === "Quit") {
        return connectionEnd();
      }
    });
};

//   const promptEngineer = () => {
//     inquirer
//       .prompt([
//         {
//           type: "text",
//           name: "name",
//           message: "Please enter the Engineer's Name.",
//         },
//         {
//           type: "text",
//           name: "id",
//           message: "Please enter the Engineers's Employee ID.",
//         },
//         {
//           type: "text",
//           name: "email",
//           message: "Please enter the Engineers's Email Address.",
//         },
//         {
//           type: "text",
//           name: "github",
//           message: "Please enter the Engineers's Github User Name.",
//         },
//       ])
//       .then((responses) => {
//         const engineer = new Engineer(
//           responses.name,
//           Engineer.prototype.getRole(),
//           responses.id,
//           responses.email,
//           responses.github
//         );
//         employeeData.push(engineer);
//         promptNextEmployee();
//       });
//   };

//   const promptIntern = () => {
//     inquirer
//       .prompt([
//         {
//           type: "text",
//           name: "name",
//           message: "Please enter the Intern's Name.",
//         },
//         {
//           type: "text",
//           name: "id",
//           message: "Please enter the Interns's Employee ID.",
//         },
//         {
//           type: "text",
//           name: "email",
//           message: "Please enter the Intern's Email Address.",
//         },
//         {
//           type: "text",
//           name: "school",
//           message: "Please enter the Intern's School",
//         },
//       ])
//       .then((responses) => {
//         const intern = new Intern(
//           responses.name,
//           Intern.prototype.getRole(),
//           responses.id,
//           responses.email,
//           responses.school
//         );
//         employeeData.push(intern);
//         promptNextEmployee();
//       });
//   };

module.exports = prompt;
