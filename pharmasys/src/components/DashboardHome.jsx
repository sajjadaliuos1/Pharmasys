import React from 'react';
import { Layout, Row, Col, Card, Statistic, Typography, Button } from 'antd';
import { 
  BarChartOutlined, 
  ShoppingCartOutlined, 
  MedicineBoxOutlined, 
  TeamOutlined, 
  CaretUpOutlined 
} from '@ant-design/icons';
import { Bar } from '@ant-design/charts'; // Ant Design Charts

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DashboardHome = () => {

  // Sample data for the chart
  const data = [
    { type: 'January', value: 38 },
    { type: 'February', value: 52 },
    { type: 'March', value: 51 },
    { type: 'April', value: 50 },
    { type: 'May', value: 35 },
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    color: '#1890ff', // Customize bar color
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
    

      <Layout className="site-layout">
        {/* Header */}
        <Header className="site-layout-background" style={{ padding: 0, backgroundColor: '#001529' }}>
          <div style={{ padding: '0 20px', color: 'white', fontSize: '20px' }}>
            Pharmacy Dashboard
          </div>
        </Header>

        {/* Content */}
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 30 }}>
            <Row gutter={16}>
              {/* Stats Cards */}
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Sales"
                    value={112893}
                 
                    prefix={<ShoppingCartOutlined />}
                    suffix="USD"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Inventory Stock"
                    value={204}
                    prefix={<MedicineBoxOutlined />}
                    suffix="Items"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Customers"
                    value={934}
                    prefix={<TeamOutlined />}
                    suffix="Users"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Sales Growth"
                    value={18.5}
                    prefix={<CaretUpOutlined />}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>

            {/* Chart Section */}
            <Row gutter={16} style={{ margin: '24px 16px 0' }}>
              <Col span={24}>
                <Card title="Monthly Sales" bordered={false}>
                  <Bar {...config} />
                </Card>
              </Col>
            </Row>

          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardHome;
