const express = require("express");

const { graphqlHTTP } = require("express-graphql");

app = express();

//connect to mongodb
const { connect } = require("./utils/ConnectMongodb");
const mongoose = require("mongoose");

//connect();//cannot call because it is not a function but an object module exports

mongoose
  .connect(
    "mongodb+srv://ajjallab:D7C8C5ICIoIPwkIs@firstclusterrunajcode.uml3as9.mongodb.net/"
  )
  .then((req) => {
    ///console.log(req); //req is the object of the connection
    //saveDataToFile({ mogodbstatus:req.connection.readyState   });
    console.log("Connected to the database", req.connection.readyState);
  })
  .catch((err) => {
    console.log(err);
  });



// import schema
const schema = require("./schema/schema");
// use express-graphql middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
