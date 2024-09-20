async function searchRecipe(recipeName) {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
    return response.data;
}

async function displayRecipe(recipe) {
    const outputElement = document.querySelector("#output");
    for (let a of recipe.meals) {
        // Create a div for each recipe card
        let cardElement = document.createElement("div");
        cardElement.classList.add("col"); 

        // Populate the inner hTML with the recipe details:
        cardElement.innerHTML = `
        <div class="card card-image h-100">
              <img src="${a.strMealThumb}" class="card-img-top standard-size" alt="${a.strMeal}">
              <div class="card-body black-bg">
                <h5 class="card-food-name white-text">${a.strMeal}</h5>
                <p class="card-cuisine">${a.strArea}</p>
              </div>
            </div>`;

        // Append the card to the output container
        outputElement.appendChild(cardElement);

    }
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