const Post = require('../models/postModel');

exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = parseInt(req.query.limit) || 10; // Số lượng bài viết mỗi trang, mặc định là 10

    try {
        const totalPosts = await Post.countDocuments(); // Tổng số bài viết
        const posts = await Post.find({})
            .sort({ created_at: -1 }) // Sắp xếp bài viết mới nhất
            .skip((page - 1) * limit) // Bỏ qua các bài viết của các trang trước
            .limit(limit); // Giới hạn số bài viết mỗi trang

        res.json({
            posts, // Trả về các bài viết
            currentPage: page, // Trang hiện tại
            totalPages: Math.ceil(totalPosts / limit), // Tổng số trang
            hasMore: page < Math.ceil(totalPosts / limit), // Kiểm tra xem còn dữ liệu hay không
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.createPost = async (req, res) => {
    const { owner, title, content, tags } = req.body;

    try {
        const lastPost = await Post.findOne().sort({ id: -1 });
        const newId = lastPost ? lastPost.id + 1 : 1;

        const post = new Post({
            id: newId,
            owner,
            title,
            content,
            created_at: Date.now(),
            tags
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.updatePost = async (req, res) => {
    const { title, content, tags } = req.body;

    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            post.title = title || post.title;
            post.content = content || post.content;
            post.tags = tags || post.tags;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            await Post.deleteOne({ _id: req.params.id });
            res.json({ message: 'Post deleted' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error });
    }
};
