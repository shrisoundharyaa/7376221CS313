const axios = require('axios');

const getPosts = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || (type !== 'popular' && type !== 'latest')) {
      return res.status(400).json({ message: 'Invalid query parameter. Use type=latest or type=popular' });
    }

    const response = await axios.get('http://20.244.56.144/test/users');
    const users = response.data.users;

    let allPosts = [];

    await Promise.all(users.map(async (userId) => {
      const postResponse = await axios.get(`http://20.244.56.144/test/users/${userId}/posts`);
      allPosts.push(...postResponse.data.posts);
    }));

    if (type === 'latest') {
      allPosts.sort((a, b) => b.id - a.id);
      return res.json(allPosts.slice(0, 5)); 
    }

    if (type === 'popular') {
      const commentCounts = {};

      await Promise.all(allPosts.map(async (post) => {
        const commentResponse = await axios.get(`http://20.244.56.144/test/posts/${post.id}/comments`);
        commentCounts[post.id] = commentResponse.data.comments.length;
      }));

      const maxComments = Math.max(...Object.values(commentCounts));

      const popularPosts = allPosts.filter(post => commentCounts[post.id] === maxComments);
      return res.json(popularPosts);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPosts };
