document.addEventListener("DOMContentLoaded", async function () {

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

            let cardElement = document.createElement("div");
            cardElement.classList.add("col");

            // Add the delete functionality to each card
            cardElement.innerHTML = `
            <a href="${recipeLink}" target="_blank" class="text-decoration-none">
                <div class="card card-image h-100">
                   <img src="${imageUrl}" class="card-img-top standard-size" alt="${recipe.title}">
                    <div class="card-body black-bg">
                        <h5 class="card-food-name white-text">${recipe.title || 'No Title Available'}</h5>
                        <p class="card-cuisine">${recipe.cuisineOrigin || 'Cuisine not specified'}</p>
                        <div class="">
                            <img src="assets/delete.png" class="small-size delete-icon" data-title="${recipe.title}" data-source="${recipe.source}" alt="Delete">
                        </div>
                    </div>
                </div>
            </a>`;

            outputElement.appendChild(cardElement);
        });

        // Attach the event listener to all delete icons
        //     const deleteIcons = document.querySelectorAll('.delete-icon');
        //     deleteIcons.forEach(icon => {
        //         icon.addEventListener('click', async (e) => {
        //             e.preventDefault();
        //             const recipeTitle = icon.getAttribute('data-title');
        //             const source = icon.getAttribute('data-source');

        //             // Call the appropriate delete function based on the source
        //             if (source === 'mealdb') {
        //                 await deleteMealdbRecipe(recipeTitle);
        //             } else if (source === 'tasto') {
        //                 await deleteTastoRecipe(recipeTitle);
        //             }

        //             // Remove the recipe card from the UI
        //             icon.closest('.col').remove();
        //         });
        //     }
        // );

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