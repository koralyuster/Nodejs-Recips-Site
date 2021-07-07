const express = require("express");
const {authToken} = require("../middlewares/auth");
const { validUser, UserModel, validLogin, getToken, validRecipesArray } = require("../models/userModel");
const { RecipeModel } = require("../models/recipeModel");
const bcrypt = require("bcrypt");
const {pick} = require("lodash");

const router = express.Router();

router.get("/",(req,res) => {
  res.json({msg:"USERS work- recipe project"})
})

//userInfo:
router.get("/userInfo", authToken, async (req, res) => {
  try{
    // console.log(req.tokenData);
    let data = await UserModel.findOne({_id:req.tokenData._id}, {password:0});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
})

//Add new user:
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    let user = new UserModel(req.body);
    //bcrypt the password:
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).json(pick(user,["name", "email", "_id", "country", "createdAt"]));
  }
  catch(err){
    console.log(err)
    res.status(400).json(err);
  }
});

//Login
router.post("/login", async(req, res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    //check if exist user with the email that sent
    let user = await UserModel.findOne({email:req.body.email});
    //if user not exsit we will ask to get message about it
    if(!user){
      return res.status(401).json({msg:"User not found, try again"});
    }
    //if user exsit we will continue and check the password:
    let validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
      return res.status(401).json({msg:"Password not match, try again"});
    }
    //call the token:
    let newToken = getToken(user._id);
    res.json({token:newToken});
  }
  catch(err){
    console.log(err)
    res.status(400).json(err);
  }
});

//check if the token is ok and return status ok
router.get("/authUser", authToken, async(req, res) => {
  res.json({status:"ok"});
});

//Favorite recipes: update the recipes users add them favorite:
router.patch("/recipes", authToken, async (req, res) => {
  let validBody = validRecipesArray(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.detalis)
  }
  try{
    let data = await UserModel.updateOne({_id:req.tokenData._id}, req.body);
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(400).json(err);
  }
});

//for we can see the details of the recipe we added and not just the number id of the recipe:
router.get("/userRecipes", authToken, async (req, res) => {
  try{
  let user = await UserModel.findOne({_id: req.tokenData._id});
  let recipes_ar = user.recipes;
  let userRecipes = await RecipeModel.find({_id: {$in:recipes_ar} });
  res.json(userRecipes);
  }
  catch(err){
    console.log(err)
    res.status(400).json(err);
  }
});

module.exports = router;