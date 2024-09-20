async function searchRecipe(recipeName) {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
    return response.data;
}

async function displayRecipe(recipe) {
    const outputElement = document.querySelector("#output");
    outputElement.innerHTML = `
    <div class="col">
        <div class="card card-image h-100">
          <img id="foodPic" src="${recipe.meals[0].strMealThumb}" class="card-img-top standard-size" alt="...">
          <div class="card-body black-bg">
            <h5 class="card-food-name white-text" id="foodName">${recipe.meals[0].strMeal}</h5>
            <p class="card-cuisine" id="foodCuisine">${recipe.meals[0].strArea}</p>
          </div>
        </div>
      </div>
    `
}

document.addEventListener("DOMContentLoaded", async function(){
    const button = document.querySelector("#submit");
    button.addEventListener("click", async function() {
        const searchElement = document.querySelector("#searchTerms");
        const searchTerms = searchElement.value;

        const recipe = await searchRecipe(searchTerms);
        console.log(recipe);

        displayRecipe(recipe);
    })
    
})