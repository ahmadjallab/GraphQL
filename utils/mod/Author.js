const mongoose = require("mongoose");

const MSchema = mongoose.Schema;
const AuthorSchema = new MSchema({
  name: String,
  age: Number,
  
});
module.exports = mongoose.model("Author", AuthorSchema );
