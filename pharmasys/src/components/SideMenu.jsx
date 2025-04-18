import { Layout, Menu } from 'antd';
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
  ContactsOutlined
} from '@ant-design/icons';
import logo from "./../assets/images/logo.png";

const { Sider } = Layout;

function SideMenu({ collapsed, role }) {
  const location = useLocation();

  const roleMenuVisibility = {
    role1: ['dashboard', 'setup', 'supplier', 'products', 'customers', 'sales'],
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
    allowedMenus.includes('supplier') && {
      key: '/dashboard/suppliers',
      icon: <ContactsOutlined />,
      label: <Link to="/dashboard/suppliers">Supplier</Link>,
    },
    allowedMenus.includes('products') && {
      key: '/dashboard/products',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/dashboard/products">Products</Link>,
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

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="80"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        backgroundColor: '#001529',
      }}
    >
      <div style={{ height: 64, margin: 16, display: 'flex', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: '40px', height: '40px', marginRight: '8px' }}
        />
        <h1 style={{
          color: '#fff',
          margin: 0,
          fontSize: collapsed ? '16px' : '20px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontWeight: '500',
        }}>
          {collapsed ? 'PS' : 'PharmaSys'}
        </h1>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
}

export default SideMenu;
