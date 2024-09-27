import {useState} from 'react';
import {Form, Input, Button, Typography, Card, Alert} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';

const {Title} = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);

        const {username, password} = values;

        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            localStorage.setItem('token', data.token);
            localStorage.setItem('name', data.name);

            window.location.href = '/';

        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
            padding: '40px',
        }}>
            <Card style={{
                width: 500,
                padding: '60px',
                borderRadius: '10px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}>
                <Title level={1} style={{
                    textAlign: 'center',
                    fontSize: '40px',
                    marginBottom: '40px'
                }}>
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
                        style={{marginBottom: 24}}
                    />
                )}

                <Form
                    name="login"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        label={<span style={{fontSize: '20px'}}>Username</span>}
                        rules={[{required: true, message: 'Please enter your username!'}]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined style={{fontSize: '20px'}}/>}
                            placeholder="Enter your username"
                            style={{height: '50px', fontSize: '18px'}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<span style={{fontSize: '20px'}}>Password</span>}
                        rules={[{required: true, message: 'Please enter your password!'}]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{fontSize: '20px'}}/>}
                            placeholder="Enter your password"
                            style={{height: '50px', fontSize: '18px'}}
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
                                height: '55px',
                                fontSize: '18px',
                                borderRadius: '8px',
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
