import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

export const getPersons = () => axios.get(`${API_URL}/person/all`);

export const getPerson = id => axios.get(`${API_URL}/person/get/${id}`);

export const savePerson = data => axios.post(`${API_URL}/person/save`, data);

export const deletePerson = () => axios.get(`${API_URL}/person/remove`);

export const getVersion = () => axios.get(`${API_URL}/api/version`);
