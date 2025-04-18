import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Space
} from 'antd';
import {
  UserAddOutlined,
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const initialData = [
  {
    key: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    status: 'Inactive',
  },
];

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleAddCustomer = () => {
    form.validateFields().then(values => {
      const newCustomer = {
        key: Date.now().toString(),
        ...values,
        status: 'Active',
      };
      setCustomers([...customers, newCustomer]);
      form.resetFields();
      setIsModalOpen(false);
    });
  };

  const filteredData = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const total = customers.length;
  const active = customers.filter(c => c.status === 'Active').length;
  const inactive = customers.filter(c => c.status === 'Inactive').length;

  return (
    <div>
      <Title level={3}>Customer Dashboard</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Customers"
              value={total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Customers"
              value={active}
              valueStyle={{ color: 'green' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Inactive Customers"
              value={inactive}
              valueStyle={{ color: 'red' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table and controls */}
      <Card
        title="Customer List"
        extra={
          <Space>
            <Input
              placeholder="Search customers"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
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
          <Table.Column title="Status" dataIndex="status" key="status" />
        </Table>
      </Card>

      {/* Modal for adding customer */}
      <Modal
        title="Add New Customer"
        open={isModalOpen}
        onOk={handleAddCustomer}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email address' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
