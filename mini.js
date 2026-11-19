const express = require('express');
const axios = require('axios');
const router = express.Router();

// ==================== NAWAZ-MD SERVER URLs ====================
const serverUrls = {
  server1: "https://nawaz-3162d6579962.herokuapp.com",
  server2: "https://nawaz1-0983e3c89598.herokuapp.com",
  server3: "https://nawaz7-64b2f7e9e98d.herokuapp.com",
  server4: "https://nawazmd10a-b3a485c20114.herokuapp.com",
  server5: "https://nawazmd12a-5235a0c8bd49.herokuapp.com",
  server6: "https://nawazmd5a-dfda33a9720f.herokuapp.com",
  server7: "https://nawazmd6a-efef13f12660.herokuapp.com",
  server8: "https://nawazmd8a-2654ed7ff579.herokuapp.com",
  server9: "https://nawazmd9a-8fe87d2f3605.herokuapp.com",
  server10: "https://nawazmda-038172fa6bff.herokuapp.com"
};

// ==================== GET SERVER LIST ====================
router.get('/servers', (req, res) => {
    const servers = Object.keys(serverUrls).map(key => ({
        id: key,
        name: `Server ${key.replace('server', '')}`,
        url: serverUrls[key]
    }));

    res.json({ servers });
});

// ==================== GET SERVER STATUS ====================
router.get('/status/:serverId', async (req, res) => {
    try {
        const { serverId } = req.params;
        const serverUrl = serverUrls[serverId];

        if (!serverUrl) {
            return res.status(404).json({
                error: 'Server not found'
            });
        }

        const response = await axios.get(`${serverUrl}/active`, {
            timeout: 5000
        });

        return res.json({
            count: response.data.count || 0,
            limit: response.data.limit || 50
        });

    } catch (error) {
        return res.json({
            count: 0,
            limit: 50,
            error: 'Failed to fetch status'
        });
    }
});

// ==================== GENERATE PAIR CODE ====================
router.get('/code', async (req, res) => {
    try {
        const { server, number } = req.query;

        if (!server || !number) {
            return res.status(400).json({
                error: 'Server and number are required'
            });
        }

        const serverUrl = serverUrls[server];

        if (!serverUrl) {
            return res.status(404).json({
                error: 'Server not found'
            });
        }

        const phoneNumber = String(number).replace(/[^\d]/g, '');

        if (phoneNumber.length < 10 || phoneNumber.length > 15) {
            return res.status(400).json({
                error: 'Invalid phone number format'
            });
        }

        const response = await axios.get(
            `${serverUrl}/code`,
            {
                params: {
                    number: phoneNumber
                },
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                }
            }
        );

        if (response.data && response.data.code) {
            return res.json({
                code: response.data.code
            });
        }

        return res.json({
            error: 'No code received'
        });

    } catch (error) {
        console.log(
            error.response?.data || error.message
        );

        return res.status(500).json({
            error: error.response?.data || 'Failed to generate code'
        });
    }
});

// ==================== RANDOM SERVER ====================
router.get('/random', (req, res) => {
    const servers = Object.keys(serverUrls);

    const randomServer =
        servers[Math.floor(Math.random() * servers.length)];

    res.json({
        server: randomServer,
        url: serverUrls[randomServer]
    });
});

module.exports = router;
