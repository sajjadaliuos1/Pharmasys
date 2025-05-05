import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import SupplierDetails from '../supplier/SupplierDetails';
const { Content } = Layout;

function Dashboard({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAlert, setShowAlert] = useState(true); // for success message
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  // Debugging - log user and role to ensure they're defined
  useEffect(() => {
    console.log('User object:', user);
    console.log('User role:', user?.role);
  }, [user]);

  // Debugging - log current location on every render
  useEffect(() => {
    console.log('Current location pathname:', location.pathname);
  }, [location]);

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
    localStorage.removeItem('user'); // Clear user data if using localStorage
    navigate('/login');
  };

  // Safely access role with fallback
  const role = user?.role || '';

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

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);
  
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
      <Layout style={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), transition: 'all 0.2s' }}>
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
            {/* Default route - exact path is important */}
            <Route exact path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard routes based on role */}
            <Route path="/dashboard" element={
              role === 'role1' ? <DashboardHome /> :
              role === 'role2' ? <SalesDashboard /> :
              role === 'role3' ? <CustomerDashboard /> :
              <Navigate to="/login" replace />
            } />

            {/* Global routes for all roles */}
            <Route path="/dashboard/sales" element={
              ['role1', 'role2', 'role3'].includes(role) ? <SalesDashboard /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/salesrecord" element={
              ['role1', 'role2', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/salesreturn" element={
              ['role1', 'role2', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/customers" element={<CustomerDetails />} />
            <Route path="/dashboard/customerpayment" element={<DashboardHome />} />
            
            {/* Purchase routes */}
            <Route path="/dashboard/purchase" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/purchaserecord" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/purchasereturn" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/purchasereturnrecord" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            
            {/* Transaction routes */}
            <Route path="/dashboard/dailysales" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> :
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/dailyprofit" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> :
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/profitsummary" element={
              ['role1', 'role2'].includes(role) ? <DashboardHome /> :
              <Navigate to="/dashboard" replace />
            } />
            
            {/* Role 1 (Admin) specific routes */}
            <Route path="/dashboard/products" element={
              role === 'role1' ? <ProductDetails /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/category" element={
              role === 'role1' ? <Categorydetail /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/subcategory" element={
              role === 'role1' ? <SubCategoryDetail /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/supplier" element={
              role === 'role1' ? <SupplierDetails /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/supplierpayment" element={
              role === 'role1' ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            
            {/* Product related routes (Admin only) */}
            <Route path="/dashboard/productstock" element={
              role === 'role1' ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/productlowstock" element={
              role === 'role1' ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/productrate" element={
              role === 'role1' ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            
            {/* Settings routes (Admin and Staff) */}
            <Route path="/dashboard/settings/roles" element={
              ['role1', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/settings/category" element={
              ['role1', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/settings/shops" element={
              ['role1', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />
            <Route path="/dashboard/settings/employees" element={
              ['role1', 'role3'].includes(role) ? <DashboardHome /> : 
              <Navigate to="/dashboard" replace />
            } />

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