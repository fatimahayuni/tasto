async function searchRecipe(recipeName) {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
    return response.data;
}

async function displayRecipe(recipe) {
    const outputElement = document.querySelector("#output");
    outputElement.innerHTML = `
    <h1>${recipe.meals[0].strMeal}</h1>
    <p>${recipe.meals[0].strArea}</p>
    <img src="${recipe.meals[0].strMealThumb}">
    
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