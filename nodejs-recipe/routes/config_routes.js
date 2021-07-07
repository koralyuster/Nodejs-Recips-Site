const indexR = require("./index");
const usersR = require("./users");
const recipesR = require("./recipes");

exports.originAllow = (app) => {
  // allow to get requests from other domains
  app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-auth-token');
    next();
  });
}

exports.routerInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/recipes", recipesR);


  //404 Page:
  app.use((req,res) => {
    res.json({msg:"Url not found, PAGE 404"})
  })
}