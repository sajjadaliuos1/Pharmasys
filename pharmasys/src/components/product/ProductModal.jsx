import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const ProductModal = ({ visible, onCancel, onSubmit, categories = [], subcategories = [] }) => {
  const [form] = Form.useForm();
  const [saleInStrips, setSaleInStrips] = useState(false);

  const handleCheckboxChange = (e) => {
    setSaleInStrips(e.target.checked);
  };

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
    setSaleInStrips(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setSaleInStrips(false);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="Add Product"
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subcategoryId"
          label="Subcategory"
          rules={[{ required: true, message: 'Please select a subcategory' }]}
        >
          <Select placeholder="Select a subcategory">
            {subcategories.map(sub => (
              <Option key={sub.id} value={sub.id}>{sub.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          name="stockAlertMinimum"
          label="Stock Alert Minimum"
          rules={[{ required: true, message: 'Please enter stock alert minimum' }]}
        >
          <Input type="number" placeholder="Enter stock alert minimum" />
        </Form.Item>

        <Form.Item
          name="productLocations"
          label="Product Locations"
        >
          <Input placeholder="Enter product locations" />
        </Form.Item>

        <Form.Item name="saleInStrips" valuePropName="checked">
          <Checkbox onChange={handleCheckboxChange}>Sale in Strips?</Checkbox>
        </Form.Item>

        {saleInStrips && (
          <Form.Item
            name="stripsQuantity"
            label="Strips Quantity"
            rules={[{ required: true, message: 'Please enter strips quantity' }]}
          >
            <Input type="number" placeholder="Enter strips quantity" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ProductModal;