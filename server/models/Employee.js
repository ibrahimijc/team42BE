const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmployeeSchema = new mongoose.Schema({
  authy_id: {
    type: String,
    default: null,
  },

  Name: {
    type: String,
    required: true,
  },

  Phone: {
    type: String,
    required: true,
    unique: true,
  },

  CountryCode: {
    type: String,
  },

  Verified: {
    type: Boolean,
    default: false,
  },

  Email: {
    type: String,
    required: true,

    validate(value) {
      // Regex Expression for valid Email
      let re = /\S+@\S+\.\S+/;

      const result = re.test(value);

      // if the email is not correct
      if (!result) {
        throw new Error("Email is not correct");
      }
    },
  },

  Password: {
    type: String,
    required: true,
    minlength: 7,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

EmployeeSchema.methods.generateAuthToken = async function () {
  try {
    const employee = this;
    const token = jwt.sign(
      { _id: employee._id.toString() },
      process.env.secret
    );
    employee.tokens = employee.tokens.concat({ token });
    await employee.save();

    return token;
  } catch (e) {
    throw new Error(e.message);
  }
};

EmployeeSchema.statics.findByCredentials = async function (phone, password) {
  const employee = await Employee.findOne({ Phone: phone });
  if (!employee) {
    throw Error({
      message: "unable to login",
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, employee.Password);
  if (!isMatch) {
    throw Error({
      message: "unable to login",
      success: false,
    });
  }

  return employee;
};

//  runs before saving the user to store password as a hash in db
EmployeeSchema.pre("save", async function (next) {
  const employee = this;
  if (employee.isModified("Password")) {
    employee.Password = await bcrypt.hash(employee.Password, 8);
  }
  next();
});



const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = { Employee: Employee};
