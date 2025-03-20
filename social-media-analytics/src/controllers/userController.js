const axios = require('axios');

const getTopUsers = async (req, res) => {
  try {
    const response = await axios.get('http://20.244.56.144/test/users');
    const users = response.data.users;

    const postCounts = {};

    
    await Promise.all(users.map(async (userId) => {
      const postResponse = await axios.get(`http://20.244.56.144/test/users/${userId}/posts`);
      postCounts[userId] = postResponse.data.posts.length;
    }));

   
    const sortedUsers = Object.entries(postCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([userId, count]) => ({ userId, count }));

    res.json(sortedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTopUsers };
