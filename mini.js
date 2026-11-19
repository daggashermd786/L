const express = require('express');
const axios = require('axios');
const router = express.Router();

// ==================== BAGGA-SHER-MD SERVER URLs ====================
const serverUrls = {
  Server1: "https://bagga3-600b7707caa8.herokuapp.com",
  server2: "https://sahsgsyay-8bf2b8ae2a4c.herokuapp.com",
  server3: "https://dhsyafwustqya-9219df824219.herokuapp.com",
  server4: "https://hauavwi-669ac3f3f6d4.herokuapp.com",
  server5: "https://shaiagfy-178ab7856ed6.herokuapp.com",

  server6: "https://hhfgiygty-9ce99d464b9a.herokuapp.com",
  server7: "https://hccuu-f6f2c1a997b1.herokuapp.com",
  server8: "httpobita101-bff98dba81ab.herokuapp.com",
  server9: "httpsa1-852ab0d1f75b.herokuapp.com",
  server10: "https:aa923f9f1.herokuapp.com",

  server11: "https://hshsvsjsgwh-a5a0345381ff.herokuapp.com",
  server12: "https://hsuwgwug-b2a7985f40a2.herokuapp.com",
  server13: "https://sshsgsgsyg-57732a792998.herokuapp.com",
  server14: "https://sshssguy-601c241426b1.herokuapp.com",
  server15: "https://shagzgusgsg-25f515028b11.herokuapp.com",

  server16: "https://shsgsgsysg-3c4d06910d16.herokuapp.com",
  server17: "https://sgafsft-ecc7adef497d.herokuapp.com",
  server18: "https://hahagwug-71045b7532d4.herokuapp.com",
  server19: "https://dgdssysgau-1ac4cb7a4d2c.herokuapp.com",
  server20: "https://shssgsysysg-702a4eef4bc5.herokuapp.com",

  server21: "https://svsvazfsygf-5b30716546b2.herokuapp.com",
  server22: "https://dhvsjghufjygg-58f832341215.herokuapp.com",
  server23: "https://dashboard.heroku.com/apps/dhhsgusgwaygjgf",
  server24: "https:bfbdb232.herokuapp.com",
  server25: "httpsfur-6418bb73f6cc.herokuapp.com",

  server26: "http5324.herokuapp.com",
  server27: "httpsc4d28d19d.herokuapp.com",
  server28: "httpse20a5.herokuapp.com",
  server29: "ht05c49e996af.herokuapp.com",
  server30: "https://nobitauni-385adc81b95d.herokuapp.com",

  server31: "https://nobitatow-5131601fbc5c.herokuapp.com",
  server32: "https://nobitathree-3d7bc40517ea.herokuapp.com",
  server33: "https://nobitaten-edd3b4dba6fe.herokuapp.com",
  server34: "https://nobitateera-669fa40e46bd.herokuapp.com",
  server35: "https://nobitasix-7526cece9c47.herokuapp.com",

  server36: "https://nobitaseven-e640fa55eff8.herokuapp.com",
  server37: "https://nobitaone-d3aa36c8bf0d.herokuapp.com",
  server38: "https://nobitanine-fb2be919a976.herokuapp.com",
  server39: "https://nobitaiki-00062a1c5e7a.herokuapp.com",
  server40: "https://nobitafour-afd63e9e54f3.herokuapp.com",

  server41: "https://nobitafive-56463aaeab79.herokuapp.com",
  server42: "https://nobitaeight-e7e5732b0371.herokuapp.com",
  server43: "https://nobita20-9016476f97ea.herokuapp.com",
  server44: "https://nobita19-eadeee300e44.herokuapp.com",
  server45: "https://nobita18-f84bb43b972d.herokuapp.com",

  server46: "https://nobita17-335356057c87.herokuapp.com",
  server47: "https://nobita16-5e3e930363fc.herokuapp.com",
  server48: "https://nobita15-66f16089eaad.herokuapp.com",
  server49: "https://nobita14-2feb2eb1a8cb.herokuapp.com",
  server50: "https://nobita11-84123248d993.herokuapp.com",

  server51: "https://nobita-83808dee62cb.herokuapp.com"
   
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
