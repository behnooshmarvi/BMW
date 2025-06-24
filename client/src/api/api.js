import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
  timeout: 5000,  
});

export const getAllRecords = () => {
  return api.get('/records');  
};


export const getRecordById = (id) => {
  return api.get(`/records/${id}`);
};


export const deleteRecord = (id) => {
  return api.delete(`/records/${id}`);
};


export const searchRecords = (searchTerm) => {
  return api.get(`/records/search?search=${searchTerm}`); 
};


export const filterRecords = (field, operator, value) => {
  return api.get(`/records/filter`, {
    params: { field, operator, value }
  });
};


export default api;
