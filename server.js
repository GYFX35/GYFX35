const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/refugee-data', async (req, res) => {
    try {
        const response = await axios.get('https://api.unhcr.org/population/v1/population/?year=2023');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from UNHCR API:', error);
        res.status(500).json({ error: 'Failed to fetch data from UNHCR API' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
