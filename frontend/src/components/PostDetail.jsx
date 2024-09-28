// E:\zigvy\truong_2024_2\zigvy-interview-blog\frontend\src\components\PostDetail.jsx
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Layout, Typography, Skeleton, Button, Form, Input} from 'antd';
import CommentsSection from './CommentsSection';
import HeaderComponent from './HeaderComponent';

const {Content} = Layout;
const {Title, Text} = Typography;
const {TextArea} = Input;

const PostDetail = () => {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedToken = localStorage.getItem('token');
        if (storedName) setUsername(storedName);
        if (storedToken) setToken(storedToken);
        fetchPostDetail(id);
    }, [id]);

    const fetchPostDetail = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            const result = await response.json();
            setPost(result);
            setLoading(false);

            if (result.id) {
                const commentsResponse = await fetch(`http://localhost:3000/api/comments/post/${result.id}`);
                const commentsResult = await commentsResponse.json();
                setComments(commentsResult);
            }
        } catch (error) {
            console.error("Error loading post:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setToken('');
        setUsername('');
    };

    const handleAddComment = async (values) => {
        try {
            const response = await fetch('http://localhost:3000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    owner: 2,
                    post: post.id,
                    content: values.content,
                }),
            });

            if (response.ok) {
                const newComment = await response.json();
                const commentWithUsername = {
                    ...newComment,
                    ownerName: username,
                };
                setComments((prevComments) => [...prevComments, commentWithUsername]);
                form.resetFields();
            } else {
                console.error("Error adding comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <HeaderComponent token={token} username={username} handleLogout={handleLogout}/>
            <Content style={{padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff'}}>
                {loading ? (
                    <Skeleton active/>
                ) : (
                    <>
                        <Title level={2}>{post.title}</Title>
                        <Text type="secondary">
                            by {post.authorName ? post.authorName : 'Unknown Author'} - {new Date(post.created_at).toLocaleString()}
                        </Text>
                        <div style={{margin: '20px 0'}}>
                            <Text>{post.content}</Text>
                        </div>
                        <div>
                            <Title level={4}>Tags</Title>
                            {post.tags.map((tag, index) => (
                                <Button key={index} type="dashed" style={{marginRight: '10px'}}>
                                    {tag}
                                </Button>
                            ))}
                        </div>
                        <div style={{marginTop: '40px'}}>
                            <Title level={4}>Comments</Title>
                            <CommentsSection comments={comments}/>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Title level={4}>Add a Comment</Title>
                            <Form form={form} layout="vertical" onFinish={handleAddComment}>
                                <Form.Item
                                    name="content"
                                    label="Comment"
                                    rules={[{required: true, message: 'Please enter your comment!'}]}
                                >
                                    <TextArea rows={4}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Add Comment
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default PostDetail;
