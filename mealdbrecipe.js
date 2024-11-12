let currentRecipe = {};  // Declare a global variable to store the current recipe data

// Serve size buttons to adjust the servings
document.querySelector("#decreaseServing").addEventListener("click", adjustServings);
document.querySelector("#increaseServing").addEventListener("click", adjustServings);

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


// Load the recipe on page load
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mealName = urlParams.get('mealName');

    if (mealName) {
        const recipe = await fetchRecipeFromMealDb(mealName);
        if (recipe) {
            console.log("recipe", recipe); //todo does not contain the thumbnail and that's fine cos it's rendering the full recipe that doesn't require thumbnail. 
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

        // Initialize serving size buttons based on the default serving size
        updateServingButtons();
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

// Format recipe object to the desired JSON bin structure
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
//todo to add more regex for the ingredients.
function parseIngredient(ingredient) {
    const result = {
        quantity: "",
        unit: "",
        name: ingredient
    };

    // Regular expression to match numbers followed immediately by letters (unit)
    const quantityUnitPattern = /^(\d+(\.\d+)?)([a-zA-Z]+)(.*)/;

    const match = ingredient.trim().match(quantityUnitPattern);

    if (match) {
        // If matched, split the ingredient into quantity, unit, and name
        result.quantity = match[1];  // The number part
        result.unit = match[3];      // The unit part (letters)
        result.name = match[4].trim(); // The remaining part (ingredient name)
    } else {
        // If no match, the entire string is considered as name, quantity and unit are empty
        result.name = ingredient.trim();
    }

    return result;
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

// Function to render the ingredients list
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

// Function to render the cooking steps
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

// Adjust the servings and ingredient quantities
async function adjustServings(event) {
    const servingSizeElement = document.querySelector("#servingSize");
    let currentServings = parseInt(servingSizeElement.innerText);
    const action = event.target.id;

    const originalServings = 1;  // Assuming 1 serving is the base scale

    // Adjust the servings based on the action clicked
    if (action === "decreaseServing" && currentServings > 1) {
        currentServings -= 1;
    } else if (action === "increaseServing") {
        currentServings += 1;
    }

    // Update the serving size displayed on the page and in the recipe object
    servingSizeElement.innerText = currentServings;
    currentRecipe.serves = currentServings;

    // Update ingredient quantities based on the new serving size
    currentRecipe.ingredients.forEach((ingredient, index) => {
        const scaleFactor = currentServings / originalServings;
        const newQuantity = (ingredient.baseQuantity * scaleFactor).toFixed(2);
        ingredient.quantity = newQuantity;

        // Update the displayed ingredient quantity in the DOM
        const ingredientElement = document.querySelector(`#ingredient-${index}`);
        ingredientElement.textContent = `${newQuantity} ${ingredient.unit || ''} of ${ingredient.name}`;
    });

    updateServingButtons();
}

// Function to update the state of serving buttons
function updateServingButtons() {
    const decreaseButton = document.querySelector("#decreaseServing");
    const currentServings = parseInt(document.querySelector("#servingSize").innerText);

    // Disable the decrease button if servings are at 1
    if (currentServings <= 1) {
        decreaseButton.disabled = true;
    } else {
        decreaseButton.disabled = false;
    }
}

// Function to save or update the recipe in JSON Bin without overwriting existing recipes
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
        console.log("data", data);

        let recipes = Array.isArray(data.record.recipes) ? data.record.recipes : [];
        console.log("recipes", recipes);

        // Step 2: Check if the recipe already exists by title
        const existingRecipeIndex = recipes.findIndex(r => r.title === recipe.title);
        console.log("existingRecipeIndex", existingRecipeIndex);

        if (existingRecipeIndex > -1) {
            // If the recipe exists, update it
            recipes[existingRecipeIndex] = recipe; // Replace the existing recipe
        } else {
            // If it doesn't exist, add the new recipe
            recipes.push(recipe);
            console.log("New recipe added");
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



