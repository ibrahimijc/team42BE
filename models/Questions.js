const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema({
  
  employeeId: {
    type: String,
    ref:"Employee.employeeId"
  },
   
 questionText : {
    type: String,
    required: true,
  },
});


const Questions = mongoose.model("Questions", QuestionsSchema);
module.exports = Questions;