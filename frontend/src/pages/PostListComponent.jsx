import { List, Skeleton, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostCardComponent from './PostCardComponent.jsx';

const { Text } = Typography;

const PostListComponent = ({ data, hasMore, loading, loadMoreData, visibleComments, toggleComments, getPostComments, formatDate }) => {
    return (
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
                    <PostCardComponent
                        key={post.id}
                        post={post}
                        loading={loading}
                        visibleComments={visibleComments}
                        toggleComments={toggleComments}
                        getPostComments={getPostComments}
                        formatDate={formatDate}
                    />
                )}
            />
        </InfiniteScroll>
    );
};

export default PostListComponent;
