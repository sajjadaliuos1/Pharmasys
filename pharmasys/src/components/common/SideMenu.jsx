import { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  MedicineBoxOutlined,
  AppstoreOutlined,
  ShopOutlined,
  UserOutlined,
  MenuOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  ShoppingOutlined,
  ReconciliationOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import logo from "../../assets/images/logo.png";

const { Sider } = Layout;

function SideMenu({ collapsed, setCollapsed,  currentPath }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  
  const allowedMenus = [
    'dashboard',
    'setup',
    'category',
    'products',
    'purchase',
    'sales'
  ];

  // Handle menu item click
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setCollapsed(true);
    }
  };
  
  const menuItems = [
    allowedMenus.includes('dashboard') && {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleMenuClick('/dashboard')
    },
    allowedMenus.includes('setup') && {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Setup',
      children: [
        {
          key: '/dashboard/settings/roles',
          icon: <UserSwitchOutlined />,
          label: 'Roles',
          onClick: () => handleMenuClick('/dashboard/settings/roles')
        },
        {
          key: '/dashboard/settings/category',
          icon: <AppstoreOutlined />,
          label: 'Category',
          onClick: () => handleMenuClick('/dashboard/settings/category')
        },
        {
          key: '/dashboard/settings/shops',
          icon: <ShopOutlined />,
          label: 'Shops',
          onClick: () => handleMenuClick('/dashboard/settings/shops')
        },
        {
          key: '/dashboard/settings/employees',
          icon: <UserOutlined />,
          label: 'Employee',
          onClick: () => handleMenuClick('/dashboard/settings/employees')
        }
      ]
    },
    
    allowedMenus.includes('category') && {
      key: 'category',
      icon: <AppstoreOutlined />,
      label: 'Categories',
      children: [
        {
          key: '/category',
          icon: <AppstoreOutlined />,
          label: 'Category',
          onClick: () => handleMenuClick('/category')
        },
      ]
    },
    allowedMenus.includes('products') && {
      key: 'products',
      icon: <MedicineBoxOutlined />,
      label: 'Products',
      children: [
        {
          key: '/products',
          icon: <MedicineBoxOutlined />,
          label: 'Product',
          onClick: () => handleMenuClick('/products')
        },
      ]
    },
    allowedMenus.includes('purchase') && {
      key: 'purchase',
      icon: <ShoppingOutlined />,
      label: 'Purchase',
      children: [
        {
          key: '/purchase',
          icon: <ShoppingOutlined />,
          label: 'Purchase',
          onClick: () => handleMenuClick('/purchase')
        },
      ]
    },
    allowedMenus.includes('sales') && {
      key: 'sales',
      icon: <ReconciliationOutlined />,
      label: 'Sales',
      children: [
        {
          key: '/salesrecord',
          icon: <FileTextOutlined />,
          label: 'Sales Record',
          onClick: () => handleMenuClick('/salesrecord')
        },
        {
          key: '/salesreport',
          icon: <BarChartOutlined />,
          label: 'Sales Report',
          onClick: () => handleMenuClick('/salesreport')
        },
      ]
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
          defaultSelectedKeys={[currentPath]}
          selectedKeys={[currentPath]}
          items={menuItems}
        />
      </Sider>
    </>
  );
}

export default SideMenu;