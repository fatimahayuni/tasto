const JSON_BIN_BASE_URL = "https://api.jsonbin.io/v3";
const JSON_BIN_ID = "672a3444acd3cb34a8a31e93";

async function loadRecipes() {
    try {
        const response = await axios.get(`${JSON_BIN_BASE_URL}/b/${JSON_BIN_ID}`);
        console.log(response.data);
        return response.data.record;
    } catch (error) {
        console.error("Failed to load recipes:", error);
    }
}


// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async function () {
    let recipes = await loadRecipes()
    console.log('Recipes', recipes);

    const saveButton = document.querySelector('#save-btn');

    // Add click event listener for the save button
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log("Save button clicked.");

        // Collect data from each part of the form
        const title = document.getElementById('recipe-title').value;
        const description = document.getElementById('recipe-description').value;
        const serves = document.getElementById('serves-number').value;
        const cookTime = document.getElementById('cook-time').value;

        // Gather ingredients data
        const ingredients = Array.from(document.querySelectorAll('#sortable-ingredients li')).map(li => ({
            quantity: li.querySelector('input[aria-label="Quantity"]').value,
            unit: li.querySelector('input[aria-label="Unit"]').value,
            name: li.querySelector('input[aria-label="Ingredient Name"]').value
        }));

        // Gather steps data
        const steps = Array.from(document.querySelectorAll('#sortable-steps li')).map(li =>
            li.querySelector('textarea').value
        );

        // Log the collected data
        console.log({ title, description, serves, cookTime, ingredients, steps });
    });

    // Function to add an ingredient container with the exact structure
    function addIngredientContainer() {
        const ingredientContainer = document.getElementById('sortable-ingredients');
        const newIngredientLi = document.createElement('li');
        newIngredientLi.draggable = true;
        newIngredientLi.classList.add('list-item', 'd-flex', 'justify-content-between');

        newIngredientLi.innerHTML = `
            <div class="col-md-1"><img src="/assets/drag.png" alt="drag"></div>
            <div class="col-md-2">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="2" aria-label="Quantity">
                </div>
            </div>
            <div class="col-md-2">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="inches" aria-label="Unit">
                </div>
            </div>
            <div class="col-md-5">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="ginger" aria-label="Ingredient Name">
                </div>
            </div>
            <div class="col-md-1 d-flex justify-content-end"><img src="/assets/delete.png" alt="delete" onclick="removeIngredient(this)"></div>
        `;

        ingredientContainer.appendChild(newIngredientLi);
    }

    // Function to remove an ingredient container
    window.removeIngredient = function (element) { // Make this function global
        const ingredientLi = element.closest('li');
        if (ingredientLi) {
            ingredientLi.remove();
        }
    };

    // Function to add a step container with the exact structure
    function addStepContainer() {
        const stepContainer = document.getElementById('sortable-steps'); // Update this line
        const newStepLi = document.createElement('li');
        newStepLi.draggable = true;
        newStepLi.classList.add('d-flex', 'justify-content-between');

        newStepLi.innerHTML = `
            <div class="col-md-1"><img src="/assets/drag.png" alt="drag"></div>
            <div class="col-md-10">
                <div class="input-group">
                    <textarea class="form-control" aria-label="With textarea" placeholder="Step details..."></textarea>
                </div>
            </div>
            <div class="col-md-1 d-flex justify-content-end"><img src="/assets/delete.png" alt="delete" onclick="removeStep(this)"></div>
        `;

        stepContainer.appendChild(newStepLi);
    }

    // Function to remove a step container
    window.removeStep = function (element) { // Make this function global
        const stepLi = element.closest('li');
        if (stepLi) {
            stepLi.remove();
        }
    };

    // Event listener for the "+ Ingredient" link
    document.getElementById('add-ingredient').addEventListener('click', function (event) {
        event.preventDefault();
        addIngredientContainer();
    });

    // Event listener for the "+ Step" link
    document.getElementById('add-step').addEventListener('click', function (event) {
        event.preventDefault();
        addStepContainer();
    });
});



