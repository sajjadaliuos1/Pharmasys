import { useState } from 'react';
import { 
  DownloadOutlined, 
  ReloadOutlined, 
  ColumnHeightOutlined,
  PlusOutlined,
  SearchOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Dropdown, Menu, Button, Input, Space, Tooltip } from 'antd';

export const useTableHeader = ({
  title,
  onRefresh,
  onExportExcel,
  onExportPDF,
  onAddNew,
  onTableSizeChange,
  searchText,
  onSearchChange,
  rowData,
  screenSize
}) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const mobileMenu = (
    <Menu>
      <Menu.Item key="refresh" onClick={onRefresh}>
        <ReloadOutlined /> Refresh Data
      </Menu.Item>
      <Menu.Item key="excel" onClick={onExportExcel} disabled={!rowData.length}>
        <DownloadOutlined /> Export to Excel
      </Menu.Item>
      <Menu.Item key="pdf" onClick={onExportPDF} disabled={!rowData.length}>
        <DownloadOutlined /> Export to PDF
      </Menu.Item>
      <Menu.SubMenu key="display" title={<span><ColumnHeightOutlined /> Display Options</span>}>
        <Menu.Item key="Auto Height" onClick={() => onTableSizeChange({ key: "Auto Height" })}>
          Auto Height
        </Menu.Item>
        <Menu.Item key="Fixed Height" onClick={() => onTableSizeChange({ key: "Fixed Height" })}>
          Fixed Height
        </Menu.Item>
        <Menu.Item key="Fullscreen" onClick={() => onTableSizeChange({ key: "Fullscreen" })}>
          Fullscreen
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  const desktopExportMenu = (
    <Menu>
      <Menu.Item key="excel" onClick={onExportExcel} disabled={!rowData.length}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="pdf" onClick={onExportPDF} disabled={!rowData.length}>
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  const desktopDisplayMenu = (
    <Menu onClick={onTableSizeChange}>
      <Menu.Item key="Auto Height">Auto Height</Menu.Item>
      <Menu.Item key="Fixed Height">Fixed Height</Menu.Item>
      <Menu.Item key="Fullscreen">Fullscreen</Menu.Item>
    </Menu>
  );

  const renderMobileHeader = () => (
    <div className="mobile-header" style={{ marginBottom: '15px' }}>
      <div style={{ marginBottom: '12px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: screenSize === 'xs' ? '18px' : '24px' }}>
          {title}
        </h2>
      </div>

      <Space style={{ width: '100%' }}>
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={onSearchChange}
          style={{ flex: 1 }}
          prefix={<SearchOutlined />}
          allowClear
        />
        
        <Dropdown 
          overlay={mobileMenu} 
          placement="bottomLeft"
          trigger={['click']}
          onVisibleChange={setMobileMenuVisible}
          visible={mobileMenuVisible}
        >
          <Button icon={<MenuOutlined />} />
        </Dropdown>
        
        <Button 
          type="primary" 
          onClick={onAddNew}
          icon={<PlusOutlined />}
        />
      </Space>
    </div>
  );

  const renderDesktopHeader = () => (
    <div className="desktop-header" style={{ marginBottom: '15px' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={onSearchChange}
          style={{ width: '350px' }}
          prefix={<SearchOutlined />}
          allowClear
        />
        
        <Space>
          <Tooltip title="Refresh Data">
            <Button icon={<ReloadOutlined />} onClick={onRefresh} />
          </Tooltip>
          
          <Dropdown overlay={desktopExportMenu} placement="bottomRight">
            <Button icon={<DownloadOutlined />}>Export</Button>
          </Dropdown>
          
          <Dropdown overlay={desktopDisplayMenu} placement="bottomRight" trigger={['click']}>
            <Tooltip title="Display Options">
              <Button icon={<ColumnHeightOutlined />} />
            </Tooltip>
          </Dropdown>
          
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddNew}>
            Add New
          </Button>
        </Space>
      </Space>
    </div>
  );

  return {
    renderMobileHeader,
    renderDesktopHeader
  };
};