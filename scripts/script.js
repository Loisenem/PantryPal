const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const resultsContainer = document.getElementById("results");
const loader = document.getElementById("loader");
const suggestionsBox = document.getElementById("suggestions");
const form = document.querySelector("form");

const ingredientsList = [
  "eggs",
  "milk",
  "cheese",
  "tomato",
  "onion",
  "garlic",
  "chicken",
  "beef",
  "potato",
  "butter",
  "flour",
  "sugar",
];

searchInput.addEventListener("input", (e) => {
  let input = e.target.value?.toLowerCase();

  suggestionsBox.innerHTML = "";

  if (!input) {
    suggestionsBox.style.display = "none";
    clearResults();
    return;
  }

  // get the last item typed in the input whether one or manu e.g "milk => milk" or "milk, eggs => eggs"
  const searchedItems = input?.split(", ");
  const lastItem = searchedItems[searchedItems.length - 1];

  //   check if last item is empty
  if (lastItem == "") return;

  //   filter the searched value
  let filteredSuggestions = [];
  filteredSuggestions = ingredientsList.filter((ingredient) =>
    ingredient.includes(lastItem)
  );

  if (filteredSuggestions.length > 0) {
    filteredSuggestions.forEach((ingredient) => {
      let listItem = document.createElement("li");
      listItem.textContent = ingredient;
      listItem.addEventListener("click", () => {
        const existingItems = [...searchedItems];
        existingItems.pop();
        searchInput.value = existingItems.concat(ingredient);
        suggestionsBox.style.display = "none";
      });
      suggestionsBox.appendChild(listItem);
    });
    suggestionsBox.style.display = "block";
  } else {
    suggestionsBox.style.display = "none";
  }
});

async function fetchRecipes(query) {
  resultsContainer.innerHTML = "";
  loader.style.display = "block";

  try {
    let formattedQuery = query
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing !== "")
      .join(",");
    if (!formattedQuery) {
      resultsContainer.innerHTML =
        "<p>Please enter at least one ingredient.</p>";
      loader.style.display = "none";
      return;
    }
    const apiKey = "7bef46bcafa74af5a985e21e8bc8c4c3";
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${formattedQuery}&number=12&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      resultsContainer.innerHTML =
        "<p>No recipes found. Try different ingredients.</p>";
    } else {
      displayRecipes(data);
    }
  } catch (error) {
    resultsContainer.innerHTML = `<p>Something went wrong: ${error.message}. Try again.</p>`;
  }

  loader.style.display = "none";
}

function displayRecipes(recipes) {
  if (recipes.length === 0) {
    resultsContainer.innerHTML =
      "<p>No recipes found. Try different ingredients.</p>";
    return;
  }

  resultsContainer.innerHTML = recipes
    .map(
      (recipe) => `
            <div class="recipe">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p><strong>Used Ingredients:</strong> ${recipe.usedIngredients
                  .map((ing) => ing.name)
                  .join(", ")}</p>
                <p><strong>Missed Ingredients:</strong> ${recipe.missedIngredients
                  .map((ing) => ing.name)
                  .join(", ")}</p>
                <a href="https://spoonacular.com/recipes/${recipe.title
                  .replace(/ /g, "-")
                  .toLowerCase()}-${recipe.id}" target="_blank">View Recipe</a>
                <button class="favorite-btn" data-id="${
                  recipe.id
                }" data-title="${recipe.title}" data-image="${
        recipe.image
      }">❤️ Save</button>
            </div>
        `
    )
    .join("");

  document.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const recipeId = event.target.dataset.id;
      const recipeTitle = event.target.dataset.title;
      const recipeImage = event.target.dataset.image;

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites.push({
        id: recipeId,
        title: recipeTitle,
        image: recipeImage,
      });
      localStorage.setItem("favorites", JSON.stringify(favorites));

      alert(`${recipeTitle} saved to favorites!`);
    });
  });
}

function saveToFavorites(recipe) {
  //   const user = firebase.auth().currentUser;
  //   if (!user) {
  //     alert("You need to log in to save favorites!");
  //     return;
  //   }

  const userId = user.uid;
  //   db.collection("users")
  //     .doc(userId)
  //     .collection("favorites")
  //     .doc(recipe.id)
  //     .set(recipe)
  //     .then(() => {
  //       alert("Saved to Firebase favorites! ❤️");
  //     })
  //     .catch((error) => {
  //       console.error("Error saving favorite:", error);
  //     });
}

function clearResults() {
  resultsContainer.innerHTML = "";
}

searchBtn.addEventListener("click", () => {
  performSearch();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performSearch();
  }
});

function performSearch() {
  const query = searchInput.value.trim();
  console.log("Search Query:", query);
  if (query) {
    fetchRecipes(query);
    suggestionsBox.style.display = "none";
  } else {
    clearResults();
  }
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Message Sent! We'll contact you soon.");
    form.reset();
  });
}
