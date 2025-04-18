import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Row,
  Col,
  Space,
  Typography,
} from 'antd';
import { PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const initialData = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
  },
];

export default function CustomerDetails() {
  const [dataSource, setDataSource] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        const newData = {
          key: Date.now().toString(),
          ...values,
        };
        setDataSource([...dataSource, newData]);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = dataSource.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Card
        title={<Title level={4}>Customer Details</Title>}
        extra={
          <Space>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add Customer
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 5 }}
          bordered
        >
          <Table.Column title="Name" dataIndex="name" key="name" />
          <Table.Column title="Email" dataIndex="email" key="email" />
          <Table.Column title="Phone" dataIndex="phone" key="phone" />
        </Table>
      </Card>

      <Modal
        title="Add Customer"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
