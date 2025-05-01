import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "../common/style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ExcelExportModule } from "ag-grid-enterprise";
import { ModuleRegistry } from 'ag-grid-community';
import GlobalModal from "../customhooks/GlobalModal";
import CustomSelect from "../customhooks/CustomSelect";
import { RowGroupingModule, PivotModule, TreeDataModule, ServerSideRowModelModule, SetFilterModule } from 'ag-grid-enterprise';
import { DownloadOutlined, ReloadOutlined, TableOutlined, MenuOutlined } from "@ant-design/icons";
import { AllCommunityModule } from "ag-grid-community";
import {
  Modal, Form, Input as AntInput, Button, Tooltip, Dropdown, Menu, message, Spin, Space, Row, Col,
} from "antd";
import {
  ColumnHeightOutlined, SearchOutlined, PlusOutlined,
} from "@ant-design/icons";

ModuleRegistry.registerModules([
  AllCommunityModule, ExcelExportModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule
]);

const ActionCellRenderer = (params) => {
  const handleEdit = () => {
    console.log("Edit category:", params.data);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log("Delete category:", params.data);
    // Add your delete logic here
  };

  return (
    <div className="action-buttons">
      <button
        onClick={handleEdit}
        className="edit-btn"
        title="Edit"
        style={{ background: "none", border: "none", cursor: "pointer", marginRight: "10px" }}
      >
        {/* Use inline SVG instead of imported icons for better compatibility */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button
        onClick={handleDelete}
        className="delete-btn"
        title="Delete"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

const Categorydetail = () => {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [screenSize, setScreenSize] = useState('large');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);


  // Add responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setScreenSize('xs');
      } else if (window.innerWidth < 768) {
        setScreenSize('sm');
      } else if (window.innerWidth < 992) {
        setScreenSize('md');
      } else if (window.innerWidth < 1200) {
        setScreenSize('lg');
      } else {
        setScreenSize('xl');
      }

      // Also resize grid columns if grid is ready
      if (gridRef.current && gridRef.current.api) {
        setTimeout(() => {
          gridRef.current.api.sizeColumnsToFit();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Custom filter function that filters by categoryId and category name
  const isExternalFilterPresent = useCallback(() => {
    return searchText.length > 0;
  }, [searchText]);

  // Filter function that checks if either categoryId or category contains the search text
  const doesExternalFilterPass = useCallback(
    (node) => {
      if (searchText.length === 0) {
        return true;
      }
      const lowerSearchText = searchText.toLowerCase();
      const categoryId = node.data.categoryId ? node.data.categoryId.toString().toLowerCase() : "";
      const category = node.data.category ? node.data.category.toString().toLowerCase() : "";
      return categoryId.includes(lowerSearchText) || category.includes(lowerSearchText);
    },
    [searchText]
  );

  const gridOptions = {
    suppressMenuHide: true,
  };

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pos.idotsolution.com/api/Setting/categories');
      console.log('API Response:', response.data.data);
      const data = response.data.data;
      setRowData(data);
      setFilteredData(data);
      messageApi.success('Data loaded successfully');
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      messageApi.error(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(rowData);
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = rowData.filter(row =>
      (row.categoryId && row.categoryId.toString().toLowerCase().includes(searchLower)) ||
      (row.category && row.category.toLowerCase().includes(searchLower))
    );

    setFilteredData(filtered);
    
    // Also apply filter to AG Grid if it's ready
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.onFilterChanged();
    }
  }, [searchText, rowData]);

  const handleRefreshData = () => {
    fetchInvoiceData();
  };

  const getColumnDefs = () => {
    const baseColumns = [
      {
        headerName: "Category ID",
        field: "categoryId",
        sortable: true,
        filter: true,
        minWidth: 140,
        hide: screenSize === 'xs',
      },
      {
        headerName: "Category Name",
        field: "category",
        sortable: true,
        filter: true,
        minWidth: 140,
      },
      {
        headerName: "Actions",
        field: "actions",
        sortable: false,
        filter: false,
        minWidth: 110,
        cellRenderer: ActionCellRenderer,
        suppressSizeToFit: true,
      }
    ];

    return baseColumns;
  };
  
  const columnDefs = useMemo(() => getColumnDefs(), [screenSize]);
  
  const handleExportPDF = () => {
    const fileName = prompt("Enter file name for PDF:", "category-data");
    if (!fileName) return;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Category Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Get columns and row data
    const visibleCols = columnDefs.filter(col => !col.hide && col.field !== 'actions');
    const columns = visibleCols.map((col) => col.headerName || col.field);
    const rows = rowData.map((row) =>
      visibleCols.map((col) => {
        return row[col.field] || "";
      })
    );

    // Use the autoTable plugin
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };

  const handleExportExcel = () => {
    if (gridRef.current && gridRef.current.api) {
      const params = {
        fileName: 'category-data.xlsx',
        sheetName: 'Categories'
      };
      gridRef.current.api.exportDataAsExcel(params);
    }
  };

  const defaultColDef = useMemo(
    () => ({
      enableRowGroup: true,
      enableValue: true,
      filter: true,
      resizable: true,
      suppressSizeToFit: false
    }),
    []
  );

  const popupParent = useMemo(() => document.body, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const setAutoHeight = useCallback(() => {
    gridRef.current.api.setGridOption("domLayout", "autoHeight");
    document.querySelector("#myGrid").style.height = "";
  }, []);

  const setFixedHeight = useCallback(() => {
    gridRef.current.api.setGridOption("domLayout", "normal");
    document.querySelector("#myGrid").style.height = "500px";
  }, []);

  const handleTableSizeChange = ({ key }) => {
    messageApi.info(`Table layout set to: ${key}`);
    if (key === "Auto Height") {
      setAutoHeight();
    } else if (key === "Fixed Height") {
      setFixedHeight();
    } else if (key === "Fullscreen") {
      handleFullscreen();
    }
  };
  
  const AddnewModal = (record) => {
    let initialValues;
    
    if (record) {
      // For editing an existing record, use the data from the record
      initialValues = { ...record };
    } else {
      // For adding a new record, use default empty values
      initialValues = { 
        categoryId: '', 
        category: '', 
      };
    }
    
    setEditingRecord(initialValues);
    setIsModalVisible(true);
  };

  const mobileMenu = (
    <Menu>
      <Menu.Item key="refresh" onClick={handleRefreshData}>
        <ReloadOutlined /> Refresh Data
      </Menu.Item>
      <Menu.Item key="excel" onClick={handleExportExcel} disabled={!rowData.length}>
        <DownloadOutlined /> Export to Excel
      </Menu.Item>
      <Menu.Item key="pdf" onClick={handleExportPDF} disabled={!rowData.length}>
        <DownloadOutlined /> Export to PDF
      </Menu.Item>
      <Menu.SubMenu key="display" title={<span><ColumnHeightOutlined /> Display Options</span>}>
        <Menu.Item key="Auto Height" onClick={() => handleTableSizeChange({ key: "Auto Height" })}>
          Auto Height
        </Menu.Item>
        <Menu.Item key="Fixed Height" onClick={() => handleTableSizeChange({ key: "Fixed Height" })}>
          Fixed Height
        </Menu.Item>
        <Menu.Item key="Fullscreen" onClick={() => handleTableSizeChange({ key: "Fullscreen" })}>
          Fullscreen
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
  
  const modalFields = [
    {
      name: 'category',
      label: 'Category Name',
      type: 'input',
      rules: [{ required: true, message: 'Category name is required' }],
    },
    {
      name: 'customSelectCategory',
      label: 'Project Selection',
      // Use component instead of render for custom components
      component: <CustomSelect />,
    },
    {
      name: 'product',
      label: 'Select Product',
      type: 'select',
      options: [
        { label: 'Apple', value: 'apple', description: 'Fresh red apple.' },
        { label: 'Banana', value: 'banana', description: 'Sweet yellow banana.' },
        { label: 'Orange', value: 'orange', description: 'Juicy orange fruit.' },
      ],
      onChange: (value, form, setExtraDetails) => {
        const descriptions = {
          apple: 'Fresh red apple.',
          banana: 'Sweet yellow banana.',
          orange: 'Juicy orange fruit.'
        };
        setExtraDetails(descriptions[value] || '');
      }
    }
  ];
  
  
  return (
    <div className="category-management-container" style={{ padding: '10px', maxWidth: '100%' }}>
      {contextHolder}

      {/* Responsive Header Section - Restructured for Mobile */}
      <div className="mobile-header" style={{ marginBottom: '15px' }}>
        {/* Row 1: Title - full width on mobile */}
        <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
          <Col span={24}>
            <h2 style={{ margin: 0, fontSize: screenSize === 'xs' ? '18px' : '24px', textAlign: 'center' }}>
              Category Management
            </h2>
          </Col>
        </Row>

        {/* Row 2: Search field - full width on mobile */}
        <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
          <Col span={18}>
            <AntInput
              placeholder="Search by ID or name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
        
          <Col xs={3} style={{ textAlign: 'left' }}>
            <Dropdown 
              overlay={mobileMenu} 
              placement="bottomLeft" 
              trigger={['click']}
            >
              <Button icon={<MenuOutlined />} />
            </Dropdown>
          </Col>
          <Col xs={3}>
            <Button 
              type="primary" 
              onClick={() => AddnewModal(null)} 
              icon={<PlusOutlined />}
            >
             
            </Button>
          </Col>
        </Row>
      </div>

      {/* Desktop Header - Hidden on mobile screens */}
      <div className="desktop-header" style={{ display: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 'block', marginBottom: '15px' }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col md={6} lg={6}>
            <h2 style={{ margin: 0 }}>Category Management</h2>
          </Col>
          
          <Col md={10} lg={10} style={{ textAlign: 'center' }}>
            <AntInput
              placeholder="Search by category ID or name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', maxWidth: '350px' }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          
          <Col md={8} lg={8} style={{ textAlign: 'right' }}>
           <div className="row">
           <Space wrap>
            <div className="col-6">   <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefreshData}
                title="Refresh Data"
              />
              
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="excel"
                      onClick={handleExportExcel}
                      disabled={!rowData.length}
                    >
                      Export to Excel
                    </Menu.Item>
                    <Menu.Item key="pdf" onClick={handleExportPDF} disabled={!rowData.length}>
                      Export to PDF
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <Button icon={<DownloadOutlined />}>Export</Button>
              </Dropdown>

              <Dropdown
                overlay={
                  <Menu
                    onClick={handleTableSizeChange}
                    items={[
                      { key: "Auto Height", label: "Auto Height" },
                      { key: "Fixed Height", label: "Fixed Height" },
                      { key: "Fullscreen", label: "Fullscreen" },
                    ]}
                  />
                }
                placement="bottomRight"
                trigger={["click"]}
              >
                <Tooltip title="Display Options">
                  <Button icon={<ColumnHeightOutlined />} />
                </Tooltip>
              </Dropdown>
              </div>
            <div className="col-6">  
           
           <Button
             type="primary"
             icon={<PlusOutlined />}
             onClick={() => AddnewModal(null)}
           >
             Add New Category
           </Button></div>

        
              
              <GlobalModal
                visible={isModalVisible}
                title={editingRecord && editingRecord.categoryId ? 'Edit Category' : 'Add New Category'}
                onCancel={() => setIsModalVisible(false)}
                initialValues={editingRecord}
                fields={modalFields}
                width={800} 
   
/>
            </Space>
            </div>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="Loading category data..." />
        </div>
      ) : error ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          Error loading data: {error}
          <div style={{ marginTop: '10px' }}>
            <Button onClick={handleRefreshData}>Try Again</Button>
          </div>
        </div>
      ) : (
        <div 
          id="myGrid" 
          className="ag-theme-alpine" 
          style={{
            height: screenSize === 'xs' ? '450px' : '500px', 
            width: '100%',
            fontSize: screenSize === 'xs' ? '12px' : '14px'
          }}
        >
          <AgGridReact
            gridOptions={gridOptions}
            columnDefs={columnDefs}
            ref={gridRef}
            rowData={filteredData}
            defaultColDef={defaultColDef}
            pagination={true}
            popupParent={popupParent}
            paginationPageSize={screenSize === 'xs' ? 5 : 10}
            paginationPageSizeSelector={[5, 10, 20, 50, 100]}
            domLayout='normal'
            suppressCellFocus={true}
            animateRows={true}
            enableCellTextSelection={true}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}    
            localeText={{
              itemsPerPage: 'Size',
              page: 'Page',
              more: 'More',
              to: 'to',
              of: 'of',
              next: 'Next',
              last: 'Last',
              first: 'First',
              previous: 'Previous',
              loadingOoo: 'Loading...',
            }}
            onGridReady={params => {
              params.api.sizeColumnsToFit();
              // Set smaller row height for mobile
              if (screenSize === 'xs') {
                params.api.setGridOption('rowHeight', 40);
              }
            }}
            onFirstDataRendered={params => {
              params.api.sizeColumnsToFit();
            }}
            overlayNoRowsTemplate="<span style='padding: 20px; display: inline-block;'>No categories found matching your search criteria</span>"
          />
        </div>
      )}
     
    </div>
  );
};

export default Categorydetail;

const root = createRoot(document.getElementById("root"));
root.render(<Categorydetail />);