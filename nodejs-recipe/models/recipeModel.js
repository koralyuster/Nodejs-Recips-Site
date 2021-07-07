const mongoose = require("mongoose");
const Joi = require("joi");


const recipeSchema = new mongoose.Schema({
  recipeName: String,
  recipeTime: String,
  recipeType: String,
  recipeIngredients: String,
  recipeImage: String,
  recipeExplain: String,
  createdAt: {
    type: Date, default: Date.now()
  },
  user_id: String
})

exports.RecipeModel = mongoose.model("recipes", recipeSchema);

exports.validRecipe = (_dataBody) => {
  let joiSchema = Joi.object({
    recipeName:Joi.string().min(2).max(99).required(),
    recipeTime:Joi.string().min(2).max(99).required(),
    recipeType:Joi.string().min(2).max(99).required(),
    recipeIngredients:Joi.string().min(2).max(500).required(),
    recipeExplain:Joi.string().min(2).max(500).required(),
    recipeImage:Joi.string().max(900).allow(null, '')
  })
  return joiSchema.validate(_dataBody);
}

