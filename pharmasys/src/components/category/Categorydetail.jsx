import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "../common/style.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ExcelExportModule } from "ag-grid-enterprise";
import { ModuleRegistry } from 'ag-grid-community';
import GlobalModal from "../customhooks/GlobalModal";
import CustomSelect from "../customhooks/CustomSelect";
import { RowGroupingModule, PivotModule, TreeDataModule, ServerSideRowModelModule, SetFilterModule } from 'ag-grid-enterprise';
import { AllCommunityModule } from "ag-grid-community";
import { Modal, Form, Spin, message, Button } from "antd";
import useScreenSize from '../common/useScreenSize';
import { useTableHeader } from '../common/useTableHeader';
import ActionCellRenderer from '../common/ActionCellRenderer';
import { CategoriesDetails } from "../../components/APi/CategoryApi";
ModuleRegistry.registerModules([
  AllCommunityModule, 
  ExcelExportModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule
]);
const Categorydetail = () => {
  const [rowData, setRowData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const gridRef = useRef(null);
  const screenSize = useScreenSize(gridRef);
  // Define fetchInvoiceData first so it can be used in handleRefreshData
  const fetchInvoiceData = async () => {
    setLoading(true);
    try {
      const response = await CategoriesDetails(); // Use global API function
      console.log('API Response:', response.data.data);
      const data = response.data.data;
      setRowData(data);
      setFilteredData(data);
      messageApi.success('Data loaded successfully');
    } catch (err) {
      setError(err.message);
      messageApi.error(`Failed to fetch data: ${err.message}`);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  // Define all handlers before they're used
  const handleRefreshData = useCallback(() => {
    fetchInvoiceData();
  }, []);
  const handleExportPDF = useCallback(() => {
    const fileName = prompt("Enter file name for PDF:", "category-data");
    if (!fileName) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Category Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    const visibleCols = columnDefs.filter(col => !col.hide && col.field !== 'actions');
    const columns = visibleCols.map((col) => col.headerName || col.field);
    const rows = rowData.map((row) =>
      visibleCols.map((col) => row[col.field] || "")
    );

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    doc.save(`${fileName}.pdf`);
  }, [rowData]);

  const handleExportExcel = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsExcel({
        fileName: 'category-data.xlsx',
        sheetName: 'Categories'
      });
    }
  }, []);

  const setAutoHeight = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("domLayout", "autoHeight");
      const gridElement = document.querySelector("#myGrid");
      if (gridElement) {
        gridElement.style.height = "";
      }
    }
  }, []);

  const setFixedHeight = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption("domLayout", "normal");
      const gridElement = document.querySelector("#myGrid");
      if (gridElement) {
        gridElement.style.height = "500px";
      }
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const handleTableSizeChange = useCallback(({ key }) => {
    messageApi.info(`Table layout set to: ${key}`);
    switch(key) {
      case "Auto Height": setAutoHeight(); break;
      case "Fixed Height": setFixedHeight(); break;
      case "Fullscreen": handleFullscreen(); break;
      default: break;
    }
  }, [messageApi, setAutoHeight, setFixedHeight, handleFullscreen]);

  const AddnewModal = useCallback((record) => {
    setEditingRecord(record ? { ...record } : { categoryId: '', category: '' });
    setIsModalVisible(true);
  }, []);

  // Action handlers
  const handleEdit = useCallback((data) => {
    AddnewModal(data);
  }, [AddnewModal]);

  const handleDelete = useCallback((data) => {
    console.log("Delete category:", data);
    // Add your delete API call here
    messageApi.success('Category deleted successfully');
  }, [messageApi]);

  // Now we can safely use all the handlers in useTableHeader
  const { renderMobileHeader, renderDesktopHeader } = useTableHeader({
    title: "Category Management",
    onRefresh: handleRefreshData,
    onExportExcel: handleExportExcel,
    onExportPDF: handleExportPDF,
    onAddNew: () => AddnewModal(null),
    onTableSizeChange: handleTableSizeChange,
    onSearchChange: (e) => setSearchText(e.target.value),
    searchText,
    rowData,
    screenSize
  });

  // Get column definitions
  const getColumnDefs = useCallback(() => {
    return [
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
        cellRenderer: (params) => (
          <ActionCellRenderer 
            data={params.data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isUpdate={false} 
            editTooltip="Edit category"
            deleteTooltip="Delete category"
            deleteConfirmText="Are you sure you want to delete this category?"
          />
        ),
        suppressSizeToFit: true,
      }
    ];
  }, [screenSize, handleEdit, handleDelete]);
  
  const columnDefs = useMemo(() => getColumnDefs(), [getColumnDefs]);
  
  const defaultColDef = useMemo(() => ({
    enableRowGroup: true,
    enableValue: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: false
  }), []);

  const popupParent = useMemo(() => document.body, []);
  
  // Effect hooks
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
    
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.onFilterChanged();
    }
  }, [searchText, rowData]);

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
      component: <CustomSelect />,
    }
  ];
  
  return (
    <div className="category-management-container" style={{ padding: '10px', maxWidth: '100%' }}>
      {contextHolder}
      {/* Render appropriate header based on screen size */}
      {screenSize === 'xs' || screenSize === 'sm' ? renderMobileHeader() : renderDesktopHeader()}
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
            gridOptions={{ suppressMenuHide: true }}
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
            onGridReady={params => {
              params.api.sizeColumnsToFit();
              if (screenSize === 'xs') {
                params.api.setGridOption('rowHeight', 40);
              }
            }}
            onFirstDataRendered={params => params.api.sizeColumnsToFit()}
            overlayNoRowsTemplate="<span style='padding: 20px; display: inline-block;'>No categories found matching your search criteria</span>"
          />
        </div>
      )}
      <GlobalModal
        visible={isModalVisible}
        title={editingRecord?.categoryId ? 'Edit Category' : 'Add New Category'}
        onCancel={() => setIsModalVisible(false)}
        initialValues={editingRecord}
        fields={modalFields}
        width={800}
      />
    </div>
  );
};
export default Categorydetail;