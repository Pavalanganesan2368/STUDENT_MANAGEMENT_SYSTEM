const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Student.deleteMany();

    const adminUser = await User.create({
        email: 'admin@gmail.com',
        password: '(Pavalan@2004)', // will be hashed by pre-save hook
        role: 'admin'
    });

    console.log('Admin User Created:', adminUser.email);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await User.deleteMany();
      await Student.deleteMany();
  
      console.log('Data Destroyed!');
      process.exit();
    } catch (error) {
      console.error(`${error}`);
      process.exit(1);
    }
  };
  
  if (process.argv[2] === '-d') {
    destroyData();
  } else {
    importData();
  }
