const express = require("express");
const router = express.Router();
const {  Employee } = require("../models/Employee");
const { authCustomer } = require("../middlewear/Auth");

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

router.patch("/customer/password", authCustomer, async (req, res) => {
  const newPassword = req.body.newPassword;
  const phone = req.body.Phone;
  try {
    const employee = await Employee.findOne({  phone });

    if (!employee) {
      res.status(400).send({ success: false, message: "Customer not registered with this number" });
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

module.exports = router;
