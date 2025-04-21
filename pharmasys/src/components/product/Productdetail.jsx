import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ExcelExportModule } from "ag-grid-enterprise";
import { ModuleRegistry } from 'ag-grid-community';
import { 
  RowGroupingModule, 
  PivotModule, 
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule
} from 'ag-grid-enterprise';
import { DownloadOutlined, ReloadOutlined, TableOutlined, MenuOutlined } from "@ant-design/icons";
import {
  AllCommunityModule,
 
} from "ag-grid-community";

import {
  Modal,
  Form,
  Input as AntInput,
  Button,
  
  Tooltip,
  Dropdown,
  Menu,
  message,
  Spin,
  
  Space,
 
  Row,
  Col,
} from "antd";
import {
  ColumnHeightOutlined,
  SearchOutlined,
  PlusOutlined,
  
} from "@ant-design/icons";

ModuleRegistry.registerModules([
  AllCommunityModule, ExcelExportModule,
  RowGroupingModule,
  PivotModule, 
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule
]);
ModuleRegistry.registerModules([
  
]);
const rowSelection = {
  mode: "multiRow",
  headerCheckbox: true,
};

const ActionCellRenderer = (params) => {
  const handleEdit = () => {
    console.log("Edit invoice:", params.data);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log("Delete invoice:", params.data);
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

const Productdetail = () => {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [screenSize, setScreenSize] = useState('large');
  

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

  // Custom filter function that only filters by invoiceId and invoiceNo
  const isExternalFilterPresent = useCallback(() => {
    return searchText.length > 0;
  }, [searchText]);

  // Filter function that checks if either invoiceId or invoiceNo contains the search text
  const doesExternalFilterPass = useCallback(
    (node) => {
      if (searchText.length === 0) {
        return true;
      }

      const lowerSearchText = searchText.toLowerCase();
      const invoiceId = node.data.invoiceId ? node.data.invoiceId.toString().toLowerCase() : "";
      const invoiceNo = node.data.invoiceNo ? node.data.invoiceNo.toString().toLowerCase() : "";

      // Return true if either field contains the search text (OR logic)
      return invoiceId.includes(lowerSearchText) || invoiceNo.includes(lowerSearchText);
    },
    [searchText]
  );
  const gridOptions = {
    suppressMenuHide: true,
    
  };
  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pos.idotsolution.com/api/Sale/getAllInvoice');
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

  // First effect - only for fetching data on initial load
  useEffect(() => {
    fetchInvoiceData();
  }, []); // Empty dependency array means it only runs once on mount

  // Second effect - only for filtering data when search or rowData changes
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(rowData);
      return;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = rowData.filter(row => 
      (row.customerName && row.customerName.toLowerCase().includes(searchLower)) ||
      (row.customerContact && row.customerContact.toLowerCase().includes(searchLower)) ||
      (row.invoiceId && row.invoiceId.toString().toLowerCase().includes(searchLower)) ||
      (row.invoiceNo && row.invoiceNo.toString().toLowerCase().includes(searchLower))
    );
    
    setFilteredData(filtered);
  }, [searchText, rowData]);

  const handleRefreshData = () => {
    fetchInvoiceData();
  };

  // Adjust column definitions for responsive display
  const getColumnDefs = () => {
    const baseColumns = [
      {
        headerName: "Invoice ID",
        field: "invoiceId",
        sortable: true,
        filter: true,
        minWidth: 120,
      },
      {
        headerName: "Invoice No",
        field: "invoiceNo",
        sortable: true,
        filter: true,
        minWidth: 140,
      },
      {
        headerName: "Customer",
        field: "customerName",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Contact",
        field: "customerContact",
        sortable: true,
        filter: true,
        minWidth: 140,
        hide: screenSize === 'xs',
      },
      {
        headerName: "Date",
        field: "date",
        sortable: true,
        filter: true,
        minWidth: 120,
        hide: screenSize === 'xs' || screenSize === 'sm',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString();
        }
      },
      {
        headerName: "Total",
        field: "totalAmount",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 130,
        valueFormatter: (params) => {
          if (params.value === undefined || params.value === null) return '$0.00';
          return params.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
      },
      {
        headerName: "Net Amount",
        field: "netAmount",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 130,
        hide: screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md',
        valueFormatter: (params) => {
          if (params.value === undefined || params.value === null) return '$0.00';
          return params.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
      },
      {
        headerName: "Paid",
        field: "totalPaid",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 120,
        hide: screenSize === 'xs' || screenSize === 'sm',
        valueFormatter: (params) => {
          if (params.value === undefined || params.value === null) return '$0.00';
          return params.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
      },
      {
        headerName: "Remaining",
        field: "remainingAmount",
        sortable: true,
        filter: "agNumberColumnFilter",
        minWidth: 130,
        hide: screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md',
        valueFormatter: (params) => {
          if (params.value === undefined || params.value === null) return '$0.00';
          return params.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
      },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        filter: true,
        minWidth: 100,
        cellStyle: params => {
          if (params.value === 'Paid') {
            return { color: 'green', fontWeight: 'bold' };
          } else if (params.value === 'Unpaid') {
            return { color: 'red', fontWeight: 'bold' };
          } else if (params.value === 'Partial') {
            return { color: 'orange', fontWeight: 'bold' };
          }
          return null;
        }
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
    const fileName = prompt("Enter file name for PDF:", "invoice-data");
    if (!fileName) return;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Invoice Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Get columns and row data
    const visibleCols = columnDefs.filter(col => !col.hide && col.field !== 'actions');
    const columns = visibleCols.map((col) => col.headerName || col.field);
    const rows = rowData.map((row) =>
      visibleCols.map((col) => {
        // Format values (similar to value formatters in grid)
        if (col.field === 'date' && row[col.field]) {
          return new Date(row[col.field]).toLocaleDateString();
        }
        if (['totalAmount', 'netAmount', 'totalPaid', 'remainingAmount'].includes(col.field)) {
          const value = row[col.field];
          if (value === undefined || value === null) return '$0.00';
          return '$' + value.toFixed(2);
        }
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
        fileName: 'invoice-data.xlsx',
        sheetName: 'Invoices'
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

  const handleAddInvoice = () => {
    // Using _ as parameter name indicates it's intentionally unused
    messageApi.info('This is a demo. In a real app, this would add a new invoice.');
    setIsModalOpen(false);
    form.resetFields();
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

  return (
    <div className="invoice-management-container" style={{ padding: '10px', maxWidth: '100%' }}>
      {contextHolder}

      {/* Responsive Header Section - Restructured for Mobile */}
      <div className="mobile-header" style={{ marginBottom: '15px' }}>
        {/* Row 1: Title - full width on mobile */}
        <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
          <Col span={24}>
            <h2 style={{ margin: 0, fontSize: screenSize === 'xs' ? '18px' : '24px', textAlign: 'center' }}>
              Invoice Management
            </h2>
          </Col>
        </Row>

        {/* Row 2: Search field - full width on mobile */}
        <Row gutter={[16, 16]} style={{ marginBottom: '12px' }}>
          <Col span={18}>
            <AntInput
              placeholder="Search invoices..."
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
              onClick={() => setIsModalOpen(true)} 
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
            <h2 style={{ margin: 0 }}>Invoice Management</h2>
          </Col>
          
          <Col md={10} lg={10} style={{ textAlign: 'center' }}>
            <AntInput
              placeholder="Search invoices123..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%', maxWidth: '350px' }}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          
          <Col md={8} lg={8} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button 
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

              <Button type="primary" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
                New Invoice
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="Loading invoice data..." />
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
            rowSelection={rowSelection}
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
            overlayNoRowsTemplate="<span style='padding: 20px; display: inline-block;'>No invoices found matching your search criteria</span>"
          />
        </div>
      )}

      {/* Modal and Form */}
      <Modal
        title="Create New Invoice"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={screenSize === 'xs' ? '95%' : '520px'}
      >
        <Button type="primary" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
                New category
              </Button>
        <Form form={form} layout="vertical" onFinish={handleAddInvoice}>
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[{ required: true, message: 'Please enter contact number' }]}
          >
            <AntInput />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Total Amount" 
                name="totalAmount" 
                rules={[{ required: true, message: 'Please enter total amount' }]}
              >
                <AntInput type="number" prefix="$" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Payment Received" 
                name="paid" 
                rules={[{ required: true, message: 'Please enter payment received' }]}
              >
                <AntInput type="number" prefix="$" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Invoice
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add CSS for responsive design */}
      <style jsx global>{`
        .ag-theme-alpine {
          --ag-font-size: ${screenSize === 'xs' ? '12px' : '14px'};
          --ag-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        }
        
        .ag-theme-alpine .ag-header {
          font-weight: bold;
        }
        
        /* .ag-theme-alpine .ag-cell {
          padding-left: 8px;
          padding-right: 8px;
        } */
        
        @media (max-width: 576px) {
          .ag-theme-alpine .ag-cell {
            padding-left: 5px;
            padding-right: 5px;
          }
          
          .ag-theme-alpine .ag-header-cell-label {
            font-size: 12px;
          }
          
          /* Mobile-specific styles */
          .mobile-header h2 {
            text-align: center;
          }
        }
        
        /* Make the grid work better on mobile */
        @media (max-width: 768px) {
          .ag-header-cell-label {
            white-space: normal;
            overflow: visible;
          }
          
          .desktop-header {
            display: none;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-header {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Productdetail;

const root = createRoot(document.getElementById("root"));
root.render(<Productdetail />);