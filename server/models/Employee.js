const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  available: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    required: true,
    unique: true,

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

  password: {
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

EmployeeSchema.statics.findByCredentials = async function (email, password) {
  const employee = await Employee.findOne({ email });
  if (!employee) {
    throw Error({
      message: "unable to login",
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, employee.password);
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
  if (employee.isModified("password")) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});



const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
