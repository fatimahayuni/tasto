let currentRecipe = {};  // Declare a global variable to store the current recipe data

// Load the recipe on page load
document.addEventListener("DOMContentLoaded", async function () {
    // Load the recipe data
    const urlParams = new URLSearchParams(window.location.search);
    const mealName = urlParams.get('mealName');

    const servingSizeElement = document.querySelector("#servingSize");
    const saveButton = document.querySelector("#saveButton");
    const increaseButton = document.querySelector("#increaseButton");
    increaseButton.addEventListener("click", function () {
        adjustServingSize("increase");
    });
    const decreaseButton = document.querySelector("#decreaseButton");
    decreaseButton.addEventListener("click", function () {
        adjustServingSize("decrease");
    });

    // Save button
    document.querySelector("#saveButton").addEventListener("click", async () => {
        if (currentRecipe && currentRecipe.title) {
            const formattedRecipe = formatRecipeForJsonBin(currentRecipe);
            await saveRecipeToJsonBin(formattedRecipe);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Recipe saved successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            console.error("No recipe to save.");
        }
    });

    function adjustServingSize(action) {
        let currentServingSize = parseInt(servingSizeElement.innerText);

        // Adjust the serving size based on the action
        if (action === "increase") {
            currentServingSize += 1;
        } else if (action === "decrease" && currentServingSize > 1) {
            currentServingSize -= 1;
        }

        // Update the text content of the serving size element
        servingSizeElement.innerText = currentServingSize;

        // Disable the decrease button if the serving size is 1
        if (currentServingSize === 1) {
            decreaseButton.disabled = true;  // Disable when serving size is 1
        } else {
            decreaseButton.disabled = false;  // Enable when serving size is greater than 1
        }

        // Adjust the ingredient quantities based on the new serving size.
        currentRecipe.ingredients.forEach((ingredient, index) => {
            const scaleFactor = currentServingSize / 1;
            const newQuantity = Math.round(ingredient.baseQuantity * scaleFactor);
            ingredient.quantity = newQuantity;

            // Update the displayed ingredient quantity in the DOM
            const ingredientElement = document.querySelector(`#ingredient-${index}`);
            ingredientElement.textContent = `${newQuantity} ${ingredient.unit || ''} of ${ingredient.name}`;
        });
    }

    if (mealName) {
        const recipe = await fetchRecipeFromMealDb(mealName);
        if (recipe) {
            currentRecipe = recipe;

            // Store original ingredient quantities as baseQuantity
            currentRecipe.ingredients.forEach(ingredient => {
                ingredient.baseQuantity = parseFloat(ingredient.quantity) || 0;  // Store the base quantity as a float

            });

            renderRecipeTitle(recipe);
            renderRecipeImage(recipe);
            renderIngredients(recipe.ingredients);
            renderCookingSteps(recipe.steps);
        } else {
            console.error("Recipe not found.");
        }
    } else {
        console.error("No mealName found in the URL.");
    }
});

// Fetch data from TheMealDB API
async function fetchRecipeFromMealDb(mealName) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
            const meal = data.meals[0];
            const recipe = {
                title: meal.strMeal,
                cuisineOrigin: meal.strArea,
                serves: 1,
                imageUrl: meal.strMealThumb,
                ingredients: extractIngredients(meal),
                steps: meal.strInstructions.split('. ').filter(step => step.trim() !== "")  // Split steps by periods
            };
            return recipe;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return null;
    }
}

// Format recipe object to the desired JSON bin structure to put in JSON Bin
function formatRecipeForJsonBin(recipe) {
    return {
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        cuisineOrigin: recipe.cuisineOrigin,
        serves: recipe.serves.toString(),
        ingredients: recipe.ingredients.map(ingredient => ({
            quantity: ingredient.quantity || "N/A",
            unit: ingredient.unit || "",
            name: ingredient.name
        })),
        steps: recipe.steps
    };
}

// Helper function to extract ingredients from the meal object
function extractIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {  // TheMealDB API provides up to 20 ingredients
        const ingredientName = meal[`strIngredient${i}`];
        const ingredientQuantity = meal[`strMeasure${i}`];


        if (ingredientName && ingredientName.trim() !== "") {
            // Parse the ingredient using the helper function
            const parsedIngredient = parseIngredient(`${ingredientQuantity} ${ingredientName}`);

            // Push the parsed ingredient
            ingredients.push(parsedIngredient);

        }
    }


    return ingredients;
}

// Helper function to parse ingredient quantity and unit
function parseIngredient(ingredient) {
    const result = {
        quantity: "",
        unit: "",
        name: ingredient
    };

    // Handle the case where "of" is in the ingredient
    ingredient = ingredient.trim().replace(/^of\s+/i, "");

    // Updated regex to handle fractions, units, and special cases
    const quantityUnitPattern = /^(\d+(\.\d+)?(?:\/\d+)?|\b(pinch|cloves)\b)?\s?([a-zA-Z]+)?\s?(.*)/;

    const match = ingredient.match(quantityUnitPattern);

    if (match) {
        if (match[1]) {
            let quantity = match[1].trim();

            // Handle fractions like 1/2
            if (quantity.includes('/')) {
                const fraction = quantity.split('/');
                result.quantity = parseFloat(fraction[0]) / parseFloat(fraction[1]);
            } else if (!isNaN(parseFloat(quantity))) {
                // Handle whole numbers and decimal numbers
                result.quantity = parseFloat(quantity);
            } else {
                result.quantity = quantity;  // Keep it as a string for special cases (like "Pinch")
            }
        }

        if (match[4]) {
            result.unit = match[4].trim();      // Unit like "tbs", "L", "g", etc.
        }

        if (match[5]) {
            result.name = match[5].trim();      // The ingredient name
        } else {
            result.name = ingredient.trim();    // If no name, the whole ingredient is the name
        }

        // Special handling for "Pinch" and "Cloves"
        if (result.quantity === "Pinch" || result.quantity === "cloves") {
            result.unit = result.quantity;   // Pinch or Cloves as the unit
            result.quantity = "";            // Reset the quantity field
        }
    }

    return result;
}


async function saveRecipeToJsonBin(recipe) {
    const jsonBinAPIKey = '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6';
    const jsonBinUrl = 'https://api.jsonbin.io/v3/b/672ddd85acd3cb34a8a4edf7';

    try {
        // Step 1: Fetch existing recipes from JSON Bin
        const response = await fetch(jsonBinUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': jsonBinAPIKey
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch existing recipes", await response.text());
            return;
        }

        const data = await response.json();

        let recipes = Array.isArray(data.record.recipes) ? data.record.recipes : [];

        // Step 2: Check if the recipe already exists by title
        const existingRecipeIndex = recipes.findIndex(r => r.title === recipe.title);

        if (existingRecipeIndex > -1) {
            // If the recipe exists, update it
            recipes[existingRecipeIndex] = recipe; // Replace the existing recipe
        } else {
            // If it doesn't exist, add the new recipe
            recipes.push(recipe);
        }

        // Step 3: Save the updated recipes list back to JSON Bin
        const updateResponse = await fetch(jsonBinUrl, {
            method: 'PUT', // Replace the whole array of recipes
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': jsonBinAPIKey
            },
            body: JSON.stringify({ recipes })
        });

        if (updateResponse.ok) {
        } else {
        }
    } catch (error) {
        console.error("Error saving recipe to JSON Bin:", error);
    }
}

// Rendering functions
function renderRecipeTitle(recipe) {
    const titleElement = document.querySelector("#recipeTitle");
    titleElement.innerText = recipe.title || "Untitled Recipe";

    const servingSizeElement = document.querySelector("#servingSize");
    servingSizeElement.innerText = recipe.serves || "1";
    document.title = recipe.title || "Recipe Page";
}

function renderRecipeImage(recipe) {
    const recipeImageElement = document.querySelector("#recipeImage");
    if (recipe.imageUrl) {
        recipeImageElement.innerHTML = `<img src="${recipe.imageUrl}" class="img-fluid centered-image" alt="${recipe.title}">`;
    }
}

function renderIngredients(ingredients) {
    const ingredientsListContainer = document.querySelector("#ingredientsListContainer");
    ingredientsListContainer.innerHTML = '';  // Clear existing content

    if (ingredients && ingredients.length > 0) {
        ingredients.forEach((ingredient, index) => {
            const ingredientElement = document.createElement("div");
            const ingredientName = ingredient.name;
            const ingredientQuantity = ingredient.quantity;
            const ingredientUnit = ingredient.unit || '';

            // Create element structure for each ingredient
            ingredientElement.innerHTML = `
                <div>
                    <span id="ingredient-${index}">${ingredientQuantity} ${ingredientUnit} of ${ingredientName}</span>
                </div>
            `;
            ingredientsListContainer.appendChild(ingredientElement);
        });
    } else {
        ingredientsListContainer.innerHTML = '<div>No ingredients available.</div>';
    }
}

function renderCookingSteps(steps) {
    const cookingStepsContainer = document.querySelector("#cookingStepsContainer");
    cookingStepsContainer.innerHTML = '';

    if (steps && steps.length > 0) {
        const olElement = document.createElement("ol");
        steps.forEach(step => {
            const stepElement = document.createElement("li");
            stepElement.classList.add("py-1", "li-black-bg", "my-2");
            stepElement.innerText = step;
            olElement.appendChild(stepElement);
        });
        cookingStepsContainer.appendChild(olElement);
    } else {
        cookingStepsContainer.innerHTML = '<div>No cooking steps available.</div>';
    }
}


