class getData {
  constructor(firstName, lastName, roleID, managerID) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleID = roleID;
    this.managerID = managerID;
  }

  getFirstName(id) {
    connection.connect((err) => {
      if (err) throw err;
      const sql = `SELECT first_name FROM employee WHERE id = ?`;
      const params = id;
      connection.query(sql, params, function (err, res) {
        if (err) throw err;
        return res;
      });
    });
  }

  countRows(table) {
    connection.connect((err) => {
      if (err) throw err;
      const sql = `SELECT COUNT(*) FROM ?`;
      const param = table;
      connection.query(sql, param, function (err, res) {
        if (err) throw err;
        return res;
      });
    });
  }

  getRoleTitle(id) {
    connection.connect((err) => {
      if (err) throw err;
      const sql = `SELECT title FROM role WHERE id = ?`;
      const params = id;
      connection.query(sql, params, function (err, res) {
        if (err) throw err;
        return res;
      });
    });
  }

  // getName() {
  //   return {
  //     name: this.name,
  //   };
  // }

  // getId() {
  //   return {
  //     id: this.id,
  //   };
  // }

  // getEmail() {
  //   return {
  //     email: this.email,
  //   };
  // }

  // getRole() {
  //   return "Employee";
  // }
}

module.exports = getData;
