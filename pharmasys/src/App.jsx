import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/common/Dashboard';

function App() {
  
  const [user, setUser] = useState(() => {
    
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); 
    
    return () => clearTimeout(timer);
  }, []);

  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Show a simple loading state while initializing
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5'
      }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <HashRouter>
     <Routes>
  <Route path="/login" element={<Login onLogin={handleLogin} />} />
  <Route path="/*" element={<Dashboard user={user} onLogout={handleLogout} />} />
  <Route path="/" element={<Navigate to="/purchase" replace />} /> // Default redirect
</Routes>
    </HashRouter>
  );
}

export default App;