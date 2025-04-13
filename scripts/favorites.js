document.addEventListener("DOMContentLoaded", () => {
    const favoritesContainer = document.getElementById("favorites-container");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites saved yet.</p>";
    } else {
        favoritesContainer.innerHTML = favorites.map(recipe => `
            <div class="recipe">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-").toLowerCase()}-${recipe.id}" target="_blank">View Recipe</a>
                <button class="remove-btn" data-id="${recipe.id}">❌ Remove</button>
            </div>
        `).join("");
    }

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            let newFavorites = favorites.filter(fav => fav.id !== event.target.dataset.id);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
            location.reload();
        });
    });
});
