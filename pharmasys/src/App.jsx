import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spin, Layout } from 'antd';
import Login from './components/Login';
import Dashboard from './components/common/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse saved user:', e);
          localStorage.removeItem('user');
        }
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Improved loading state with Spin component
  // if (loading) {
  //   return (
  //     <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  //       <div style={{ textAlign: 'center' }}>
  //         <Spin size="large" />
  //         <div style={{ marginTop: 16, fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
  //           Loading application...
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route 
          path="/dashboard/*"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
        {/* <Route 
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;