import PropTypes from 'prop-types';
import {Card, Button, Skeleton, List, Typography} from 'antd';
import {CommentOutlined} from '@ant-design/icons';
import CommentsSection from './CommentsSection';
import moment from 'moment';

const {Text} = Typography;

const PostCard = ({post, loading, visibleComments, toggleComments, getPostComments}) => {
    const formatDate = (timestamp) => {
        return moment(timestamp).format('DD/MM/YYYY, h:mm:ss a');
    };

    return (
        <Card
            style={{
                marginBottom: '20px',
                backgroundColor: '#fff',
                textAlign: 'center',
                margin: '0 auto',
                width: '80%',
            }}
            actions={[
                <Button key={`comments-${post.id}`} type="link" icon={<CommentOutlined/>}
                        onClick={() => toggleComments(post.id)}>
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
                <CommentsSection comments={getPostComments(post.id)}/>
            )}
        </Card>
    );
};

// Define PropTypes for the component
PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        ownerName: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        commentsCount: PropTypes.number.isRequired,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
    visibleComments: PropTypes.objectOf(PropTypes.bool).isRequired,
    toggleComments: PropTypes.func.isRequired,
    getPostComments: PropTypes.func.isRequired,
};

// Set default values for props if needed (optional)
PostCard.defaultProps = {
    loading: false,
    visibleComments: {},
};

export default PostCard;
