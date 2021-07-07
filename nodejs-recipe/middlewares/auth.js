const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/userModel");

exports.authToken = (req,res,next) => {
  let validToken = req.header("x-auth-token");
  //check if token is exsit, if not we send a message:
  if(!validToken){
    return res.status(401).json({msg:"You must send a token"});
  }
  try{
    //to code the token for find the id that in it:
    let decodeToken = jwt.verify(validToken, "yammisSecret");
    req.tokenData = decodeToken;
    //if everything is ok we move to the next function:
    next();
  }
  catch(err){
    console.log(err);
    return res.status(401).json({msg:"token invalid or expired"});
  }
}

