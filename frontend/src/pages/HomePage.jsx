import { useEffect, useState } from 'react';
import { List, Card, Button, Skeleton, Typography } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';

const { Text, Title } = Typography;

// Sample Data (Users, Posts, Comments)
const users = [
    { _id: '66f51a401ee93b246be210bd', id: 1, username: 'meowmeow', name: 'Cat face', dob: '01/06/2016' },
    { _id: '66f51a401ee93b246be210be', id: 2, username: 'angrybird', name: 'Angry bird', dob: '13/12/2016' },
    { _id: '66f51a401ee93b246be210bf', id: 3, username: 'happydog', name: 'Happy Dog', dob: 'N/A' },
];

const posts = [
    {
        _id: '66f51aa8e0bc60afc092cf29',
        id: 1,
        owner: 1,
        title: 'Hello world',
        content: 'A "Hello, World!" program is traditionally used to introduce novice programmers to a programming language.',
        created_at: 1576506119083,  // Unix timestamp
        comments: [1, 2],
    },
    {
        _id: '66f51aa8e0bc60afc092cf30',
        id: 2,
        owner: 2,
        title: 'Bird Watching Tips',
        content: 'Bird watching is a serene and peaceful activity that allows people to connect with nature...',
        created_at: 1576506719083,
        comments: [3],
    },
];

const comments = [
    {
        _id: '66f51a97e0bc60afc092cf24',
        id: 1,
        owner: 1,
        post: 1,
        content: 'Boring!!!',
        created_at: 1576506719083,
    },
    {
        _id: '66f51a97e0bc60afc092cf25',
        id: 2,
        owner: 3,
        post: 1,
        content: 'Very good. But very bad also',
        created_at: 1576506719083,
    },
    {
        _id: '66f51a97e0bc60afc092cf26',
        id: 3,
        owner: 2,
        post: 2,
        content: 'Delightful unreserved impossible few estimating men favourable see entreaties...',
        created_at: 1576506719083,
    },
];

const HomePage = () => {
    const [data, setData] = useState([]); // Store the posts
    const [loading, setLoading] = useState(false); // Loading state
    const [hasMore, setHasMore] = useState(true); // Check if more data is available
    const [page, setPage] = useState(1); // Pagination page number
    const [visibleComments, setVisibleComments] = useState({}); // State to manage comments visibility

    const fetchPosts = () => {
        const pageSize = 2; // Limit posts per page
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const nextPosts = posts.slice(start, end);

        // Nếu không có bài viết mới nào hoặc đã lấy hết bài viết
        if (nextPosts.length === 0 || start >= posts.length) {
            setHasMore(false); // Đặt hasMore là false để ngăn tải thêm
            setLoading(false);
            return;
        }

        setData((prevData) => {
            const postIds = prevData.map(post => post.id);
            const newPosts = nextPosts.filter(post => !postIds.includes(post.id)); // Loại bỏ bài viết bị trùng lặp
            return [...prevData, ...newPosts];
        });

        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    // Function to load more data when scrolling
    const loadMoreData = () => {
        if (loading || !hasMore) return;
        setLoading(true);
        setPage((prevPage) => prevPage + 1);
    };

    const toggleComments = (postId) => {
        setVisibleComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    const getAuthor = (authorId) => {
        const author = users.find((user) => user.id === authorId);
        return author ? author.name : 'Unknown';
    };

    const getCommentsCount = (postId) => {
        return comments.filter((comment) => comment.post === postId).length;
    };

    const getPostComments = (postId) => {
        return comments.filter((comment) => comment.post === postId);
    };

    const formatDate = (timestamp) => {
        return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    };

    return (
        <div style={{ padding: '20px', width: '100%', margin: '0', backgroundColor: '#f0f2f5' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Latest Blog Posts</Title>
            <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={hasMore}
                loader={<Skeleton paragraph={{ rows: 1 }} active />}
                endMessage={<Text style={{ textAlign: 'center' }}>No more posts to show.</Text>}
            >
                <List
                    itemLayout="vertical"
                    dataSource={data}
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
                                <Button type="link" icon={<CommentOutlined />} onClick={() => toggleComments(post.id)}>
                                    {getCommentsCount(post.id)} Comments
                                </Button>,
                            ]}
                        >
                            <Skeleton loading={loading} active>
                                <List.Item.Meta
                                    title={post.title}
                                    description={
                                        <>
                                            <Text>by {getAuthor(post.owner)}</Text> -{' '}
                                            <Text type="secondary"> {formatDate(post.created_at)}</Text>
                                        </>
                                    }
                                />
                                <Text>{post.content.substring(0, 100)}...</Text>
                            </Skeleton>

                            {/* Comments Section, collapsed by default */}
                            {visibleComments[post.id] && (
                                <div style={{ marginTop: '10px', textAlign: 'left' }}>
                                    {getPostComments(post.id).map((comment) => (
                                        <div key={comment._id} style={{ padding: '5px 0' }}>
                                            <Text strong>{getAuthor(comment.owner)}</Text>: {comment.content}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    )}
                />
            </InfiniteScroll>
        </div>
    );
};

export default HomePage;
