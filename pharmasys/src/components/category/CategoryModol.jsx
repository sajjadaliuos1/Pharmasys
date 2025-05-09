import React, { useEffect } from 'react';
import { Modal, Form, Button, Input, message as messageApi } from 'antd';
import { createCategory } from '../Api/Api';    

const CategoryModal = ({ visible, title, onCancel, initialValues, onSave,  setIsModalVisible }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);
  
  const handleSubmit = async(values) => {
    console.log('Saving category:', values);
    
  
     const response = await createCategory(values);
    if(response.data.status === "Success") 
        {
            messageApi.success(response.data.message);
            setIsModalVisible(false);
            onSave(values);
        }
    else{
        messageApi.error(response.data.message);
           
    }
   
    form.resetFields();
  };
  
  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
        >
          Save11
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
       
      >
        <Form.Item
          name="typeName"
          label="Category Name"
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;