const connectDB = require("../config/dbconnection");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/Auth");
const { validationResult } = require('express-validator');
//const db = require('./database'); // Import your database connection module

// Controller function for user registration
const Register = async (req, res) => {
  // Validate the request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password,confirmPassword ,address, phoneNo,gender} = req.body;
  if (!username) {
    return res.json({ error: "Name is required" });
  } else if (!password || password.length <=6) {
    return res.json({
      error: "Password is required and should be 6 character long",
    });
  }
  else if (!confirmPassword || confirmPassword.length ==password) {
    return res.json({
      error: "Password is not same!",
    });
  }else if (!email) {
    return res.json({ error: "email is required" });
  }else if (!address) {
    return res.json({ error: "Address is required" });
  }else if (!phoneNo) {
    return res.json({ error: "phone Number is required" });
  }else if (!gender) {
    return res.json({ error: "gender is required" });}

  
    connectDB().query('select email from user where = ?',[email],(error,result)=>{
    if(error){
        console.log(error);
    }
    if (result.lenght>0){
        return res.json({ error: "Email is taken" });
    }
    if (password!= confirmPassword){
        return res.json({ error: "passwords are not same" });
    }
});


  // hashing the password
  const hashed = await hashPassword(password);

  db.query('INSERT INTO user SET ? ',{username:username, email:email, password:hashed,address:address,phoneNo:phoneNo,gender:gender},(result)=>{
    return res.json({"message":"User registered!" });
  })

 
};

const Login = async (req, res) => {
  // Validate the request data
  try {
    const { email, password } = req.body;

    connectDB.query=('select email from user where = ? AND password=?' ,[email,password],(error,result)=>{
       
       if(error){
        console.log(error);
        return res.json({ error: "Credentials are not correct" });
       }else {
       
        return res.json({"message":"ok" });
       }
        
    })
    let user = [email,password];

    // check password
    
    // create a signed 
    const token = jwt.sign({ email: email }, process.env.secrets_cy_of_tc, {
      expiresIn: "4d",
    });

 

    res.json({ user,token });
  } 
  catch (error) {
    console.log("failed error", error);
    res.status(500).json({ error: "Error, Try again" });
  }
};

module.exports = {
  Register,Login
};
