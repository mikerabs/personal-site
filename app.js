const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve your HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','templates', 'index_3d.html'));
});

app.get('/login', (req, res) => {
    const scope = 'user-top-read';
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI
    })}`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        res.redirect(`/music?access_token=${accessToken}`);
    } catch (err) {
        console.error('Error fetching access token:', err.response.data);
        res.send('Error during authentication.');
    }
});

app.get('/music', async (req, res) => {
    const accessToken = req.query.access_token;

    try {
        const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const topTracks = topTracksResponse.data.items;
        res.json(topTracks); // Send the data to the frontend
    } catch (err) {
        console.error('Error fetching top tracks:', err.response.data);
        res.send('Error fetching top tracks.');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

