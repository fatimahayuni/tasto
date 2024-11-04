async function searchRecipe(recipeName) {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);
        return response.data; // Ensure this returns the actual data
    } catch (error) {
        console.error("Error fetching recipe:", error);
    }
}
function displayRecipes(recipe) {
    const outputElement = document.querySelector("#output");
    outputElement.innerHTML = ""; // Clear the previous content
    // Check if there are meals in the response
    if (recipe.meals) for (let a of recipe.meals){
        const recipeLink = `recipe.html?mealId=${encodeURIComponent(a.idMeal)}&mealName=${encodeURIComponent(a.strMeal)}`;
        let cardElement = document.createElement("div");
        cardElement.classList.add("col");
        cardElement.innerHTML = `
            <a href="${recipeLink}" target="_blank" class="text-decoration-none">
                <div class="card card-image h-100">
                <img src="${a.strMealThumb}" class="card-img-top standard-size" alt="${a.strMeal}">
                <div class="card-body black-bg">
                    <h5 class="card-food-name white-text">${a.strMeal}</h5>
                    <p class="card-cuisine">${a.strArea}</p>
                </div>
                </div>
            </a>`;
        // Append the card to the output container
        outputElement.appendChild(cardElement);
    }
    else outputElement.innerHTML = "<p>No recipes found. Try another search.</p>";
}
document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector("#submit");
    const searchElement = document.querySelector("#searchTerms");
    const handleSearch = async ()=>{
        const searchTerms = searchElement.value.trim();
        if (searchTerms) {
            const recipe = await searchRecipe(searchTerms);
            if (recipe) {
                console.log(recipe); // Check what is returned here
                displayRecipes(recipe);
            } else console.error("No recipe data returned");
        }
    };
    // Listen for button click
    button.addEventListener("click", handleSearch);
    // Trigger search when "Enter" is pressed
    searchElement.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            handleSearch();
        }
    });
});

//# sourceMappingURL=search.ec8666be.js.map
