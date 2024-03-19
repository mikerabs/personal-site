const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve your HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','templates', 'index_3d.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

