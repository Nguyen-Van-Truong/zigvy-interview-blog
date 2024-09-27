import { Card, Button, Skeleton, Typography } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const PostCardComponent = ({ post, loading, visibleComments, toggleComments, getPostComments, formatDate }) => {
    return (
        <Card
            style={{ marginBottom: '20px', backgroundColor: '#fff', textAlign: 'center', margin: '0 auto', width: '80%' }}
            actions={[
                <Button key={`comments-${post.id}`} type="link" icon={<CommentOutlined />} onClick={() => toggleComments(post.id)}>
                    {post.commentsCount} Comments
                </Button>,
            ]}
        >
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
    );
};

export default PostCardComponent;
