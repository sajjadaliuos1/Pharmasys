import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout, Alert } from 'antd';
import SideMenu from './SideMenu';
import Header from './Header';
import DashboardHome from './DashboardHome';
import Productdetail from './product/Productdetail';

import SalesDashboard from './SalesDashboard';
import CustomerDetails from './CustomerDetails';
import CustomerDashboard from './CustomerDashboard';
const { Content } = Layout;

// Placeholder components
const Inventory = () => (
  <Routes>
    <Route path="list" element={<Productdetail />} />
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
  const navigate = useNavigate();

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
      <SideMenu collapsed={collapsed} role={role} />
      <Layout>
        <Header 
          collapsed={collapsed} 
          toggleSidebar={toggleSidebar} 
          onLogout={handleLogout} 
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
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
          

        <Routes>
  {/* Default landing route */}
  {role === 'role1' && <Route path="/" element={<DashboardHome />} />}
  {role === 'role2' && <Route path="/" element={<SalesDashboard />} />}
  {role === 'role3' && <Route path="/" element={<CustomerDashboard />} />}

  {role === 'role1' && (
    <>
     
      <Route path="/sales" element={<Sales />} />
      <Route path="/customers" element={<CustomerDetails />} />
      <Route path="/products" element={<Productdetail />} /> {/* ← added this line */}
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
    </Layout>
  );
}

export default Dashboard;
