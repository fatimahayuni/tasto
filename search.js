document.addEventListener("DOMContentLoaded", function () {
    // const button = document.querySelector("#submit");
    const searchElement = document.querySelector("#searchTerms");

    const handleSearch = async () => {
        const searchTerms = searchElement.value.trim();
        if (searchTerms) {
            // search for recipes from mealdb.com
            const mealDbRecipes = await searchMealDbRecipe(searchTerms);

            // search for recipes from Tasto JSON bin
            const tastoBinRecipes = await searchTastoBinRecipe(searchTerms);

            // check if mealdb recipes are available
            let mealDbRecipesArray = mealDbRecipes && mealDbRecipes.meals ? mealDbRecipes.meals : [];

            // check if tasto json bin recipes are available
            let tastoBinRecipesArray = tastoBinRecipes ? tastoBinRecipes : [];

            // combine both arrays into a single list of recipes
            const combinedRecipes = {
                meals: mealDbRecipesArray.concat(tastoBinRecipesArray)
            };
            console.log("combinedRecipes", combinedRecipes);

            // Display the combined recipes
            displayRecipes(combinedRecipes);
        }
    };
    // Trigger search when "Enter" is pressed
    searchElement.addEventListener("keydown", function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            handleSearch();
        }
    });
});

// Search for recipe from mealdb.com. this one is returning 100% of the data matching the search. not filtered yet. 
async function searchMealDbRecipe(recipeName) {
    try {
        const mealdbDotComResponse = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`);

        return mealdbDotComResponse.data;
    } catch (error) {
        console.error("Error fetching recipe:", error);
    }
}

// Search for recipe from tasto json bin
async function searchTastoBinRecipe(searchTerms) {
    const url = 'https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382';
    const headers = {
        'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6',
    };
    try {
        const tastoBinResponse = await axios.get(url, { headers });
        const tastoBinRecipes = tastoBinResponse.data.record.recipes;
        const matchingRecipes = tastoBinRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerms.toLowerCase())
        );
        console.log("Matching recipes: ", matchingRecipes);

        return matchingRecipes;
    } catch (error) {
        console.error("Error fetching recipe:", error);
    }
}

// Display recipes
function displayRecipes(recipe) {
    const outputElement = document.querySelector("#output");
    outputElement.innerHTML = '';

    // Check if there are meals in the response
    if (recipe.meals) {
        for (let a of recipe.meals) {
            let recipeLink, imageUrl, recipeName, cuisineOrigin;

            if (a.idMeal) {
                // MealDB recipe structure
                recipeLink = `mealdbrecipe.html?mealId=${encodeURIComponent(a.idMeal)}&mealName=${encodeURIComponent(a.strMeal)}`;
                imageUrl = a.strMealThumb;
                recipeName = a.strMeal;
                cuisineOrigin = a.strArea;

                // Define recipeData for MealDB recipe
                recipeData = {
                    title: a.strMeal,
                    imageUrl: a.strMealThumb,
                    cuisineOrigin: a.strArea
                };
            } else {
                // Tasto recipe structure
                recipeLink = `tastobinrecipe.html?mealName=${encodeURIComponent(a.title)}`;
                imageUrl = a.imageUrl;
                recipeName = a.title;
                cuisineOrigin = a.cuisineOrigin

                // Define recipeData for Tasto recipe
                recipeData = {
                    title: a.title,
                    imageUrl: a.imageUrl,
                    cuisineOrigin: a.cuisineOrigin
                };
            }

            let cardElement = document.createElement("div");
            cardElement.classList.add("col");

            cardElement.innerHTML = `
            <a href="${recipeLink}" target="_blank" class="text-decoration-none">
                <div class="card card-image h-100">
                <img src="${imageUrl}" class="card-img-top standard-size" alt="${recipeName}">
                <div class="card-body black-bg">
                    <h5 class="card-food-name white-text">${recipeName}</h5>
                    <p class="card-cuisine">${cuisineOrigin}</p>
                </div>
                <div class="black-bg">
                    <img src="assets/heart-empty.png" class="small-size favorite-icon" alt="Favorite" data-recipe='${JSON.stringify(recipeData)}'>
                </div>
            </a>`;

            outputElement.appendChild(cardElement);
        }
        // Add event listeners to all heart icons
        const favoriteIcons = document.querySelectorAll(".favorite-icon");
        favoriteIcons.forEach(icon => {
            icon.addEventListener("click", (event) => {
                event.preventDefault(); // Prevent default link action
                const recipe = JSON.parse(event.target.getAttribute("data-recipe"));
                saveRecipeToJsonBin(recipe); // Call the save function
            });
        });
    } else {
        outputElement.innerHTML = "<p>No recipes found. Try another search.</p>";
    }
}

async function saveRecipeToJsonBin(recipe) {
    const url = 'https://api.jsonbin.io/v3/b/672ddd85acd3cb34a8a4edf7';
    const headers = {
        'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6',
        'Content-Type': 'application/json'
    };

    try {
        // Fetch existing data
        const response = await axios.get(url, { headers });
        const currentData = response.data.record;

        // Add the new recipe to the existing array of recipes
        currentData.recipes.push(recipe);

        // Update the JSON bin with the new data
        await axios.put(url, { record: currentData }, { headers });
        console.log("Recipe saved successfully.");
    } catch (error) {
        console.error("Error saving recipe:", error);
    }
}
