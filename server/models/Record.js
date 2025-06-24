const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {}, 
  { strict: false } 
);

module.exports = mongoose.model('Record', RecordSchema);
