const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

    if (!companyName || !ownerName || !rollNo || !ownerEmail || !accessCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const registrationData = {
      companyName,
      ownerName,
      rollNo,
      ownerEmail,
      accessCode,
    };

    const response = await axios.post('http://20.244.56.144/test/register', registrationData);
    res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
    
      res.status(error.response.status).json({ message: error.response.data });
    } else {
      
      res.status(500).json({ message: error.message });
    }
  }
});

app.post('/auth', async (req, res) => {
    try {
      const { companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo } = req.body;
  
      if (!companyName || !clientID || !clientSecret || !ownerName || !ownerEmail || !rollNo) {
        return res.status(400).json({ message: 'All fields are required for authentication.' });
      }
  
      const authData = { companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo };
  
      const response = await axios.post('http://20.244.56.144/test/auth', authData);
  
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ message: error.response?.data || error.message });
    }
  });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
