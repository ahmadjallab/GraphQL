const mongoose = require("mongoose");
const MSchema = mongoose.Schema;
const bookSchema = new MSchema({
  
  name: String,
  genre: String,
  authorid: String,
});

module.exports = mongoose.model("Book", bookSchema);
