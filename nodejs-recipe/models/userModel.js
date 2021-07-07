const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  country: String,
  createdAt: {
    type: Date, default: Date.now()
  },
  //array for keep the favorites recipes of the user:
  recipes: Array
});

exports.UserModel = mongoose.model("users", userSchema);

//Create a token:
exports.getToken = (_userId) => {
  let token = jwt.sign({_id:_userId}, "yammisSecret",
  {expiresIn:"60mins"});
  return token;
}

//Validate Joi:
exports.validUser = (_dataBody) => {
  let joiSchema = Joi.object({
    name:Joi.string().min(2).max(99).required(),
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(2).max(99).required(),
    country:Joi.string().min(2).max(99).required()
  })

  return joiSchema.validate(_dataBody)
}

//Validlogin:
exports.validLogin = (_dataBody) => {
  let joiSchema = Joi.object({
    //only email and password for login:
    email:Joi.string().min(2).max(99).email().required(),
    password:Joi.string().min(2).max(99).required()
  })

  return joiSchema.validate(_dataBody)
}


//ValidRecipesArray: (array for the favorite recipes)
exports.validRecipesArray = (_dataBody) => {
  let joiSchema = Joi.object({
    recipes:Joi.array().min(0).required()
  })

  return joiSchema.validate(_dataBody)
}
