import { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserSwitchOutlined,
  AppstoreOutlined,
  ShopOutlined,
  UserOutlined,
  ContactsOutlined,
  MenuOutlined
} from '@ant-design/icons';
import logo from "../../assets/images/logo.png";

const { Sider } = Layout;

function SideMenu({ collapsed, setCollapsed, role }) {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const roleMenuVisibility = {
    role1: ['dashboard', 'setup', 'supplier', 'products', 'category', 'customers', 'sales'],
    role2: ['sales', 'customers'],
    role3: ['customers', 'setup']
  };
  
  const allowedMenus = roleMenuVisibility[role] || [];
  
  const menuItems = [
    allowedMenus.includes('dashboard') && {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    allowedMenus.includes('setup') && {
      key: '/dashboard/settings',
      icon: <SettingOutlined />,
      label: 'Setup',
      children: [
        {
          key: '/dashboard/settings/roles',
          icon: <UserSwitchOutlined />,
          label: <Link to="/dashboard/settings/roles">Roles</Link>,
        },
        {
          key: '/dashboard/settings/category',
          icon: <AppstoreOutlined />,
          label: <Link to="/dashboard/settings/category">Category</Link>,
        },
        {
          key: '/dashboard/settings/shops',
          icon: <ShopOutlined />,
          label: <Link to="/dashboard/settings/shops">Shops</Link>,
        },
        {
          key: '/dashboard/settings/employees',
          icon: <UserOutlined />,
          label: <Link to="/dashboard/settings/employees">Employee</Link>,
        }
      ]
    },
    
    allowedMenus.includes('category') && {
      key: '/dashboard/category',
      icon: <MedicineBoxOutlined />,
      label: 'Category',
      children: [
        {
          key: '/dashboard/category/',
          icon: <AppstoreOutlined/>,
          label: <Link to="/dashboard/category">Category</Link>,
        },
        {
          key: '/dashboard/subcategory',
          icon: <AppstoreOutlined />,
          label: <Link to="/dashboard/subcategory">subcategory</Link>,
        },
      
      ]
    },
    allowedMenus.includes('products') && {
      key: '/dashboard/products',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/dashboard/products">Product</Link>,
    },
    allowedMenus.includes('supplier') && {
      key: '/dashboard/suppliers',
      icon: <ContactsOutlined />,
      label: <Link to="/dashboard/suppliers">Supplier</Link>,
    },
    allowedMenus.includes('customers') && {
      key: '/dashboard/customers',
      icon: <TeamOutlined />,
      label: <Link to="/dashboard/customers">Customer</Link>,
    },
    allowedMenus.includes('sales') && {
      key: '/dashboard/sales',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/dashboard/sales">Sale</Link>,
    },
  ].filter(Boolean);

  const toggleMenu = () => {
    if (setCollapsed) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Hamburger menu icon only shows when in mobile view AND menu is collapsed */}
      {isMobile && collapsed && (
        <Button 
          icon={<MenuOutlined />}
          onClick={toggleMenu}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 1001,
            background: '#ff1e00',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={200}
        breakpoint="lg"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          transition: 'all 0.2s',
        }}
      >
        <div className="logo" style={{ 
          padding: '16px', 
          textAlign: 'center',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          {collapsed ? (
            <h3 style={{ color: 'white', margin: 0 }}>PS</h3>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Logo" style={{ height: '28px', marginRight: '8px' }} />
              <h2 style={{ color: 'white', margin: 0 }}>PharmaSys</h2>
            </div>
          )}
        </div>
        
        {/* Close button that shows only when menu is open in mobile view */}
        {isMobile && !collapsed && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleMenu}
            style={{
              position: 'absolute',
              right: '10px',
              top: '16px',
              color: '#fff',
              fontSize: '18px',
              background: 'transparent'
            }}
          />
        )}
        
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
    </>
  );
}

export default SideMenu;