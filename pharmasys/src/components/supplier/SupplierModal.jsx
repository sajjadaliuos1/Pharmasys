import { Modal, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';

const SupplierModal = ({ visible, onCancel, onSubmit, editingSupplier = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editingSupplier) {
      form.setFieldsValue(editingSupplier);
    } else {
      form.resetFields();
    }
  }, [editingSupplier, form]);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const isEdit = !!editingSupplier;
      const endpoint = isEdit
        ? 'https://pos.idotsolution.com/api/Supplier/update'
        : 'https://pos.idotsolution.com/api/Supplier/add';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEdit ? { ...formData, id: editingSupplier.id } : formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        message.success(`Supplier ${isEdit ? 'updated' : 'added'} successfully`);
        onSubmit(result); // trigger parent refresh or update
        form.resetFields();
        onCancel(); // close modal
      } else {
        message.error(result.message || `Failed to ${isEdit ? 'update' : 'add'} supplier`);
      }
    } catch (error) {
      console.error('API error:', error);
      message.error('An error occurred while saving the supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (values) => {
    handleFormSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText={editingSupplier ? 'Update' : 'Save'}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="supplierName"
          label="Supplier Name"
          rules={[{ required: true, message: 'Please enter supplier name' }]}
        >
          <Input placeholder="Enter supplier name" />
        </Form.Item>

        <Form.Item
          name="contactPerson"
          label="Contact Person"
          rules={[{ required: true, message: 'Please enter contact person' }]}
        >
          <Input placeholder="Enter contact person name" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter email address' }]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input placeholder="Enter supplier address" />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea placeholder="Additional notes (optional)" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierModal;
