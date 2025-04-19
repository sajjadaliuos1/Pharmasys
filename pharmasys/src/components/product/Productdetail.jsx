import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { ExcelExportModule } from "ag-grid-enterprise";
import { DownloadOutlined, ReloadOutlined, TableOutlined } from "@ant-design/icons";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import {
  Modal,
  Form,
  Input as AntInput,
  Button,
  Select,
  Tooltip,
  Dropdown,
  Menu,
  message,
  Spin,
  Switch,
} from "antd";
import {
  ColumnHeightOutlined,
} from "@ant-design/icons";

ModuleRegistry.registerModules([
  TextFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule,
  ExcelExportModule,
]);

const Productdetail = () => {
  const gridRef = useRef(null);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []); // Make grid take full height
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [paginationPageSize, setPaginationPageSize] = useState(10); // Default page size
  const [paginationEnabled, setPaginationEnabled] = useState(false); // Pagination disabled by default

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

  // Fetch data from API
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pos.idotsolution.com/api/Sale/getAllInvoice');
      console.log('response:', response.data.data);
      if (response.data && response.data.data) {
        const invoices = response.data.data;
        setRowData(invoices);
        setTotalRecords(invoices.length);
        messageApi.success('Data loaded successfully');
      } else {
        setRowData([]);
        setError("No data returned from API");
        messageApi.warning('No invoice data available');
      }
    } catch (err) {
      setError(err.message);
      messageApi.error(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchInvoiceData();
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Invoice ID",
        field: "invoiceId",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        headerName: "Invoice No",
        field: "invoiceNo",
        sortable: true,
        filter: true,
        width: 140,
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
        width: 140,
      },
      {
        headerName: "Date",
        field: "date",
        sortable: true,
        filter: true,
        width: 120,
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString();
        }
      },
      {
        headerName: "Total Amount",
        field: "totalAmount",
        sortable: true,
        filter: "agNumberColumnFilter",
        width: 150,
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
        width: 150,
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
        width: 120,
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
        width: 140,
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
        width: 120,
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
      }
    ],
    []
  );

  const handlePageSizeChange = (newSize) => {
    setPaginationPageSize(newSize);
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationSetPageSize(newSize);
      gridRef.current.api.paginationGoToFirstPage();
      // Force a re-render or update of the grid view
      gridRef.current.api.redrawRows();
      setTimeout(() => updateRowCountDisplay(), 0);
    }
  };

  // Toggle pagination
  const togglePagination = (checked) => {
    setPaginationEnabled(checked);
    messageApi.info(`Pagination ${checked ? 'enabled' : 'disabled'}`);
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption('pagination', checked); // Enable/disable pagination in the grid
      if (checked) {
        gridRef.current.api.paginationGoToFirstPage(); // Go to the first page when enabled
      }
    }
    setTimeout(() => updateRowCountDisplay(), 0);
  };

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
    const columns = columnDefs.map((col) => col.headerName || col.field);
    const rows = rowData.map((row) =>
      columnDefs.map((col) => {
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
    }),
    []
  );

  const popupParent = useMemo(() => document.body, []);

  const updateRowCountDisplay = useCallback(() => {
    if (!gridRef.current) return;
    const visible = gridRef.current.api.getDisplayedRowCount(); 
    const total = totalRecords;
    document.querySelector("#currentRowCount").textContent = `${visible} row${
      visible !== 1 ? "s" : ""
    } out of ${total}`;
  }, [totalRecords]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const onGridReady = useCallback((params) => {
    // Set initial sorting to show newest invoices first
    params.columnApi.applyColumnState({
      state: [
        { colId: 'date', sort: 'desc' }
      ]
    });
    updateRowCountDisplay();
  }, [updateRowCountDisplay]);

  const setAutoHeight = useCallback(() => {
    gridRef.current.api.setGridOption("domLayout", "autoHeight");
    document.querySelector("#myGrid").style.height = "";
  }, []);

  const setFixedHeight = useCallback(() => {
    gridRef.current.api.setGridOption("domLayout", "normal");
    document.querySelector("#myGrid").style.height = "600px";
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

  const onSearch = (e) => {
    const value = e.target.value.trim();
    setSearchText(value);

    // Trigger the external filter
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.onFilterChanged();
      setTimeout(() => updateRowCountDisplay(), 0);
    }
  };

  return (
    <div>
      {contextHolder}
      <div
        className="control-panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "15px",
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h2 style={{ margin: 0 }}>Invoice Management</h2>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefreshData}
            loading={loading}
            title="Refresh Data"
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <AntInput
            placeholder="Search Invoice ID or No..."
            value={searchText}
            onChange={onSearch}
            style={{ width: 200 }}
            allowClear
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Tooltip title="Toggle Pagination">
              <div style={{ display: "flex", alignItems: "center" }}>
                <TableOutlined style={{ marginRight: "5px" }} />
                <Switch
                  checked={paginationEnabled}
                  onChange={togglePagination}
                  size="small"
                />
              </div>
            </Tooltip>
          </div>

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

          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            New Invoice
          </Button>
        </div>
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
        <div id="myGrid" style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            popupParent={popupParent}
            onGridReady={onGridReady}
            rowSelection="multiple"
            isExternalFilterPresent={isExternalFilterPresent}
         
            doesExternalFilterPass={doesExternalFilterPass}
            onFilterChanged={updateRowCountDisplay}
            pagination={paginationEnabled}
            paginationPageSize={paginationPageSize}
            domLayout={paginationEnabled ? 'normal' : 'autoHeight'} // Adjust domLayout based on pagination
            animateRows={true}
            enableCellTextSelection={true}
          />
        </div>
      )}
      
      <div
        style={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span id="currentRowCount">0 rows out of 0</span>
        </div>
        {paginationEnabled && (
          <div className="pagination-controls" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Rows per page:</span>
            <Select
              value={paginationPageSize}
              onChange={handlePageSizeChange}
              style={{ width: 80 }}
              options={[
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 30, label: '30' },
                { value: 50, label: '50' },
                { value: 100, label: '100' },
              ]}
            />
          </div>
        )}
      </div>

      <Modal
        title="Create New Invoice"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
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
          <Form.Item 
            label="Total Amount" 
            name="totalAmount" 
            rules={[{ required: true, message: 'Please enter total amount' }]}
          >
            <AntInput type="number" prefix="$" />
          </Form.Item>
          <Form.Item 
            label="Payment Received" 
            name="paid" 
            rules={[{ required: true, message: 'Please enter payment received' }]}
          >
            <AntInput type="number" prefix="$" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Invoice
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Productdetail;

const root = createRoot(document.getElementById("root"));
root.render(<Productdetail />);