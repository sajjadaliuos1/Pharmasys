

import { Form, Input, Button, Card, Typography, } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Login() {
 // const [loading, setLoading] = useState(false);
  //const navigate = useNavigate(); // <-- for navigation

  // const onFinish = (values) => {
  //   setLoading(true);

  //   const users = {
  //     admin: { password: '123', role: 'role1' },
  //     manager: { password: '123', role: 'role2' },
  //     staff: { password: '123', role: 'role3' },
  //   };

  //   setTimeout(() => {
  //     const user = users[values.username];

  //     if (user && user.password === values.password) {
  //       message.success('Login successful!');
  //       onLogin({ username: values.username, role: user.role });
  //       navigate('/dashboard'); // <-- redirect to dashboard
  //     } else {
  //       message.error('Invalid username or password!');
  //     }

  //     setLoading(false);
  //   }, 1000);
  // };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>PharmaSys</Title>
          <Typography.Text type="secondary">Pharmaceutical Management System</Typography.Text>
        </div>

        <Form name="login" initialValues={{ remember: true }} size="large">
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
