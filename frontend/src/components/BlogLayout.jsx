import {useState, useEffect} from 'react';
import {Layout, Typography, List, Skeleton} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import HeaderComponent from './HeaderComponent';
import SearchComponent from './SearchComponent';
import PostCard from './PostCard';

const {Content} = Layout;
const {Text, Title} = Typography;

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

    return (
        <Layout style={{minHeight: '100vh'}}>
            <HeaderComponent token={token} username={username} handleLogout={handleLogout}/>
            <Content style={{padding: '20px', width: '100%', margin: '0', backgroundColor: '#f0f2f5'}}>
                <Title level={2} style={{textAlign: 'center'}}>Latest Blog Posts</Title>
                <SearchComponent handleSearch={handleSearch}/>
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
        </Layout>
    );
};

export default BlogLayout;
