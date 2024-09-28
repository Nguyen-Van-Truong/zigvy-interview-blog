// E:\zigvy\truong_2024_2\zigvy-interview-blog\frontend\src\components\BlogLayout.jsx
import {useState, useEffect} from 'react';
import {Layout, Typography, List, Skeleton, Button, Modal, Form, Input} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import HeaderComponent from './HeaderComponent';
import SearchComponent from './SearchComponent';
import PostCard from './PostCard';

const {Content} = Layout;
const {Text, Title} = Typography;
const {TextArea} = Input;

const BlogLayout = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [visibleComments, setVisibleComments] = useState({});
    const [commentsData, setCommentsData] = useState({});
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedToken = localStorage.getItem('token');
        if (storedName) setUsername(storedName);
        if (storedToken) setToken(storedToken);
        fetchPosts(1, searchTerm, true);
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page, searchTerm);
        }
    }, [page]);

    const fetchPosts = async (currentPage, searchTerm = '', reset = false) => {
        const pageSize = 5;
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/posts?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`
            );
            const result = await response.json();

            if (reset) {
                setData(result.posts);
            } else {
                const uniquePosts = result.posts.filter(
                    newPost => !data.some(existingPost => existingPost.id === newPost.id)
                );
                setData(prevData => [...prevData, ...uniquePosts]);
            }

            setHasMore(result.hasMore);
            setLoading(false);
        } catch (error) {
            console.error("Error loading posts:", error);
            setLoading(false);
        }
    };

    const loadMoreData = () => {
        if (loading || !hasMore) return;
        setPage(prevPage => prevPage + 1);
    };

    const toggleComments = (postId) => {
        setVisibleComments(prev => ({...prev, [postId]: !prev[postId]}));
        if (!commentsData[postId]) fetchComments(postId);
    };

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/post/${postId}`);
            const comments = await response.json();
            setCommentsData(prev => ({...prev, [postId]: comments}));
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    };

    const getPostComments = (postId) => commentsData[postId] || [];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setToken('');
        setUsername('');
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
        fetchPosts(1, value, true);
    };

    const showCreatePostModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleCreatePost = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner: 1, // Giả sử là ID người dùng hiện tại
                    title: values.title,
                    content: values.content,
                    tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
                }),
            });
            const result = await response.json();
            if (response.ok) {
                // Đóng modal và reset form
                setIsModalVisible(false);
                form.resetFields();
                // Thêm bài viết mới vào danh sách bài viết
                setData(prevData => [result, ...prevData]);
            } else {
                console.error("Error creating post:", result.message);
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <HeaderComponent token={token} username={username} handleLogout={handleLogout}/>
            <Content style={{padding: '20px', width: '100%', margin: '0', backgroundColor: '#f0f2f5'}}>
                <Title level={2} style={{textAlign: 'center'}}>Latest Blog Posts</Title>
                <SearchComponent handleSearch={handleSearch}/>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
                    <Button type="primary" onClick={showCreatePostModal}>
                        Create new post
                    </Button>
                </div>
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<Skeleton paragraph={{rows: 1}} active/>}
                    endMessage={<Text style={{textAlign: 'center'}}>No more posts to show.</Text>}
                >
                    <List
                        itemLayout="vertical"
                        dataSource={data}
                        renderItem={(post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                loading={loading}
                                visibleComments={visibleComments}
                                toggleComments={toggleComments}
                                getPostComments={getPostComments}
                            />
                        )}
                    />
                </InfiniteScroll>
            </Content>

            {/* Modal để tạo bài viết mới */}
            <Modal
                title="Create new post"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            handleCreatePost(values);
                        })
                        .catch(info => {
                            console.log('Validation Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="vertical" name="create_post_form">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{required: true, message: 'Please enter a title!'}]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{required: true, message: 'Please enter content!'}]}
                    >
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item name="tags" label="Tags (separated by commas)">
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default BlogLayout;
