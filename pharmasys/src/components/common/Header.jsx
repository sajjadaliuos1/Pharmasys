import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

function Header({ collapsed, toggleSidebar, onLogout, isMobile, user }) {
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'settings',
      label: 'Settings',
    },
    {
      key: 'logout',
      label: 'Logout',
      danger: true, // Makes the text red to indicate a destructive action
    },
  ];

  const notificationItems = [
    {
      key: '1',
      label: 'New inventory alert: Low stock on Paracetamol',
    },
    {
      key: '2',
      label: 'Sales report for March is ready',
    },
    {
      key: '3',
      label: 'System update scheduled for tomorrow',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      onLogout(); // Call logout function passed from parent
    }
  };

  // Get user display name based on role
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    switch (user.role) {
      case 'role1': return 'Admin';
      case 'role2': return 'Manager';
      case 'role3': return 'Staff';
      default: return user.name || 'User';
    }
  };

  return (
    <AntHeader
      style={{
        background: '#f4f7fa',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: isMobile ? 'fixed' : 'relative',
        width: '100%',
        zIndex: 998,
      }}
    >
      {/* Only show toggle button when not on mobile */}
      {!isMobile && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: '18px', width: 64, height: 64 }}
        />
      )}
      
      {/* On mobile, we need an empty div to maintain the flex layout */}
      {isMobile && <div style={{ width: 24 }}></div>}

      <Space size="large">
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '20px', color: '#4a90e2' }} />}
            style={{ borderRadius: '4px' }}
          />
        </Dropdown>

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Space align="center" style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
            <Text style={{ display: 'inline', fontWeight: '500', color: '#333' }}>
              {getUserDisplayName()}
            </Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Header;