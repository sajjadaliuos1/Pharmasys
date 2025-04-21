import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import { PlusOutlined } from '@ant-design/icons';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Category modal component
const CategoryFormModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New Category"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      width={500}
      zIndex={1001} // Higher z-index than parent modal
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Product Form Modal component
const ProductFormModal = ({ visible, onCancel, onSubmit, initialValues, categories, addCategory }) => {
  const [form] = Form.useForm();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleAddCategory = (values) => {
    addCategory(values);
    setCategoryModalVisible(false);
  };

  return (
    <>
      <Modal
        title={initialValues?.id ? "Edit Product" : "Add New Product"}
        open={visible}
        onCancel={() => {
          form.resetFields();
          onCancel();
        }}
        onOk={() => form.submit()}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onSubmit(values);
            form.resetFields();
          }}
          initialValues={initialValues || {}}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select category"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ padding: '8px', borderTop: '1px solid #e8e8e8' }}>
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setCategoryModalVisible(true)}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      Add New Category
                    </Button>
                  </div>
                </>
              )}
            >
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <CategoryFormModal
        visible={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onSubmit={handleAddCategory}
      />
    </>
  );
};

// Main Product Detail component
const Productdetail = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Tablets' },
    { id: 2, name: 'Syrup' },
    { id: 3, name: 'Injection' },
  ]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Column definitions
  const columnDefs = [
    {
      field: 'name',
      headerName: 'Product Name',
      // Do not use enableRowGroup if you don't have enterprise modules registered
    },
    {
      field: 'categoryName',
      headerName: 'Category',
    },
    {
      field: 'price',
      headerName: 'Price',
      valueFormatter: params => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'stock',
      headerName: 'Stock',
    },
    {
      headerName: 'Actions',
      cellRenderer: params => (
        <div>
          <Button
            type="link"
            onClick={() => handleEditProduct(params.data)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
        </div>
      ),
      width: 120,
    }
  ];

  // Load initial data
  useEffect(() => {
    // Simulate API call
    const sampleData = [
      { id: 1, name: 'Paracetamol', categoryId: 1, categoryName: 'Tablets', price: 5.99, stock: 100 },
      { id: 2, name: 'Amoxicillin', categoryId: 1, categoryName: 'Tablets', price: 12.50, stock: 80 },
      { id: 3, name: 'Cough Syrup', categoryId: 2, categoryName: 'Syrup', price: 8.75, stock: 50 },
    ];
    setRowData(sampleData);
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setProductModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  const handleProductSubmit = (values) => {
    const selectedCategory = categories.find(cat => cat.id === values.categoryId);
    const updatedProduct = {
      ...values,
      categoryName: selectedCategory?.name,
    };

    if (selectedProduct) {
      // Edit existing product
      const updatedData = rowData.map(item => 
        item.id === selectedProduct.id ? { ...item, ...updatedProduct } : item
      );
      setRowData(updatedData);
      message.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...updatedProduct,
      };
      setRowData([...rowData, newProduct]);
      message.success('Product added successfully');
    }

    setProductModalVisible(false);
  };

  const handleAddCategory = (values) => {
    const newCategory = {
      id: Date.now(),
      name: values.name,
      description: values.description,
    };
    setCategories([...categories, newCategory]);
    message.success('Category added successfully');
  };

  // AG Grid options
  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true,
    resizable: true,
  };

  const gridOptions = {
    suppressMenuHide: true,
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Product Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          Add Product
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
          pagination={true}
          paginationPageSize={10}
          rowSelection="single"
        />
      </div>

      <ProductFormModal
        visible={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        onSubmit={handleProductSubmit}
        initialValues={selectedProduct}
        categories={categories}
        addCategory={handleAddCategory}
      />
    </div>
  );
};

export default Productdetail;