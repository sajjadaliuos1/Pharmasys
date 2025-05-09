import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHome from '../DashboardHome';
import ProductDetails from '../product/ProductDetails';
import Categorydetail from '../category/Categorydetail';
import Purchase from '../purchase/purchase';

function DashboardRoutes() {
  return (
    <Routes>
      {/* Main dashboard page */}
      <Route path="/dashboard" element={<DashboardHome />} />
      
      {/* Sales routes */}
      <Route path="/salesrecord" element={<DashboardHome />} />
      <Route path="/salesreport" element={<div>Sales Report</div>} />
      
      {/* Purchase routes */}
      <Route path="/purchase" element={<Purchase />} />
      
      {/* Product and category routes */}
      <Route path="/products" element={<ProductDetails />} />
      <Route path="/category" element={<Categorydetail />} />
      
      {/* Settings routes */}
      <Route path="/dashboard/settings/roles" element={<div>Roles Management</div>} />
      <Route path="/dashboard/settings/category" element={<div>Category Settings</div>} />
      <Route path="/dashboard/settings/shops" element={<div>Shops Management</div>} />
      <Route path="/dashboard/settings/employees" element={<div>Employee Management</div>} />
      
      {/* Index route for direct dashboard access */}
      <Route index element={<Navigate to="/dashboard" replace />} />
      
      {/* Default route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default DashboardRoutes;