import { useState, useEffect } from 'react';
import { Layout, Alert, Spin } from 'antd';
import SideMenu from './SideMenu';
import Header from './Header';
import DashboardRoutes from './DashboardRoutes';
import { useNavigate, useLocation } from 'react-router-dom';

const { Content } = Layout;

function Dashboard({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showAlert, setShowAlert] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);
  
  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); 
    
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);
  
  // Welcome alert management
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
    if (onLogout) {
      onLogout(); 
    }
    navigate('/login');
  };
  
  // Default to guest role if user role not specified
  const role = user?.role || 'guest'; 
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu 
        collapsed={collapsed}
        role={role}
        setCollapsed={setCollapsed}
        currentPath={location.pathname}
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
        {user && showAlert && (
          <Alert
            message={`Welcome ${user.name || 'User'}!`}
            description="You have successfully logged in to the dashboard."
            type="success"
            showIcon
            closable
            style={{ marginBottom: 16 }}
            onClose={() => setShowAlert(false)}
          />
        )}
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          marginTop: isMobile ? '64px' : '24px'
        }}>
          <DashboardRoutes user={user} />
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