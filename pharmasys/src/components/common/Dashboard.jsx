import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout, Alert } from 'antd';
import SideMenu from './SideMenu';
import Header from './Header';
import DashboardHome from '../DashboardHome';
import Categorydetail from '../category/Categorydetail';
import SalesDashboard from '../SalesDashboard';
import CustomerDetails from '../CustomerDetails';
import CustomerDashboard from '../CustomerDashboard';
import ProductDetails from '../product/ProductDetails';
import SubCategoryDetail from '../category/SubCategoryDetails';
const { Content } = Layout;

// Placeholder components
const Inventory = () => (
  <Routes>
    <Route path="list" element={<Categorydetail />} />
    
    <Route path="add" element={<div>Add Medicine</div>} />
    <Route path="stock" element={<div>Stock Management</div>} />
    <Route path="suppliers" element={<div>Suppliers</div>} />
    <Route path="*" element={<Navigate to="list" />} />
  </Routes>
);
const Sales = SalesDashboard;
const Customers = CustomerDetails;
const Reports = DashboardHome;
const Settings = DashboardHome;

function Dashboard({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(true); // for success message
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    navigate('/login');
    window.location.reload();
  };

  const role = user?.role;

  useEffect(() => {
    if (user) {
      setShowAlert(true);
      // Auto-close the alert after 3 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const getLoginMessage = () => {
    switch (role) {
      case 'role1': return 'Admin login successful';
      case 'role2': return 'Manager login successful';
      case 'role3': return 'Staff login successful';
      default: return '';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu 
        collapsed={collapsed} 
        role={role} 
        setCollapsed={setCollapsed}
      />
      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), transition: 'all 0.2s' }}>
        {/* No mobile toggle button here anymore */}
        <Header 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar} 
          onLogout={handleLogout}
          isMobile={isMobile}
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
          <Routes>
            {/* Default landing route */}
            {role === 'role1' && <Route path="/" element={<DashboardHome />} />}
            {role === 'role2' && <Route path="/" element={<SalesDashboard />} />}
            {role === 'role3' && <Route path="/" element={<CustomerDashboard />} />}

            {role === 'role1' && (
              <>
                <Route path="/sales" element={<Sales />} />
                <Route path="/customers" element={<CustomerDetails />} />
                <Route path="/products" element={<ProductDetails />} />
                <Route path="/category" element={<Categorydetail />} />
                <Route path="/subcategory" element={<SubCategoryDetail />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}

            {role === 'role2' && (
              <>
                <Route path="/sales" element={<Sales />} />
                <Route path="/customers" element={<Customers />} />
              </>
            )}

            {role === 'role3' && (
              <>
                <Route path="/customers" element={<Customers />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
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