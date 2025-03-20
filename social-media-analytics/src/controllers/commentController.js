const axios = require('axios');

const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const response = await axios.get(`http://20.244.56.144/test/posts/${postId}/comments`);
    res.json(response.data.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments };
