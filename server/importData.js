const mongoose = require('mongoose');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const Record = require('./models/Record');

const csvFilePath = path.join(__dirname, 'data.csv');

async function importCSV() {
  try {
    await connectDB();

    await Record.deleteMany();

    const jsonArray = await csv().fromFile(csvFilePath);

    await Record.insertMany(jsonArray);
    console.log(`✅ Successfully imported ${jsonArray.length} records`);
    process.exit();
  } catch (error) {
    console.error('❌ Error importing CSV:', error);
    process.exit(1);
  }
}

importCSV();
