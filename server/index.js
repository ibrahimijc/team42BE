const express = require("express");
const app = express();
require("./db/mongoose"); // run the db file
const customerRouter = require("./routes/employee");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(customerRouter);

app.listen(port, function () {
  console.log(`listening at ${port}`);
});
