const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const windowQueue = [];

const API_URLS = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
};

// Fetch numbers from third-party API with timeout
const fetchNumbers = async (type) => {
    try {
        const source = axios.CancelToken.source();
        setTimeout(() => source.cancel(), 500); // Cancel request after 500ms

        const response = await axios.get(API_URLS[type], { cancelToken: source.token });
        return response.data.numbers || [];
    } catch (error) {
        console.log(`Error fetching data: ${error.message}`);
        return [];
    }
};

// Add numbers to the sliding window (unique values)
const updateWindow = (newNumbers) => {
    const previousState = [...windowQueue];

    // Add unique values only
    newNumbers.forEach(num => {
        if (!windowQueue.includes(num)) {
            if (windowQueue.length >= WINDOW_SIZE) {
                windowQueue.shift(); // Remove oldest element if window size exceeds limit
            }
            windowQueue.push(num);
        }
    });

    return previousState;
};

// Calculate the average of the window
const calculateAverage = () => {
    if (windowQueue.length === 0) return 0;
    const sum = windowQueue.reduce((acc, num) => acc + num, 0);
    return (sum / windowQueue.length).toFixed(2);
};

// Endpoint
app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;

    if (!['p', 'f', 'e', 'r'].includes(type)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const startTime = Date.now();
    const newNumbers = await fetchNumbers(type);
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > 500) {
        console.log(`Request exceeded time limit: ${elapsedTime}ms`);
        return res.status(504).json({ error: 'Request timed out' });
    }

    const prevState = updateWindow(newNumbers);
    const average = calculateAverage();

    res.json({
        windowPrevState: prevState,
        windowCurrState: [...windowQueue],
        numbers: newNumbers,
        avg: average
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
