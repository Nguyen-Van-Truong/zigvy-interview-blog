import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);

        // Fake login logic here. Replace with actual API request
        const { username, password } = values;

        // Mock API call (Replace with actual API)
        setTimeout(() => {
            setLoading(false);
            if (username !== 'admin' || password !== '123456') {
                setError('Invalid username or password');
            } else {
                // Redirect or handle successful login
                console.log('Login successful');
                setError(null);
            }
        }, 1000);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '40px',  // Tăng thêm padding để trang thoáng hơn
        }}>
            <Card style={{
                width: 500,  // Tăng thêm chiều rộng
                padding: '60px',  // Thêm padding để thẻ lớn hơn
                borderRadius: '10px',  // Làm góc tròn mượt hơn
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',  // Thêm hiệu ứng đổ bóng để nhìn hiện đại hơn
            }}>
                <Title level={1} style={{ textAlign: 'center', fontSize: '40px', marginBottom: '40px' }}> {/* Tăng kích thước tiêu đề */}
                    Login
                </Title>

                {/* Error Message */}
                {error && (
                    <Alert
                        message="Error"
                        description={error}
                        type="error"
                        showIcon
                        closable
                        style={{ marginBottom: 24 }}
                    />
                )}

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"  // Giữ layout dọc
                    size="large"  // Tăng kích thước input và các thành phần form
                >
                    <Form.Item
                        name="username"
                        label={<span style={{ fontSize: '20px' }}>Username</span>}  // Tăng kích thước label
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input
                            size="large"  // Tăng kích thước input
                            prefix={<UserOutlined style={{ fontSize: '20px' }} />}  // Tăng kích thước icon
                            placeholder="Enter your username"
                            style={{ height: '50px', fontSize: '18px' }}  // Tăng chiều cao input và kích thước chữ
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span style={{ fontSize: '20px' }}>Password</span>}  // Tăng kích thước label
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ fontSize: '20px' }} />}  // Tăng kích thước icon
                            placeholder="Enter your password"
                            style={{ height: '50px', fontSize: '18px' }}  // Tăng chiều cao input và kích thước chữ
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                height: '55px',  // Tăng chiều cao nút
                                fontSize: '18px',  // Tăng kích thước chữ
                                borderRadius: '8px',  // Làm nút tròn mượt hơn
                            }}
                        >
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
