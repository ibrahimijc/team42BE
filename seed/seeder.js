const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('./../models/Employee');
const Teams = require('./../models/Team');
const Questions = require('./../models/Questions');

const uri = process.env.DB_URL


mongoose
  .connect(uri, {
    useFindAndModify: false, 
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  // Read JSON files


const employees = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/employees.json`, 'utf-8')
  );

  const teams = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/teams.json`, 'utf-8')
  );

  const questions = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/questions.json`, 'utf-8')
  );

  // Import into DB
const importData = async () => {
    try {
      await Employee.create(employees);
      await Teams.create(teams);
      await Questions.create(questions);
      console.log('Successfully imported data to database');
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

// Delete data
const deleteData = async () => {
    try {
      await Employee.deleteMany();
      await Questions.deleteMany();
      await Teams.deleteMany();

      console.log('Successfully deleted data from database');

      process.exit();

    } catch (err) {
      console.error(err);
    }
  };

/* Terminal commands "node seed/seeder -i" for installing data and "node seed/seeder -d" for deleting data 
*/
  if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }
  