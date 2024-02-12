var mongoose = require("mongoose");

function connectDb() {
  let mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  mongoose.set("debug", true);
  mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, mongoOptions)
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
  mongoose.set("useFindAndModify", false); // Done for deprecation warning by mongoose
}
// ========================== Export Module Start ==========================
module.exports = { connectDb };
// ========================== Export Module End ============================
