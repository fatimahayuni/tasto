import { searchMealDbRecipe, searchTastoBinRecipe, displayRecipes } from './search.js';


document.addEventListener("DOMContentLoaded", async function () {
    const searchElement = document.querySelector("#searchTerms");

    const handleSearch = async () => {
        const searchTerms = searchElement.value.trim();
        if (searchTerms) {
            // search for recipes from mealdb.com
            const [mealDbRecipes, tastoBinRecipes] = await Promise.all([
                searchMealDbRecipe(searchTerms),
                searchTastoBinRecipe(searchTerms)
            ]);


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


    // Fetch and combine recipes
    const tastoRecipes = await fetchRecipesFromTastoBin();
    console.log("tastoRecipes", tastoRecipes);
    const mealdbRecipes = await fetchRecipesFromMealdbBin();

    // Combine both recipe arrays
    const allRecipes = [
        ...tastoRecipes.map(recipe => ({
            title: recipe.title,
            cuisineOrigin: recipe.cuisineOrigin,
            imageUrl: recipe.imageUrl,
            source: 'tasto'
        })),
        ...mealdbRecipes.map(recipe => ({ ...recipe, source: 'mealdb' }))
    ];

    displayCombinedRecipes(allRecipes);

    // Fetch recipes from MealDB bin and standardize the data
    async function fetchRecipesFromTastoBin() {
        const tastoResponse = await axios.get('https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382', {
            headers: {
                'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
            }
        });
        console.log("tastoResponse", tastoResponse);

        const tastoRecipes = tastoResponse.data.record.recipes || [];

        return tastoRecipes.map(recipe => ({
            title: recipe.title,
            cuisineOrigin: recipe.cuisineOrigin,
            imageUrl: recipe.imageUrl,
            source: 'tasto'
        }));
    }

    // Fetch recipes from MealDB bin and standardize the data
    async function fetchRecipesFromMealdbBin() {
        const mealdbResponse = await axios.get('https://api.jsonbin.io/v3/b/672ddd85acd3cb34a8a4edf7', {
            headers: {
                'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
            }
        });

        const mealdbRecipes = mealdbResponse.data.record.recipes || [];

        return mealdbRecipes.map(recipe => ({
            title: recipe.title,
            cuisineOrigin: recipe.cuisineOrigin,
            imageUrl: recipe.imageUrl,
            source: 'mealdb'
        }));
    }

    // Function to display combined recipes with delete functionality
    function displayCombinedRecipes(allRecipeData) {
        const outputElement = document.querySelector("#output");
        outputElement.innerHTML = '';

        if (allRecipeData.length === 0) {
            outputElement.innerHTML = "<p>No recipes found. Try another search.</p>";
            return;
        }

        allRecipeData.forEach((recipe) => {
            const recipeLink = recipe.source === 'mealdb'
                ? `mealdbrecipe.html?mealName=${encodeURIComponent(recipe.title)}`
                : `tastobinrecipe.html?mealName=${encodeURIComponent(recipe.title)}`;

            const imageUrl = recipe.imageUrl || 'https://via.placeholder.com/150';

            // Convert the recipe title to title case
            const titleCaseTitle = recipe.title ? recipe.title.replace(/\b\w/g, char => char.toUpperCase()) : 'No Title Available';

            let cardElement = document.createElement("div");
            cardElement.classList.add("col");

            cardElement.innerHTML = `
            <a href="${recipeLink}" class="text-decoration-none">
                <div class="card card-image h-100 d-flex p-0">
                    <img src="${imageUrl}" class="card-img-top standard-size d-flex" alt="${recipe.title}">
                    <div class="card-body black-bg align-items-start p-0">
                    <!-- Red border div for the title -->
                    <h5 class="card-food-name white-text my-2 text-start w-100">${titleCaseTitle || 'No Title Available'}</h5>
                    <!-- Red border div for the cuisine -->
                    <p class="card-cuisine text-start w-100 mb-2">${recipe.cuisineOrigin || 'Cuisine not specified'}</p>
                    <!-- Red border div for the delete icon -->
                    <div class="d-flex align-items-center p-0 w-100">
                        <img src="assets/delete.png" class="small-size delete-icon" data-title="${recipe.title}" data-source="${recipe.source}" alt="Delete">
                    </div>
                    </div>
                </div>
            </a>`;

            outputElement.appendChild(cardElement);
        });

        // Attach the event listener to all delete icons
        const deleteIcons = document.querySelectorAll('.delete-icon');
        deleteIcons.forEach(icon => {
            icon.addEventListener('click', async (e) => {
                e.preventDefault(); // Prevent page reload
                const recipeTitle = icon.getAttribute('data-title');
                const source = icon.getAttribute('data-source');

                try {
                    // Show SweetAlert confirmation dialog
                    const confirmation = await Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                    });

                    // If the user confirms the deletion
                    if (confirmation.isConfirmed) {
                        // Call the appropriate delete function based on the source
                        if (source === 'mealdb') {
                            await deleteMealdbRecipe(recipeTitle);
                        } else if (source === 'tasto') {
                            await deleteTastoRecipe(recipeTitle);
                        }

                        // Remove the recipe card from the UI
                        icon.closest('.col').remove();

                        // Show success message after deletion
                        await Swal.fire({
                            title: "Deleted!",
                            text: "The recipe has been deleted.",
                            icon: "success",
                            confirmButtonColor: "#3085d6"
                        });
                    }
                } catch (error) {
                    console.error("Error deleting recipe:", error);
                }
            });
        });


    }

    async function deleteMealdbRecipe(recipeTitle) {
        try {
            const url = `https://api.jsonbin.io/v3/b/672ddd85acd3cb34a8a4edf7`; // MealDB Bin
            const headers = {
                'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6',
                'Content-Type': 'application/json'
            };

            // Fetch the current data from the MealDB bin
            const response = await axios.get(url, { headers });
            const data = response.data.record;

            // Log the current structure for debugging

            // Filter out the recipe based on `strMeal` for MealDB structure
            const updatedRecipes = data.recipes.filter(recipe => recipe.title !== recipeTitle);

            // Update the bin with the filtered data
            // Note: Use the same structure as the original bin data
            const updatedData = { recipes: updatedRecipes };

            // Send the updated data back to JSON Bin
            await axios.put(url, updatedData, { headers });
        } catch (error) {
            console.error('Error deleting recipe from MealDB Bin:', error);
        }
    }

    async function deleteTastoRecipe(recipeTitle) {
        try {
            const url = `https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382`; // Tasto Bin
            const headers = {
                'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6',
                'Content-Type': 'application/json'
            };

            // Fetch the current data from the Tasto bin
            const response = await axios.get(url, { headers });
            console.log("response", response);
            const data = response.data.record;
            console.log("deleteTastoRecipe", data);

            // Filter out the recipe based on `title` for Tasto structure
            data.recipes = data.recipes.filter(recipe => recipe.title !== recipeTitle);
            console.log("tasto data.recipes", data.recipes);

            // Send the updated data back to JSON Bin
            await axios.put(url, data, { headers });
            console.log(`Recipe with title "${recipeTitle}" has been deleted from Tasto Bin`);
        } catch (error) {
            console.error('Error deleting recipe from Tasto Bin:', error);
        }
    }

});