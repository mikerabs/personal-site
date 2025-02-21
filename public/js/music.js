document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/music-data')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(({ topTracks, topArtists }) => {
            const tracksList = document.getElementById('top-tracks-list');
            const artistsList = document.getElementById('top-artists-list');

            topTracks.forEach(track => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${track.spotifyUrl}" target="_blank">
                        <img src="${track.albumArt}" alt="${track.name}" class="album-art">
                        <div><strong>${track.name}</strong> - ${track.artist}</div>
                    </a>
                `;
                tracksList.appendChild(li);
            });

            topArtists.forEach(artist => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${artist.spotifyUrl}" target="_blank">
                        <img src="${artist.image}" alt="${artist.name}" class="artist-img">
                        <div><strong>${artist.name}</strong></div>
                    </a>
                `;
                artistsList.appendChild(li);
            });
        })
        .catch(err => console.error('Error fetching music data:', err));
});
