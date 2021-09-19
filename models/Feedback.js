const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  givenBy: {
    type: String,
    ref:"Employee.employeeId"
  },
   
  givenTo: {
    type: String,
    ref:"Employee.employeeId"
  },
  
  message:{
    type : "string"
  }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = FeedbackSchema;