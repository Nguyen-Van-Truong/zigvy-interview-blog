import { useEffect, useState } from 'react';
import { List, Card, Button, Skeleton, Typography, Layout, Input } from 'antd';
import { CommentOutlined, LogoutOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { Header, Content } = Layout;
const { Search } = Input;

const HomePage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [visibleComments, setVisibleComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const fetchPosts = async () => {
        const pageSize = 3;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=${pageSize}`);
            const result = await response.json();

            if (result.posts.length === 0 || result.posts.length < pageSize) {
                setHasMore(false);
            } else {
                setData((prevData) => {
                    const newPosts = result.posts.filter((newPost) => !prevData.some((post) => post.id === newPost.id));
                    const updatedData = [...prevData, ...newPosts];
                    setFilteredData(updatedData);
                    return updatedData;
                });
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedToken = localStorage.getItem('token');
        if (storedName) {
            setUsername(storedName);
        }
        if (storedToken) {
            setToken(storedToken);
        }
        fetchPosts();
    }, []);

    const loadMoreData = () => {
        if (loading || !hasMore) return;
        fetchPosts();
    };

    const toggleComments = async (postId) => {
        setVisibleComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));

        if (!commentsData[postId]) {
            try {
                const response = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
                const comments = await response.json();
                setCommentsData((prevComments) => ({
                    ...prevComments,
                    [postId]: comments,
                }));
            } catch (error) {
                console.error("Error loading comments:", error);
            }
        }
    };

    const getPostComments = (postId) => {
        return commentsData[postId] || [];
    };

    const formatDate = (timestamp) => {
        return moment(timestamp).format('DD/MM/YYYY, h:mm:ss a');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setToken('');
        setUsername('');
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        if (value) {
            const filteredPosts = data.filter((post) =>
                post.title.toLowerCase().includes(value.toLowerCase()) ||
                post.content.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filteredPosts);
        } else {
            setFilteredData(data); // If search is cleared, reset to original data
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                backgroundColor: '#001529',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>Blog Posts</Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {token ? (
                        <>
                            <Text style={{ color: '#fff', fontSize: '16px' }}>User: {username}</Text>
                            <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}
                                    style={{ marginLeft: '10px' }}>
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

            <Content style={{ padding: '20px', width: '100%', margin: '0', backgroundColor: '#f0f2f5' }}>
                <Title level={2} style={{ textAlign: 'center' }}>Latest Blog Posts</Title>

                {/* Search bar */}
                <div style={{ maxWidth: '80%', margin: '0 auto 20px' }}>
                    <Search
                        placeholder="Search posts by title or content"
                        onSearch={handleSearch}
                        enterButton
                        size="large"
                        allowClear
                    />
                </div>

                <InfiniteScroll
                    dataLength={filteredData.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<Skeleton paragraph={{ rows: 1 }} active />}
                    endMessage={<Text style={{ textAlign: 'center' }}>No more posts to show.</Text>}
                >
                    <List
                        itemLayout="vertical"
                        dataSource={filteredData}
                        renderItem={(post) => (
                            <Card
                                style={{
                                    marginBottom: '20px',
                                    backgroundColor: '#fff',
                                    textAlign: 'center',
                                    margin: '0 auto',
                                    width: '80%',
                                }}
                                actions={[
                                    <Button key={`comments-${post.id}`} type="link" icon={<CommentOutlined />}
                                            onClick={() => toggleComments(post.id)}>
                                        {post.commentsCount} Comments
                                    </Button>,
                                ]}>
                                <Skeleton loading={loading} active>
                                    <List.Item.Meta
                                        title={post.title}
                                        description={
                                            <>
                                                <Text>by {post.ownerName}</Text> -{' '}
                                                <Text type="secondary"> {formatDate(post.created_at)}</Text>
                                            </>
                                        }
                                    />
                                    <Text>{post.content.substring(0, 100)}...</Text>
                                </Skeleton>

                                {visibleComments[post.id] && (
                                    <div style={{ marginTop: '10px', textAlign: 'left' }}>
                                        {getPostComments(post.id).map((comment) => (
                                            <div key={comment._id} style={{ padding: '5px 0' }}>
                                                <Text strong>{comment.ownerName}</Text>: {comment.content} <br />
                                                <Text type="secondary">{formatDate(comment.created_at)}</Text>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        )}
                    />
                </InfiniteScroll>
            </Content>
        </Layout>
    );
};

export default HomePage;
