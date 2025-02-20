document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-btn');
    const tracksList = document.getElementById('top-tracks');

    loginButton.addEventListener('click', () => {
        window.location.href = '/login';
    });

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
        fetch(`/music?access_token=${accessToken}`)
            .then(response => response.json())
            .then(tracks => {
                tracksList.innerHTML = '';

                tracks.forEach(track => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <img src="${track.album.images[2].url}" alt="${track.name}" width="50">
                        <strong>${track.name}</strong> by ${track.artists[0].name}
                    `;
                    tracksList.appendChild(listItem);
                });

                loginButton.style.display = 'none';
            })
            .catch(err => {
                console.error('Error fetching top tracks:', err);
            });
    }
});

