// Load data and generate cards
document.addEventListener("DOMContentLoaded", () => {
    fetch('./data/releases.json')
        .then(response => response.json())
        .then(data => {
            const releaseList = document.getElementById('release-list');
            data.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('release-card');
                
                // Check if the movie is already in favorites
                const isFavorite = checkFavorite(item.id);

                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>Type: ${item.type}</p>
                    <p>Release Date: ${item.releaseDate}</p>
                    <p>Views: <span id="views-${item.id}">${item.views}</span></p>
                    <div class="actions">
                        <button class="like" id="like-${item.id}" onclick="handleLike(${item.id})">👍</button>
                        <button class="dislike" id="dislike-${item.id}" onclick="handleDislike(${item.id})">👎</button>
                        <button class="favorite ${isFavorite ? 'active' : ''}" id="favorite-${item.id}" onclick="toggleFavorite(${item.id}, '${item.title}')">
                            ⭐
                        </button>
                    </div>
                `;
                releaseList.appendChild(card);
            });
        });
});

// Function to check if a movie is in favorites
const checkFavorite = (id) => {
    const favorites = getFavorites();
    return favorites.includes(id.toString());
};

// Function to handle "like" button animation and toggle
const handleLike = (id) => {
    const likeButton = document.getElementById(`like-${id}`);
    likeButton.classList.toggle("active");
    likeButton.classList.add("clicked");
    setTimeout(() => likeButton.classList.remove("clicked"), 200);
};

// Function to handle "dislike" button animation and toggle
const handleDislike = (id) => {
    const dislikeButton = document.getElementById(`dislike-${id}`);
    dislikeButton.classList.toggle("active");
    dislikeButton.classList.add("clicked");
    setTimeout(() => dislikeButton.classList.remove("clicked"), 200);
};

// Function to toggle "favorite" status, animate button, and store in cookies
const toggleFavorite = (id, title) => {
    const favoriteButton = document.getElementById(`favorite-${id}`);
    favoriteButton.classList.toggle("active");
    favoriteButton.classList.add("clicked");
    setTimeout(() => favoriteButton.classList.remove("clicked"), 200);

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
