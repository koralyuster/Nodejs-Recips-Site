const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://koraly:K0543067488@cluster0.d8bde.mongodb.net/yammis', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Mongo is connected to yammis");
  // we're connected!
});