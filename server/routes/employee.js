const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const {  authenticateEmployee } = require("../middlewear/Auth");
const Teams = require("../models/Team");
const e = require("express");
const Questions = require("../models/Questions");

router.get("/employee/test", function (req, res) {
  res.status(200).send("Working");
});

router.post("/employee/login", async function (req, res) {
  try {
    const employee = await Employee.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await employee.generateAuthToken();
    res.send({ success: true, Employee: employee, token });
    return;
  } catch (e) {
    res.status(400).send({ success: false, message: "unable to login. Check Credentials" });
    return;
  }
});

router.post("/employee/register", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    let existingEmployee = await Employee.findOne({
      email: employee.email,
    });

    // if the customer is already verified
    if (existingEmployee) {
      res
        .status(400)
        .send({ success: false, message: "User already exist" });
      return;
    }

    await employee.save();
    token = await employee.generateAuthToken(); // generate AuthToken for furher operations
    res.status(201).send({ success: true, employee, token });
  } catch (e) {
    res.status(400).send({ success: false, Error: e, Message: "Unable to register user" });
    return;
  }
});

router.patch("/employee/password", authenticateEmployee, async (req, res) => {
  const newPassword = req.body.newPassword;
  const phone = req.body.Phone;
  try {
    const employee = await Employee.findOne({  phone });

    if (!employee) {
      res.status(400).send({ success: false, message: "Employee not registered with this number" });
    }

    employee.Password = newPassword;
    await employee.save();
    res.status(200).send({ success: true, Employee: employee });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Could not update password ",
      Error: e,
    });
  }
});

router.get("/employee/meeting-details", authenticateEmployee , async(req,res) => {
  try {

    let  employee = req.employee;
    const excludedIds = [...employee.previousMeetings, employee.employeeId]
   
   let employeeQuestions = await Questions.aggregate([
      {
        $match:{
          employeeId:employee.employeeId
        }
      },
      {
        $group: {
          _id: "$employeeId",
          "questions": {
            $push: "$questionText"
          }
        }
      },
      {
        $project:{
          _id:0
        }
      }
   ]);

   let result = await Employee.aggregate([
      {
        "$match": {
          // employeeId must not equal to self plus previous
          "employeeId": {
            $nin: excludedIds
          },
          // team id not equal to self
          "teamId": {
            $ne: employee.teamId
          },        
        }
      },
      // To select one person randomly
      {
        "$sample": {
          "size": 1
        }
      },
      // Find the team person is associated with
      {
        $lookup: {
          from: "teams",
          localField: "teamId",
          foreignField: "teamId",
          as: "teams",          
        },        
      },
      {
        "$project": {
             _id: 0,
            "employeeName": "$firstName",
            "email": "$email",
            "TeamName": "$teams.teamName",
        }
      }
    ]);


    const meetingLink = "https://meet.google.com/abc-xyz-dummy"; // somehow generate link..
    res.status(200).send({
      PeerInfo : result[0] , meetingLink, questions : employeeQuestions[0].questions
    });

  }catch(e){
    res.status(500).send({message:"Internal Server Error"});
  }
})

module.exports = router;
