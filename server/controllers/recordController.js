const Record = require('../models/Record');


exports.getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    res.json(record);
  } catch (err) {
    res.status(404).json({ message: 'Record not found' });
  }
};


exports.deleteRecord = async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.searchRecords = async (req, res) => {

  try {
    const searchTerm = req.query.search || '';  
    console.log('Search Term:', searchTerm);  

    const isNumber = !isNaN(searchTerm); 
    const searchQuery = isNumber ? parseFloat(searchTerm) : searchTerm;  

    const records = await Record.find({
      $or: [
        { Brand: { $regex: searchTerm, $options: 'i' } }, 
        { Model: { $regex: searchQuery, $options: 'i' } },
        { Accelsec: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
        { TopSpeed_KmH: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
        { Range_Km: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
        { Efficiency_WhKm: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
        { FastCharge_KmH: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
        { RapidCharge: { $regex: searchQuery, $options: 'i' } },
        { PowerTrain: { $regex: searchQuery, $options: 'i' } },
        { PlugType: { $regex: searchQuery, $options: 'i' } },
        { BodyStyle: { $regex: searchQuery, $options: 'i' } },
        { Segment: { $regex: searchQuery, $options: 'i' } },
        { Seats: isNumber ? { $gte: searchQuery } : { $regex: searchQuery, $options: 'i'} },
            {
              PriceEuro: isNumber
                ? {
                    $gte: { $toDouble: "$PriceEuro" }, 
                  }
                : { $regex: searchTerm, $options: 'i' },
            },        { Date: { $regex: searchTerm, $options: 'i' } }
      ]
    });


    res.json(records);  
  } catch (err) {
    console.error("Error in searchRecords:", err.message); 
    res.status(500).json({ message: err.message });
  }
};


exports.filterRecords = async (req, res) => {
  try {
    const { field, operator, value } = req.query;

    if (!field || (!value && operator !== 'is_empty')) {
      return res.status(400).json({ message: 'Missing filter parameters' });
    }

    let condition = {};

    switch (operator) {
      case 'contains':
        condition[field] = { $regex: value, $options: 'i' };
        break;
      case 'equals':
        condition[field] = value;
        break;
      case 'starts_with':
        condition[field] = { $regex: '^' + value, $options: 'i' };
        break;
      case 'ends_with':
        condition[field] = { $regex: value + '$', $options: 'i' };
        break;
      case 'is_empty':
        condition[field] = { $in: [null, ''] };
        break;
      default:
        return res.status(400).json({ message: 'Invalid filter operator' });
    }

    const records = await Record.find(condition);
    res.json(records);
  } catch (err) {
    console.error('Filter Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};





