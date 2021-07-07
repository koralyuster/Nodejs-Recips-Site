const express = require('express');
const { RecipeModel, validRecipe, getBizNumber } = require('../models/recipeModel');
const { authToken } = require('../middlewares/auth');

const router = express.Router();

router.get("/", async(req,res) => {
  try{
    let perPage = (req.query.perPage) ? Number(req.query.perPage) : 6;
    let page = (req.query.page) ? Number(req.query.page) : 0;
    //sort by the "_id":
    let sort = (req.query.sort) ? req.query.sort : "_id";
    //if reverse==yes so will show up from the bigger to the smaller and in not opposite:
    let reverse = (req.query.reverse == "yes") ? -1 : 1;
    let data = await RecipeModel.find({})
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse})
      res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
});

router.get("/single/:recipeId", async(req, res) => {
  try{
    let recipeId = req.params.recipeId;
    let recipe = await RecipeModel.findOne({_id: recipeId});
    res.json(recipe);
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
});

//total recipes
//return the amount of the recipes in the collection, (its for the pagenition):
router.get("/totalRecipes", async (req, res) => {
  try{
    let data = await RecipeModel.countDocuments({});
    res.json({count:data});
  }
  catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
});

router.get("/userRecipesAdded", authToken, async(req, res) =>{
  try{
    let perPage = (req.query.perPage) ? Number(req.query.perPage) : 5;
    let page = (req.query.page) ? Number(req.query.page) : 0;
    let sort = (req.query.sort) ? req.query.sort : "_id";
    let reverse = (req.query.reverse == "yes") ? -1 : 1;
    let data = await RecipeModel.find({user_id:req.tokenData._id})
      .limit(perPage)
      .skip(page * perPage)
      .sort({[sort]: reverse});
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

//add new recipe:
router.post("/", authToken, async(req,res) => {
  let validBody = validRecipe(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let recipe = new RecipeModel(req.body);
    recipe.user_id = req.tokenData._id;
    await recipe.save();
    res.status(201).json(recipe);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//Delete recipe:
router.delete("/:idDel", authToken, async(req, res) => {
  let idDel = req.params.idDel;
  try{
    //check the id=to the parameter i got from the url:
    let data = await RecipeModel.deleteOne({_id: idDel, user_id: req.tokenData._id});
    //id success we get: n=1;
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

//Edit recipe:
router.put("/:idEdit", authToken, async(req, res)=>{
  let idEdit = req.params.idEdit;
  let validBody = validRecipe(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    //can edit recipe that the user id = to the information of the id we got from the user TOKEN:
    let data = await RecipeModel.updateOne({_id: idEdit, user_id:req.tokenData._id}, req.body);
    //if success n=1
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});



module.exports = router;