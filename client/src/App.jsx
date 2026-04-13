import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// // A simple temporary Dashboard component to test the login flow
// const Dashboard = () => (
//   <div style={{ padding: '20px' }}>
//     <h1>Welcome to your Ledger Dashboard!</h1>
//     <p>You are logged in successfully.</p>
//     <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
//       Logout
//     </button>
//   </div>
// );

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route (Temporary) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Redirect any unknown URL to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;