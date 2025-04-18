import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Main dashboard route with all nested routes inside Dashboard.js */}
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
        />

        {/* Default route: redirect to dashboard if logged in, else login */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        {/* Catch-all route fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
