import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';

const { Title } = Typography;

const SalesDashboard = () => {
  const salesData = [
    { type: 'Jan', sales: 3800 },
    { type: 'Feb', sales: 5200 },
    { type: 'Mar', sales: 6100 },
    { type: 'Apr', sales: 4800 },
    { type: 'May', sales: 6700 },
  ];

  const chartConfig = {
    data: salesData,
    xField: 'type',
    yField: 'sales',
    color: '#1890ff',
    label: {
      position: 'middle',
      style: {
        fill: '#fff',
      },
    },
    columnWidthRatio: 0.6,
  };

  const recentSales = [
    {
      key: '1',
      product: 'Paracetamol',
      quantity: 20,
      amount: '$100',
      date: '2025-04-08',
    },
    {
      key: '2',
      product: 'Ibuprofen',
      quantity: 10,
      amount: '$50',
      date: '2025-04-07',
    },
    {
      key: '3',
      product: 'Aspirin',
      quantity: 5,
      amount: '$25',
      date: '2025-04-06',
    },
  ];

  return (
    <div>
      <Title level={3}>Sales Dashboard</Title>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={12000}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={340}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Monthly Growth"
              value={15.2}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Returns"
              value={5}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Sales Chart */}
      <Card title="Monthly Sales">
        <Column {...chartConfig} />
      </Card>

      {/* Recent Sales Table */}
      <Card title="Recent Sales" style={{ marginTop: 24 }}>
        <Table dataSource={recentSales} pagination={false}>
          <Table.Column title="Product" dataIndex="product" key="product" />
          <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
          <Table.Column title="Amount" dataIndex="amount" key="amount" />
          <Table.Column title="Date" dataIndex="date" key="date" />
        </Table>
      </Card>
    </div>
  );
};

export default SalesDashboard;
