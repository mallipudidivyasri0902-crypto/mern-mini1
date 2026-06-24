const recipeContainer = document.getElementById("recipeContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("recipeModal");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.querySelector(".close-btn");

// Search Recipes
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();

    if(query){
        fetchRecipes(query);
    }
});

// Enter Key Search
searchInput.addEventListener("keypress", (e)=>{
    if(e.key === "Enter"){
        searchBtn.click();
    }
});

async function fetchRecipes(query){
    recipeContainer.innerHTML = "<h2>Loading...</h2>";

    try{
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        );

        const data = await response.json();

        if(!data.meals){
            recipeContainer.innerHTML =
                "<h2>No recipes found!</h2>";
            return;
        }

        displayRecipes(data.meals);

    }catch(error){
        recipeContainer.innerHTML =
            "<h2>Something went wrong!</h2>";
    }
}

function displayRecipes(meals){
    recipeContainer.innerHTML = "";

    meals.forEach(meal => {
        const card = document.createElement("div");

        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <button onclick="showRecipeDetails('${meal.idMeal}')">
                View Recipe
            </button>
        `;

        recipeContainer.appendChild(card);
    });
}

async function showRecipeDetails(id){
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await response.json();
    const meal = data.meals[0];

    modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>

        <div class="instructions">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;

    modal.style.display = "block";
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.style.display = "none";
    }
});

// Default Recipes
fetchRecipes("chicken");