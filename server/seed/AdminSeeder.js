const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');


 const uri = 'mongodb+srv://user:user123@cluster0-8cpse.mongodb.net/mern-cellgeeks?retryWrites=true&w=majority';

//const uri = process.env.MOGODB_LOCAL;


// Connect to MongoDB Atlas




mongoose
  .connect(uri, {
    useFindAndModify: false, 
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

var admin = new Admin({
    firstName:'Ali',
    lastName:'Anwar',
    role:'admin',
    email:'alianwar@live.com',
    password:'1122@abc!'
}) 

bcrypt.genSalt(10,(err, salt) => {
    bcrypt.hash(admin.password, salt, async (err, hash) => {
      admin.password = hash;
     await admin.save();
     mongoose.disconnect();
     console.log('MongoDB disconnected....')
     
    })
})

