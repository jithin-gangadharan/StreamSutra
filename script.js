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
                        <button class="like" onclick="handleLike(${item.id})">👍</button>
                        <button class="dislike" onclick="handleDislike(${item.id})">👎</button>
                        <button class="favorite ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${item.id}, '${item.title}')">
                            ⭐
                        </button>
                    </div>
                `;
                releaseList.appendChild(card);
            });
        });
});

// Like/Dislike functionality with animations
const handleLike = (id) => {
    const likeButton = document.querySelector(`button.like`);
    likeButton.classList.toggle("active");
};

const handleDislike = (id) => {
    const dislikeButton = document.querySelector(`button.dislike`);
    dislikeButton.classList.toggle("active");
};

// Favorite functionality with animation
const toggleFavorite = (id, title) => {
    const favoriteButton = document.querySelector(`button.favorite`);
    favoriteButton.classList.toggle("active");

    const favorites = getFavorites();
    if (favorites.includes(id.toString())) {
        // Remove from favorites
        const index = favorites.indexOf(id.toString());
        if (index > -1) favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.push(id.toString());
    }

    setFavorites(favorites);
};

// Functions to manage favorites in cookies
const getFavorites = () => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('favorites='));
    return cookieValue ? JSON.parse(decodeURIComponent(cookieValue.split('=')[1])) : [];
};

const setFavorites = (favorites) => {
    document.cookie = `favorites=${encodeURIComponent(JSON.stringify(favorites))}; path=/; max-age=${60 * 60 * 24 * 7}`;
};
