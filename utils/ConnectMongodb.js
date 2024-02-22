const mongoose = require("mongoose");
const {
  saveDataToFile,
  readDataFromFile,
  checkForSpecialFlag,
  getFlagValue,
} = require("./mod/DataHandelConfig.js");

//connect to mongodb
function connect() {
  
    mongoose
      .connect(
        "mongodb+srv://ajjallab:D7C8C5ICIoIPwkIs@firstclusterrunajcode.uml3as9.mongodb.net/"
      )
      .then((req) => {
        ///console.log(req); //req is the object of the connection
        saveDataToFile({ mogodbstatus:req.connection.readyState   });

        //console.log("Connected to the database", req.connection.readyState);
      })
      .catch((err) => {
        console.log(err);
      });

  

}
module.exports = { connect: connect };
