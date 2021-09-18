const mongoose = require("mongoose");
const dotenv = require("dotenv");
mongoose.set("useCreateIndex", true);
dotenv.config();

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connected");
  })
  .catch((e) => {
    console.log("Error in Connecting to Mongo", e.message);
  });
