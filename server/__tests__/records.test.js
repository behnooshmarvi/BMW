const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); 
const Record = require('../models/Record');

beforeAll(async () => {
  await Record.deleteMany({});
  await Record.create([
    {
      Brand: 'Tesla',
      Model: 'Model S',
      Accelsec: '2.5',
      TopSpeed_KmH: '250',
      Range_Km: '600',
      Efficiency_WhKm: '180',
      FastCharge_KmH: '1000',
      RapidCharge: 'Yes',
      PowerTrain: 'AWD',
      PlugType: 'Type 2',
      BodyStyle: 'Sedan',
      Segment: 'Luxury',
      Seats: '5',
      PriceEuro: '99999',
      Date: '2024-01-01',
    },
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/records', () => {
  it('should fetch all records', async () => {
    const res = await request(app).get('/api/records');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/records/search', () => {
  it('should return filtered records matching search term', async () => {
    const res = await request(app).get('/api/records/search?search=Tesla');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].Brand).toMatch(/Tesla/i);
  });
});

describe('GET /api/records/filter', () => {
  it('should return records filtered by field and operator', async () => {
    const res = await request(app).get('/api/records/filter?field=Brand&operator=equals&value=Tesla');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].Brand).toBe('Tesla');
  });
});

describe('DELETE /api/records/:id', () => {
  it('should delete a record by ID', async () => {
    const record = await Record.findOne({ Brand: 'Tesla' });
    const res = await request(app).delete(`/api/records/${record._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Deleted/);
  });
});
