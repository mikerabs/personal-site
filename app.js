const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'https://mikerabayda.onrender.com/callback';


// Include the necessary Spotify Web API library
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
});


const refreshAccessToken = async () => {
    try {
        const data = await spotifyApi.refreshAccessToken();
        const accessToken = data.body['access_token'];
        spotifyApi.setAccessToken(accessToken);

        console.log('Access token refreshed:', accessToken);
        return accessToken;
    } catch (err) {
        console.error('Error refreshing access token:', err);
        throw err;
    }
};


spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

// Serve static files from the 'public' directory
app.use(express.static('public'));



// Serve your HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','templates', 'index_3d.html'));
});

app.get('/login', (req, res) => {
    /*const scope = 'user-top-read';
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI
    })}`;
    res.redirect(authUrl);*/
    const scopes = ['user-read-private', 'user-read-email', 'user-top-read']; // Add additional scopes as needed
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
    res.redirect(authorizeURL);

    
});

let refreshToken = null; // Global variable to store the refresh token

app.get('/callback', async (req, res) => {
    
    const { code } = req.query; // Get the authorization code from the query parameters
    try {
        // Exchange the authorization code for an access token and refresh token
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;

        // Set the access token on the Spotify Web API instance
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token); // Save refresh token
        refreshToken = refresh_token; // Store globally for reuse


        // Save the refresh token for future use (e.g., token refreshing)
        // Implement a mechanism to store the refresh token securely (e.g., in a database)
        // For simplicity, we'll just log it here.
        console.log('Refresh Token:', refresh_token);

        // Redirect the user to a page that displays their Spotify data
        res.redirect('/music');
    } catch (error) {
        console.error('Error exchanging authorization code:', error.message);
        res.status(500).send('Error exchanging authorization code');
    }

});

app.get('/music', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'music.html'));
});

app.get('/api/music-data', async (req, res) => {
    try {
        if (!spotifyApi.getAccessToken()) {
            console.log('No access token found. Refreshing...');
            await refreshAccessToken();
        }

        // Fetch Top Tracks
        const topTracksResponse = await spotifyApi.getMyTopTracks({ limit: 10, time_range: 'short_term' });
        const topTracks = topTracksResponse.body.items.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            albumArt: track.album.images[1]?.url,
            spotifyUrl: track.external_urls.spotify,
        }));

        // Fetch Top Artists
        const topArtistsResponse = await spotifyApi.getMyTopArtists({ limit: 10, time_range: 'short_term' });
        const topArtists = topArtistsResponse.body.items.map(artist => ({
            name: artist.name,
            image: artist.images[1]?.url,
            spotifyUrl: artist.external_urls.spotify,
        }));

        res.json({ topTracks, topArtists });
    } catch (err) {
        console.error('Error fetching Spotify data:', err.message);
        res.status(500).send('Failed to fetch Spotify data.');
    }
});

/*
app.get('/api/music-data', async (req, res) => {
    const timeRange = 'short_term';

    try {
        console.log('Fetching top tracks and artists with access token:', spotifyApi.getAccessToken());

        if (!spotifyApi.getAccessToken()) {
            console.warn('No access token set. Trying to refresh...');
            if (refreshToken) {
                spotifyApi.setRefreshToken(refreshToken);
                const data = await spotifyApi.refreshAccessToken();
                spotifyApi.setAccessToken(data.body['access_token']);
                console.log('Access token refreshed:', data.body['access_token']);
            } else {
                console.error('No refresh token available. User must log in.');
                return res.status(401).send('Unauthorized: Please log in.');
            }
        }

        const topTracksResponse = await spotifyApi.getMyTopTracks({ limit: 10 , time_range: timeRange});
        const topArtistsResponse = await spotifyApi.getMyTopArtists({ limit: 10 , time_range: timeRange});

        console.log('Top Tracks:', topTracksResponse.body.items);
        console.log('Top Artists:', topArtistsResponse.body.items);

        const topTracks = topTracksResponse.body.items.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            albumArt: track.album.images[1]?.url,
            spotifyUrl: track.external_urls.spotify,
        }));

        const topArtists = topArtistsResponse.body.items.map(artist => ({
            name: artist.name,
            image: artist.images[1]?.url,
            spotifyUrl: artist.external_urls.spotify,
        }));

        res.json({ topTracks, topArtists });
    } catch (err) {
        console.error('Error fetching Spotify data:', err);
        res.status(500).send('Failed to fetch Spotify data.');
    }
  /*
    try {
        // Fetch Top Tracks
        const topTracksResponse = await spotifyApi.getMyTopTracks({ limit: 10 });
        const topTracks = topTracksResponse.body.items.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            albumArt: track.album.images[1]?.url,
            spotifyUrl: track.external_urls.spotify,
        }));

        // Fetch Top Artists
        const topArtistsResponse = await spotifyApi.getMyTopArtists({ limit: 10 });
        const topArtists = topArtistsResponse.body.items.map(artist => ({
            name: artist.name,
            image: artist.images[1]?.url,
            spotifyUrl: artist.external_urls.spotify,
        }));

        res.json({ topTracks, topArtists });
    } catch (err) {
        console.error('Error fetching Spotify data:', err.message);
        res.status(500).send('Failed to fetch Spotify data.');
    }*/
//});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

