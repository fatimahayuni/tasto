// Main function to render the recipe on page load
document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mealName = urlParams.get('mealName');

  if (mealName) {
    const recipe = await fetchRecipeFromJSONBin(mealName);
    if (recipe) {
      renderRecipeTitle(recipe);
      renderRecipeImage(recipe);
      renderIngredients(recipe.ingredients);
      renderCookingSteps(recipe.steps);
      updateIngredientQuantities(recipe); // Enable serving size update functionality
      handleFavoriteButtonClick();        // Enable favorite button functionality
      handleSaveButtonClick(recipe);            // Enable save button functionality

    } else {
      console.error("Recipe not found.");
    }
  } else {
    console.error("No mealName found in the URL.");
  }
});


// Fetch data from JSON Bin
async function fetchRecipeFromJSONBin(mealName) {
  try {
    const response = await axios.get('https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382', {
      headers: {
        'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
      }
    });

    console.log("response.data", response.data);

    const recipeObject = response.data.record.recipes;
    console.log("Fetched recipes", recipeObject);

    // Find the recipe that matches the mealName
    const recipe = recipeObject.find(r => r.title.toLowerCase() === mealName.toLowerCase());

    return recipe; // Return the recipe object if found, otherwise null
  } catch (error) {
    console.error("Error fetching recipe from JSON Bin:", error);
    return null;
  }
}

// Function to render the recipe title and serving size
function renderRecipeTitle(recipe) {
  const titleElement = document.querySelector("#recipeTitle");
  titleElement.innerText = recipe.title || "Untitled Recipe";

  const servingSizeElement = document.querySelector("#servingSize");
  servingSizeElement.innerText = recipe.serves || "1";

  // Dynamically set the <title> tag to reflect the recipe title
  document.title = recipe.title || "Recipe Page";
}

// Function to render recipe image
function renderRecipeImage(recipe) {
  const recipeImageElement = document.querySelector("#recipeImage");
  if (recipe.imageUrl) {
    recipeImageElement.innerHTML = `<img src="${recipe.imageUrl}" class="img-fluid centered-image" alt="${recipe.title}">`;
  }
}

// Function to render ingredients
function renderIngredients(ingredients) {
  const ingredientsListContainer = document.querySelector("#ingredientsListContainer");
  ingredientsListContainer.innerHTML = ''

  if (ingredients && ingredients.length > 0) {
    ingredients.forEach(ingredient => {
      const ingredientElement = document.createElement("div");
      const quantity = ingredient.scaledQuantity || ingredient.quantity;
      ingredientElement.innerText = `${quantity} ${ingredient.unit} of ${ingredient.name}`;
      ingredientsListContainer.appendChild(ingredientElement);
    });
  } else {
    ingredientsListContainer.innerHTML = '<div>No ingredients available.</div>';
  }
}


// Function to render cooking steps
function renderCookingSteps(steps) {
  const cookingStepsContainer = document.querySelector("#cookingStepsContainer");
  cookingStepsContainer.innerHTML = '';

  if (steps && steps.length > 0) {
    // Create an ordered list element
    const olElement = document.createElement("ol");

    steps.forEach(step => {
      const stepElement = document.createElement("li");
      stepElement.classList.add("py-1", "li-black-bg", "my-2");
      stepElement.innerText = step;
      olElement.appendChild(stepElement);
    });

    // Append the ordered list to the container
    cookingStepsContainer.appendChild(olElement);
  } else {
    cookingStepsContainer.innerHTML = '<div>No cooking steps available.</div>';
  }
}


// Function to handle the favorite button click
function handleFavoriteButtonClick() {
  const favoriteButton = document.querySelector("#favoriteButton");
  if (favoriteButton) {
    favoriteButton.addEventListener("click", () => {
      console.log("Add recipe to favorites"); // Implement favorite functionality here
    });
  }
}

// Function to update ingredient quantities based on the new serving size
function updateIngredientQuantities(recipe) {
  const decreaseButton = document.querySelector("#decreaseServing");
  const increaseButton = document.querySelector("#increaseServing");
  const servingSizeElement = document.querySelector("#servingSize");

  // Event listener for decrease button
  decreaseButton.addEventListener("click", function () {
    let currentServingSize = parseInt(servingSizeElement.innerText, 10);

    if (currentServingSize > 1) { // Prevent serving size from going below 1
      currentServingSize -= 1;
      servingSizeElement.innerText = currentServingSize; // Update the displayed serving size
      updateIngredientsQuantitiesAndRender(recipe, currentServingSize);
    }
  });

  // Event listener for increase button
  increaseButton.addEventListener("click", function () {
    let currentServingSize = parseInt(servingSizeElement.innerText, 10);
    currentServingSize += 1; // Increase serving size
    servingSizeElement.innerText = currentServingSize; // Update the displayed serving size
    updateIngredientsQuantitiesAndRender(recipe, currentServingSize);
  });

  // Function to scale ingredients based on the new serving size
  function updateIngredientsQuantitiesAndRender(recipe, newServingSize) {
    const originalServingSize = recipe.serves;

    if (!originalServingSize || !newServingSize) return;

    const scaleFactor = newServingSize / originalServingSize;

    // Adjust ingredients quantities based on the scale factor
    recipe.ingredients.forEach(ingredient => {
      const originalQuantity = ingredient.quantity;
      ingredient.scaledQuantity = (originalQuantity * scaleFactor).toFixed(0);
      // console.log(`Updated ingredient: ${ingredient.name} - ${ingredient.scaledQuantity}`);
    });

    // Re-render ingredients with updated quantities
    renderIngredients(recipe.ingredients);
  }
}

// Function to save recipe to JSON Bin
async function handleSaveButtonClick(recipe) {
  const saveButton = document.querySelector("#saveButton");
  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      console.log("button clicked", saveButton);
      await saveRecipeToJSONBin(recipe);
    });
  }
}


async function saveRecipeToJSONBin(recipe) {
  try {
    // Step 1: Fetch the current data (all recipes)
    const response = await axios.get('https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382', {
      headers: {
        'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
      }
    });
    console.log(response.data);

    const recipeObject = response.data.record.recipes;
    console.log(recipeObject);

    // Step 2: Find and update the specific recipe
    const mealName = recipe.title.toLowerCase();
    const recipeIndex = recipeObject.findIndex(r => r.title.toLowerCase() === mealName);

    if (recipeIndex !== -1) {
      // Update the recipe at the found index with new data
      recipeObject[recipeIndex] = {
        ...recipeObject[recipeIndex],  // Keep other properties of the recipe unchanged
        ingredients: recipe.ingredients,  // Update the ingredients array with the new quantities
        serves: parseInt(document.querySelector("#servingSize").innerText, 10)  // Update the serving size
      };

      // Step 3: Save the updated recipe collection back to JSONBin
      const updateResponse = await axios.put(
        'https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382',
        { recipes: recipeObject },
        {
          headers: {
            'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
          }
        }
      );

      if (updateResponse.status === 200) {
        console.log('Recipe updated successfully!');
        alert('Recipe saved successfully!');
      } else {
        console.error('Failed to save recipe.');
      }
    } else {
      console.error("Recipe not found in the collection.");
    }

  } catch (error) {
    console.error("Error saving recipe to JSON Bin:", error);
  }
}

