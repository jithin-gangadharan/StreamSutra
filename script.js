// Load data and generate cards
document.addEventListener("DOMContentLoaded", () => {
    fetch('./data/releases.json')
        .then(response => response.json())
        .then(data => {
            const releaseList = document.getElementById('release-list');
            data.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('release-card');
                const isFavorite = checkFavorite(item.id);

                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>Type: ${item.type}</p>
                    <p>Release Date: ${item.releaseDate}</p>
                    <p>Views: <span id="views-${item.id}">${item.views}</span></p>
                    <div class="actions">
                        <button class="like" onclick="handleLike(${item.id})">👍 Like (<span id="likes-${item.id}">${item.likes}</span>)</button>
                        <button class="dislike" onclick="handleDislike(${item.id})">👎 Dislike (<span id="dislikes-${item.id}">${item.dislikes}</span>)</button>
                        <button class="favorite ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${item.id}, '${item.title}')">
                            ⭐ ${isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </button>
                    </div>
                `;
                releaseList.appendChild(card);
            });
        });
});

// Function to check if a movie/series is a favorite
const checkFavorite = (id) => {
    const favorites = getFavorites();
    return favorites.includes(id.toString());
};

// Function to toggle favorite status
const toggleFavorite = (id, title) => {
    const favorites = getFavorites();

    if (favorites.includes(id.toString())) {
        // Remove from favorites
        const index = favorites.indexOf(id.toString());
        if (index > -1) favorites.splice(index, 1);
        alert(`${title} removed from favorites`);
    } else {
        // Add to favorites
        favorites.push(id.toString());
        alert(`${title} added to favorites`);
    }

    // Save updated favorites to cookies
    setFavorites(favorites);
    document.location.reload();  // Reload to update favorite button
};

// Function to get favorites from cookies
const getFavorites = () => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('favorites='));
    return cookieValue ? JSON.parse(decodeURIComponent(cookieValue.split('=')[1])) : [];
};

// Function to set favorites in cookies
const setFavorites = (favorites) => {
    document.cookie = `favorites=${encodeURIComponent(JSON.stringify(favorites))}; path=/; max-age=${60 * 60 * 24 * 7}`;  // 1-week expiry
};

// Like/Dislike functionality (example without persistence)
const handleLike = (id) => {
    const likeCount = document.getElementById(`likes-${id}`);
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
};

const handleDislike = (id) => {
    const dislikeCount = document.getElementById(`dislikes-${id}`);
    dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
};
