import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SignOn from './pages/SignOn';
import TakeOver from './pages/TakeOver';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Running from './pages/Running';
import MadeOver from './pages/MadeOver';
import SignOff from './pages/SignOff';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sign-on" element={<SignOn />} />
      <Route path="/take-over" element={<TakeOver />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/running" element={<Running />} />
      <Route path="/made-over" element={<MadeOver />} />
      <Route path="/sign-off" element={<SignOff />} />
    </Routes>
  );
}

export default App;
