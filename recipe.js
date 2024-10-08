// Helper function to get the query params from the URL.
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Extract parameters from the URL
const mealId = getQueryParam("mealId");

// Function to fetch recipe details using teh mealId
async function fetchRecipeDetails(mealId) {
  const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  return response.data;

}

// Function to display recipe details
async function displayRecipeDetails() {
  const data = await fetchRecipeDetails(mealId);
  console.log(data);
  const meal = data.meals[0];

  // Set the image output div.
  const imageDiv = document.querySelector("#recipeImage");

  // Set the title output div.
  const titleDiv = document.querySelector("#recipeTitle")

  //Set the title and image.
  titleDiv.innerHTML = `${meal.strMeal}`
  imageDiv.innerHTML = `
  <img src="${meal.strMealThumb}" />`;

  //todo Ingredients listing
  // Set the ingredient row output div.
  const ingredientList = document.querySelector("#ingredientRow");

  let x = 1;
  let ingredientsHTML = '';


  //loop through the strIngredient[x] object until it hits null value. 
  while (meal[`strIngredient${x}`] && meal[`strMeasure${x}`]) {
    const ingredient = meal[`strIngredient${x}`].trim();
    const ingredientQty = meal[`strMeasure${x}`].trim();

    // Append the ingredient and measurements to the HTML
    ingredientsHTML += `
      <div class="row" id="ingredientRow">
          <div class="col-8">${ingredient}</div>
          <div class="col-4 d-flex justify-content-end">${ingredientQty}</div>
      </div>`;
    x++;
  }

  // Set the innerHTML of ingredientList after the loop
  ingredientList.innerHTML = ingredientsHTML;


  // Split the instructions by "\r\n" to get each step.
  const steps = meal.strInstructions.split("\r\n");


  // Clear previous content
  const stepsContainer = document.querySelector("#cookingStepsContainer");
  stepsContainer.innerHTML = '';

  // Loop through each step and display it. 
  for (let index = 0; index < steps.length; index++) {
    const step = steps[index].trim();
    if (step !== "") {
      stepsContainer.innerHTML +=
        `
      <div class="row">
          <div class="col-1">${index + 1}</div>
          <div class="col-11">${step}</div>
        </div>
      `
    }
  }
}

displayRecipeDetails()
