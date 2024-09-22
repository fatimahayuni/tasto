// Helper function to get the query params from the URL.
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Extract parameters from the URL
const mealId = getQueryParam("mealId");
const mealName = getQueryParam("mealName");

// Function to fetch recipe details using teh mealId
async function fetchRecipeDetails(mealId) {
  const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  console.log(response.data);
  return response.data;
  
}

fetchRecipeDetails(mealId);

displayRecipeDetails

