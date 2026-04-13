import axios from 'axios';


// Change this:
// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// To this (use YOUR Render URL):
const API = axios.create({ baseURL: 'https://ledger-app-f777.onrender.com' });

// This part automatically attaches our "VIP Pass" (Token) to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export default API;