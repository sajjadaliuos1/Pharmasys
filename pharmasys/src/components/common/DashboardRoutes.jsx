import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHome from '../DashboardHome';
import SalesDashboard from '../SalesDashboard';
import CustomerDashboard from '../CustomerDashboard';
import CustomerDetails from '../CustomerDetails';
import ProductDetails from '../product/ProductDetails';
import Categorydetail from '../category/Categorydetail';
import SubCategoryDetail from '../category/SubCategoryDetails';
import SupplierDetails from '../supplier/SupplierDetails';
import Purchase from '../purchase/purchase'; 
import Dashboard from './Dashboard';

function DashboardRoutes({ role }) {
  // Early return with redirect if no valid role
  if (!['role1', 'role2', 'role3'].includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Helper function to check role access
  const checkAccess = (allowedRoles) => {
    return allowedRoles.includes(role);
  };

  // Role-based component mapping for the main dashboard path
  const getDashboardComponent = () => {
    if (role === 'role1') return <DashboardHome />;
    if (role === 'role2') return <SalesDashboard />;
    if (role === 'role3') return <CustomerDashboard />;
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Main dashboard route - shows different component based on role */}
      <Route path="/" element={getDashboardComponent()} />
      
      {/* Global routes for all roles */}
      {checkAccess(['role1', 'role2', 'role3']) && (
        <>
          <Route path="/sales" element={<SalesDashboard />} />
          <Route path="/salesrecord" element={<DashboardHome />} />
          <Route path="/salesreturn" element={<DashboardHome />} />
          <Route path="/customers" element={<CustomerDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </>
      )}
      
      {/* Purchase routes - for role1 and role2 only */}
      {checkAccess(['role1', 'role2']) && (
        <>
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/purchaserecord" element={<DashboardHome />} />
          <Route path="/purchasereturn" element={<DashboardHome />} />
          <Route path="/purchasereturnrecord" element={<DashboardHome />} />
          
          {/* Transaction routes */}
          <Route path="/dailysales" element={<DashboardHome />} />
          <Route path="/dailyprofit" element={<DashboardHome />} />
          <Route path="/profitsummary" element={<DashboardHome />} />
        </>
      )}
      
      {/* Admin (role1) specific routes */}
      {role === 'role1' && (
        <>
          <Route path="/products" element={<ProductDetails />} />
          <Route path="/category" element={<Categorydetail />} />
          <Route path="/subcategory" element={<SubCategoryDetail />} />
          <Route path="/supplier" element={<SupplierDetails />} />
          <Route path="/supplierpayment" element={<DashboardHome />} />
          
          {/* Product related routes */}
          <Route path="/productstock" element={<DashboardHome />} />
          <Route path="/productlowstock" element={<DashboardHome />} />
          <Route path="/productrate" element={<DashboardHome />} />
        </>
      )}
      
      {/* Settings routes (Admin and Staff) */}
      {checkAccess(['role1', 'role3']) && (
        <>
          <Route path="/settings/roles" element={<DashboardHome />} />
          <Route path="/settings/category" element={<DashboardHome />} />
          <Route path="/settings/shops" element={<DashboardHome />} />
          <Route path="/settings/employees" element={<DashboardHome />} />
        </>
      )}

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default DashboardRoutes;