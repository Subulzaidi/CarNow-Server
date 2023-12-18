const mysql = require("mysql");

const connectDB = async () => {
  try {
    await mysql.createConnection({
      host :'localhost',
      user:'subulraza',
      password:'123456',
      database:'carnow'
    }) 
    console.log("Mysql connection SUCCESS");
  } catch (error) {
    console.log(error);
    console.error("Mysql connection FAIL");
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);}``)
    process.exit(1);
  }
};
module.exports = connectDB;