const Comment = require('../models/commentModel');

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.createComment = async (req, res) => {
    const { owner, post, content } = req.body;

    const comment = new Comment({
        owner,
        post,
        content,
        created_at: Date.now()
    });

    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (comment) {
            await Comment.deleteOne({ _id: req.params.id });
            res.json({ message: 'Comment deleted' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};
