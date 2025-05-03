import { useState, useEffect } from 'react';
import { Layout, Alert } from 'antd';
import SideMenu from './SideMenu';
import Header from './Header';
import DashboardRoutes from './DashboardRoutes';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

function Dashboard({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(true); // for success message
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  // Check for user authentication
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Auto-collapse on mobile
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close success alert after 3 seconds
  useEffect(() => {
    if (user) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    onLogout(); // Call the logout handler from App component
    navigate('/login');
  };

  // Safely access role with fallback
  const role = user?.role || '';

  const getLoginMessage = () => {
    switch (role) {
      case 'role1': return 'Admin login successful';
      case 'role2': return 'Manager login successful';
      case 'role3': return 'Staff login successful';
      default: return 'Login successful';
    }
  };

  // If no user, show loading or redirect
  if (!user) {
    return <div>Checking authentication...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu 
        collapsed={collapsed} 
        role={role} 
        setCollapsed={setCollapsed}
      />
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), 
        transition: 'all 0.2s' 
      }}>
        <Header 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar} 
          onLogout={handleLogout}
          isMobile={isMobile}
          user={user}
        />
        {showAlert && (
          <Alert 
            message={getLoginMessage()} 
            type="success" 
            showIcon 
            closable 
            style={{ marginBottom: 16 }}
          />
        )}
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          minHeight: 280, 
          background: '#fff',
          marginTop: isMobile ? '64px' : '24px'
        }}>
          {/* Use the dedicated routes component */}
          <DashboardRoutes role={role} />
        </Content>
      </Layout>
      
      {/* Semi-transparent overlay when menu is open on mobile */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 999,
            cursor: 'pointer'
          }}
          onClick={toggleSidebar}
        />
      )}
    </Layout>
  );
}

export default Dashboard;