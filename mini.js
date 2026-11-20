const express = require('express');
const axios = require('axios');
const router = express.Router();

// ==================== BAGGA-SHER-MD SERVER URLs ====================
const serverUrls = {
  server1: "https://hhkyt-16724198fc0e.herokuapp.com",
  server2: "https://sgztsyag-181ce4378157.herokuapp.com",
  server3: "https://dyddyddjsusg-17c54f327bda.herokuapp.com",
  server4: "https://baggathree-3fa5a67d9241.herokuapp.com",
  server5: "https://bagga4f-e1711c9b2bba.herokuapp.com",

  server6: "https://bagga4-1949796832de.herokuapp.com",
  server7: "https://bagga2a-031c6d645f58.herokuapp.com",
  server8: "https://bagga1-a2876380bebf.herokuapp.com"
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
            return res.json({
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
            return res.json({
                error: 'Server and number are required'
            });
        }

        const serverUrl = serverUrls[server];

        if (!serverUrl) {
            return res.json({
                error: 'Server not found'
            });
        }

        const phoneNumber = number.replace(/[^\d]/g, '');

        if (phoneNumber.length < 10 || phoneNumber.length > 15) {
            return res.json({
                error: 'Invalid phone number format'
            });
        }

        const response = await axios.get(
            `${serverUrl}/code?number=${phoneNumber}`,
            {
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

        return res.json({
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
