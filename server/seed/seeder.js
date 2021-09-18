const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('./../models/Notification');
const User = require('./../models/User');
const Repairer = require('./../models/Repairer');
const Solution = require('./../models/Solution');
const Statistic = require('./../models/Admin/Statistic');

if (process.env.NODE_ENV === 'production') {
  // live database
   uri = process.env.ATLAS_URI;
}else{
  //local Configration
uri = process.env.MOGODB_LOCAL;
}




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
const notifications = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/notifications.json`, 'utf-8')
  );
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/users.json`, 'utf-8')
  );

const repairers = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/repairers.json`, 'utf-8')
  );


const solutions = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/solutions.json`, 'utf-8')
  );

const statistics = [
  {title:"Repairers", total:0},
  {title:"Users", total:0},
  {title:"Profiles", total:0},
  {title:"Solutions", total:0},
  {title:"Requests", total:0}

]

  // Import into DB
const importData = async () => {
    try {
      await Statistic.create(statistics);
      await Notification.create(notifications);
      await User.create(users);
      await Repairer.create(repairers);
      await Solution.create(solutions);
      console.log('Successfully imported data to database');
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };

// Delete data
const deleteData = async () => {
    try {
      await Notification.deleteMany();
      await User.deleteMany();
      await Repairer.deleteMany();
      await Solution.deleteMany();
      await Statistic.deleteMany();
      
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
  