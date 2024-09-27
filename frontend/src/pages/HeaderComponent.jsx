import { Button, Typography, Layout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text, Title } = Typography;

const HeaderComponent = ({ username, token, handleLogout, handleLogin }) => {
    const navigate = useNavigate();

    return (
        <Header style={{ backgroundColor: '#001529', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ color: '#fff', margin: 0 }}>Blog Posts</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {token ? (
                    <>
                        <Text style={{ color: '#fff', fontSize: '16px' }}>User: {username}</Text>
                        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginLeft: '10px' }}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button type="primary" onClick={handleLogin} style={{ marginLeft: '10px' }}>
                        Login
                    </Button>
                )}
            </div>
        </Header>
    );
};

export default HeaderComponent;
