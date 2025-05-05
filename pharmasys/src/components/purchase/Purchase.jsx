import React, { useCallback, useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "../common/style.css";
import { ExcelExportModule } from "ag-grid-enterprise";
import { ModuleRegistry } from 'ag-grid-community';
import { RowGroupingModule, PivotModule, TreeDataModule, ServerSideRowModelModule, SetFilterModule } from 'ag-grid-enterprise';
import { AllCommunityModule } from "ag-grid-community";
import {
  Form, Input, Button, Tooltip, message, Spin, Space, Row, Col, Card, DatePicker, Typography, Divider,
  Tabs, Table, Tag, Statistic, Select, InputNumber, Modal
} from "antd";
import {
  DeleteOutlined, PlusOutlined, DownloadOutlined, ReloadOutlined, EditOutlined, SaveOutlined,
  CloseOutlined, FileExcelOutlined, PrinterOutlined, SearchOutlined, InfoCircleOutlined,
  CheckCircleOutlined, ShoppingCartOutlined, BarcodeOutlined, CalendarOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

ModuleRegistry.registerModules([
  AllCommunityModule, ExcelExportModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  ServerSideRowModelModule,
  SetFilterModule
]);

const Purchase = () => {
  const [form] = Form.useForm();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [products, setProducts] = useState([
    { id: 1, name: "Paracetamol 500mg", category: "Medicine" },
    { id: 2, name: "Ibuprofen 400mg", category: "Medicine" },
    { id: 3, name: "Bandage (Large)", category: "First Aid" },
    { id: 4, name: "Thermometer", category: "Equipment" }
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "" });
  const gridRef = useRef();

  // Update summary stats whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);
    setTotalCartValue(total);
    setTotalItems(cartItems.length);
  }, [cartItems]);

  // Column definitions for the AG Grid
  const columnDefs = [
    { 
      headerName: 'S.No', 
      width: 60,
      valueGetter: (params) => {
        return params.node.rowIndex + 1;
      },
      cellStyle: { fontWeight: 'bold' }
    },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'batchNo', headerName: 'Batch No', width: 100 },
    { field: 'barcode', headerName: 'Barcode', width: 120 },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 90,
      cellStyle: params => ({
        fontWeight: 'bold',
        color: params.value <= 5 ? '#ff4d4f' : 'inherit'
      })
    },
    { 
      field: 'purchaseRate', 
      headerName: 'Purchase Rate', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2)
    },
    { 
      field: 'purchaseDiscount', 
      headerName: 'Purchase Disc %', 
      width: 130,
      valueFormatter: params => params.value + '%',
      cellStyle: params => ({
        color: params.value > 0 ? '#52c41a' : 'inherit'
      })
    },
    { 
      field: 'finalPurchaseRate', 
      headerName: 'Final Purchase Rate', 
      width: 150,
      valueFormatter: params => params.value.toFixed(2),
      cellStyle: { fontWeight: 'bold' }
    },
    { 
      field: 'saleRate', 
      headerName: 'Sale Rate', 
      width: 100,
      valueFormatter: params => params.value.toFixed(2)
    },
    { 
      field: 'saleDiscount', 
      headerName: 'Sale Disc %', 
      width: 110,
      valueFormatter: params => params.value + '%',
      cellStyle: params => ({
        color: params.value > 0 ? '#52c41a' : 'inherit'
      })
    },
    { 
      field: 'finalSaleRate', 
      headerName: 'Final Sale Rate', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2)
    },
    { 
      field: 'minSaleRate', 
      headerName: 'Min Sale Rate', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2),
      cellStyle: params => ({
        color: params.value < params.data.finalSaleRate ? '#ff4d4f' : 'inherit'
      })
    },
    { 
      field: 'perStripRate', 
      headerName: 'Per Strip Rate', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2)
    },
    { 
      field: 'minStripSaleRate', 
      headerName: 'Min Strip Rate', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2)
    },
    { 
      field: 'manufactureDate', 
      headerName: 'Mfg Date', 
      width: 110,
      valueFormatter: params => {
        return dayjs(params.value).format('DD-MM-YYYY');
      }
    },
    { 
      field: 'expireDate', 
      headerName: 'Exp Date', 
      width: 110,
      valueFormatter: params => {
        return dayjs(params.value).format('DD-MM-YYYY');
      },
      cellStyle: params => {
        const today = dayjs();
        const expDate = dayjs(params.value);
        const diffInDays = expDate.diff(today, 'day');
        
        if (diffInDays < 0) {
          return { color: '#ff4d4f', fontWeight: 'bold', backgroundColor: '#fff1f0' }; // Expired
        } else if (diffInDays < 30) {
          return { color: '#faad14', fontWeight: 'bold' }; // About to expire
        }
        return {};
      }
    },
    { 
      field: 'totalAmount', 
      headerName: 'Total Amount', 
      width: 120,
      valueFormatter: params => params.value.toFixed(2),
      cellStyle: { fontWeight: 'bold' }
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(params.data)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => removeItem(params.data.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Default column properties
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    autoHeight: true,
  };

  // Function to handle edit
  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentItemId(item.id);
    
    form.setFieldsValue({
      productName: item.productName,
      category: item.category,
      batchNo: item.batchNo,
      barcode: item.barcode,
      quantity: item.quantity,
      purchaseRate: item.purchaseRate,
      purchaseDiscount: item.purchaseDiscount,
      saleRate: item.saleRate,
      saleDiscount: item.saleDiscount,
      minSaleRate: item.minSaleRate,
      perStripRate: item.perStripRate,
      minStripSaleRate: item.minStripSaleRate,
      manufactureDate: dayjs(item.manufactureDate),
      expireDate: dayjs(item.expireDate)
    });
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Function to cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentItemId(null);
    form.resetFields();
  };

  // Calculate derived values based on form values
  const calculateDerivedValues = (values) => {
    // Calculate final purchase rate after discount
    const finalPurchaseRate = values.purchaseRate - (values.purchaseRate * (values.purchaseDiscount / 100));
    
    // Calculate final sale rate after discount
    const finalSaleRate = values.saleRate - (values.saleRate * (values.saleDiscount / 100));
    
    // Calculate per strip rate (assuming 10 items per strip - adjust as needed)
    const perStripRate = finalSaleRate * 10;
    
    return {
      finalPurchaseRate: parseFloat(finalPurchaseRate.toFixed(2)),
      finalSaleRate: parseFloat(finalSaleRate.toFixed(2)),
      perStripRate: parseFloat(perStripRate.toFixed(2)),
      minStripSaleRate: values.minSaleRate * 10,
      totalAmount: parseFloat((values.quantity * finalPurchaseRate).toFixed(2))
    };
  };

  // Function to add item to cart
  const addToCart = () => {
    form.validateFields().then(values => {
      const { finalPurchaseRate, finalSaleRate, perStripRate, minStripSaleRate, totalAmount } = calculateDerivedValues(values);
      
      // Validate that min sale rate is not less than final sale rate
      if (values.minSaleRate < finalSaleRate) {
        message.error('Minimum sale rate cannot be less than final sale rate');
        return;
      }
      
      const newItem = {
        id: Date.now(), // Generate a unique ID
        productName: values.productName,
        category: values.category,
        batchNo: values.batchNo,
        barcode: values.barcode,
        quantity: values.quantity,
        purchaseRate: values.purchaseRate,
        purchaseDiscount: values.purchaseDiscount,
        finalPurchaseRate,
        saleRate: values.saleRate,
        saleDiscount: values.saleDiscount,
        finalSaleRate,
        minSaleRate: values.minSaleRate,
        perStripRate,
        minStripSaleRate,
        manufactureDate: values.manufactureDate.format('YYYY-MM-DD'),
        expireDate: values.expireDate.format('YYYY-MM-DD'),
        totalAmount
      };

      setCartItems(prevItems => [...prevItems, newItem]);
      message.success({
        content: 'Item added to cart successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
      form.resetFields();
    }).catch(error => {
      message.error('Please fill all required fields',error);
    });
  };

  // Function to update existing item
  const updateItem = () => {
    form.validateFields().then(values => {
      const { finalPurchaseRate, finalSaleRate, perStripRate, minStripSaleRate, totalAmount } = calculateDerivedValues(values);
      
      // Validate that min sale rate is not less than final sale rate
      if (values.minSaleRate < finalSaleRate) {
        message.error('Minimum sale rate cannot be less than final sale rate');
        return;
      }
      
      setCartItems(prevItems => 
        prevItems.map(item => {
          if (item.id === currentItemId) {
            return {
              ...item,
              productName: values.productName,
              category: values.category,
              batchNo: values.batchNo,
              barcode: values.barcode,
              quantity: values.quantity,
              purchaseRate: values.purchaseRate,
              purchaseDiscount: values.purchaseDiscount,
              finalPurchaseRate,
              saleRate: values.saleRate,
              saleDiscount: values.saleDiscount,
              finalSaleRate,
              minSaleRate: values.minSaleRate,
              perStripRate,
              minStripSaleRate,
              manufactureDate: values.manufactureDate.format('YYYY-MM-DD'),
              expireDate: values.expireDate.format('YYYY-MM-DD'),
              totalAmount
            };
          }
          return item;
        })
      );
      
      message.success({
        content: 'Item updated successfully',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
      setEditMode(false);
      setCurrentItemId(null);
      form.resetFields();
    }).catch(error => {
      message.error('Please fill all required fields',error);
    });
  };

  // Function to remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      return updatedItems;
    });
    message.success({
      content: 'Item removed successfully',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
    
    // If the deleted item was being edited, cancel edit mode
    if (id === currentItemId) {
      handleCancelEdit();
    }
  };

  // Function to export to Excel
  const onExportClick = useCallback(() => {
    if (cartItems.length === 0) {
      message.warning('No items to export');
      return;
    }
    gridRef.current.api.exportDataAsExcel({
      fileName: `Purchase_Report_${dayjs().format('YYYY-MM-DD')}`
    });
    message.success('Exported to Excel successfully');
  }, [cartItems]);

  // Function to refresh the grid
  const refreshGrid = () => {
    gridRef.current.api.refreshCells();
    message.info('Grid refreshed');
  };

  // Function to handle barcode scan
  const handleBarcodeScan = () => {
    // In a real app, this would interface with a barcode scanner
    // For demo purposes, we'll simulate finding a product by barcode
    const foundProduct = products.find(p => p.barcode === form.getFieldValue('barcode'));
    if (foundProduct) {
      form.setFieldsValue({
        productName: foundProduct.name,
        category: foundProduct.category
      });
      message.success('Product found by barcode');
    } else {
      message.warning('No product found with this barcode');
    }
  };

  // Function to add new product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      message.error('Please enter both product name and category');
      return;
    }
    
    const newProductObj = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category
    };
    
    setProducts([...products, newProductObj]);
    setNewProduct({ name: "", category: "" });
    setShowProductModal(false);
    message.success('Product added successfully');
    
    // Set the newly added product in the form
    form.setFieldsValue({
      productName: newProductObj.name,
      category: newProductObj.category
    });
  };

  return (
    <div className="purchase-management-container" style={{ padding: '20px', maxWidth: '100%', backgroundColor: '#f0f2f5' }}>
      <Card
        className="header-card"
        style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col md={12} lg={12}>
            <Space align="center">
              <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={3} style={{ margin: 0 }}>Purchase Management</Title>
            </Space>
          </Col>
          <Col md={12} lg={12} style={{ textAlign: 'right' }}>
            <Space>
              <Tooltip title="Export to Excel">
                <Button type="primary" icon={<FileExcelOutlined />} onClick={onExportClick}>Export</Button>
              </Tooltip>
              <Tooltip title="Print">
                <Button icon={<PrinterOutlined />}>Print</Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <Button icon={<ReloadOutlined />} onClick={refreshGrid}>Refresh</Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Card 
            title={
              <Space>
                {editMode ? <EditOutlined style={{ color: '#1890ff' }} /> : <PlusOutlined style={{ color: '#52c41a' }} />}
                <span>{editMode ? 'Edit Purchase Item' : 'Add Purchase Item'}</span>
              </Space>
            } 
            style={{ 
              marginBottom: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
            }}
            extra={
              editMode && (
                <Button 
                  type="text" 
                  danger 
                  icon={<CloseOutlined />} 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              name="purchase_form"
              initialValues={{ purchaseDiscount: 0, saleDiscount: 0 }}
            >
              {/* Product Information Section */}
              <Divider orientation="left" plain>Product Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category">
                      <Option value="Medicine">Medicine</Option>
                      <Option value="First Aid">First Aid</Option>
                      <Option value="Equipment">Equipment</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="productName"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please select product' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select product"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '4px 0' }} />
                          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={() => setShowProductModal(true)}
                            >
                              Add new product
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {products.map(product => (
                        <Option key={product.id} value={product.name}>
                          {product.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label=" ">
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={() => setShowProductModal(true)}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="batchNo"
                    label="Batch No"
                    rules={[{ required: true, message: 'Please enter batch number' }]}
                  >
                    <Input placeholder="Enter batch number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="barcode"
                    label="Barcode"
                    rules={[{ required: true, message: 'Please enter barcode' }]}
                  >
                    <Input 
                      prefix={<BarcodeOutlined className="site-form-item-icon" />}
                      placeholder="Enter barcode" 
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label=" ">
                    <Button 
                      type="primary" 
                      icon={<BarcodeOutlined />} 
                      onClick={handleBarcodeScan}
                    >
                      Scan
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Form.Item
                    name="manufactureDate"
                    label="Manufacture Date"
                    rules={[{ required: true, message: 'Please select manufacture date' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="DD-MM-YYYY" 
                      placeholder="Select manufacture date"
                      prefix={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="expireDate"
                    label="Expire Date"
                    rules={[{ required: true, message: 'Please select expire date' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="DD-MM-YYYY" 
                      placeholder="Select expire date"
                      prefix={<CalendarOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={1} 
                      placeholder="Enter quantity" 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              {/* Purchase Information Section */}
              <Divider orientation="left" plain>Purchase Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="purchaseRate"
                    label="Purchase Rate"
                    rules={[{ required: true, message: 'Please enter purchase rate' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0} 
                      step="0.01" 
                      precision={2}
                      placeholder="Enter purchase rate" 
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="purchaseDiscount"
                    label="Purchase Discount %"
                    initialValue={0}
                    rules={[{ required: true, message: 'Please enter discount' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0} 
                      max={100} 
                      step="0.01" 
                      placeholder="Enter discount %" 
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace('%', '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="finalPurchaseRate"
                    label="Final Purchase Rate"
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      disabled
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              {/* Sale Information Section */}
              <Divider orientation="left" plain>Sale Information</Divider>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="saleRate"
                    label="Sale Rate"
                    rules={[{ required: true, message: 'Please enter sale rate' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0} 
                      step="0.01" 
                      precision={2}
                      placeholder="Enter sale rate" 
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="saleDiscount"
                    label="Sale Discount %"
                    initialValue={0}
                    rules={[{ required: true, message: 'Please enter sale discount' }]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0} 
                      max={100} 
                      step="0.01" 
                      placeholder="Enter sale discount %" 
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace('%', '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="finalSaleRate"
                    label="Final Sale Rate"
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      disabled
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="minSaleRate"
                    label="Minimum Sale Rate"
                    rules={[
                      { required: true, message: 'Please enter min sale rate' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const finalSaleRate = getFieldValue('finalSaleRate');
                          if (!value || value >= finalSaleRate) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Minimum sale rate cannot be less than final sale rate'));
                        },
                      }),
                    ]}
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      min={0} 
                      step="0.01" 
                      precision={2}
                      placeholder="Enter min sale rate" 
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="perStripRate"
                    label="Per Strip Rate"
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      disabled
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="minStripSaleRate"
                    label="Minimum Strip Rate"
                  >
                    <InputNumber 
                      style={{ width: '100%' }}
                      disabled
                      formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                {editMode ? (
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={updateItem}
                    >
                      Update Item
                    </Button>
                    <Button 
                      danger 
                      icon={<CloseOutlined />} 
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Space>
                ) : (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card 
            title="Purchase Summary" 
            style={{ 
              marginBottom: '20px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic 
                  title="Total Purchase Value" 
                  value={totalCartValue} 
                  precision={2} 
                  prefix="$"
                  valueStyle={{ color: '#3f8600' }} 
                />
              </Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic 
                  title="Total Items" 
                  value={totalItems}
                  valueStyle={{ color: '#1890ff' }} 
                />
              </Col>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text type="secondary">Last Updated</Text>
                <div>{dayjs().format('DD-MM-YYYY HH:mm:ss')}</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <Space>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} />
            <span>Purchase Items</span>
            {cartItems.length > 0 && <Tag color="blue">{cartItems.length}</Tag>}
        </Space>
        }
        extra={
          <Space>
            <Input.Search
              placeholder="Search items"
              allowClear
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              onSearch={(value) => {
                gridRef.current.api.setQuickFilter(value);
              }}
            />
            <Tooltip title="Refresh Grid">
              <Button icon={<ReloadOutlined />} onClick={refreshGrid} />
            </Tooltip>
          </Space>
        }
        style={{ 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
        }}
      >
        <div className="grid-container" style={{ width: '100%', height: '500px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : (
            <AgGridReact
              ref={gridRef}
              rowData={cartItems}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              rowSelection="multiple"
              pagination={true}
              paginationAutoPageSize={true}
              getRowId={(params) => params.data.id}
              domLayout="autoHeight"
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              rowStyle={{ cursor: 'pointer' }}
              rowClass="ag-row-hover"
              overlayNoRowsTemplate="<span>No purchase items added yet</span>"
            />
          )}
        </div>
      </Card>

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        visible={showProductModal}
        onOk={handleAddProduct}
        onCancel={() => setShowProductModal(false)}
        okText="Add Product"
      >
        <Form layout="vertical">
          <Form.Item
            label="Product Name"
            required
          >
            <Input
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Enter product name"
            />
          </Form.Item>
          <Form.Item
            label="Category"
            required
          >
            <Select
              value={newProduct.category}
              onChange={(value) => setNewProduct({...newProduct, category: value})}
              placeholder="Select category"
            >
              <Option value="Medicine">Medicine</Option>
              <Option value="First Aid">First Aid</Option>
              <Option value="Equipment">Equipment</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Purchase;

const root = createRoot(document.getElementById("root"));
root.render(<Purchase />);