// Function to add an ingredient li
function addIngredientContainer() {
    // Get the container where the ingredients will be added
    const ingredientContainer = document.getElementById('ingredient-container');

    // Create a new li element for the ingredient
    const newIngredientLi = document.createElement('li');
    newIngredientLi.draggable = true; // Set draggable attribute
    newIngredientLi.classList.add('list-item'); // Add the same class as the original

    // Create input fields for the new ingredient
    newIngredientLi.innerHTML = `
        <div class="row">
            <div class="col-md-1 d-flex justify-content-center">
                <img src="/assets/drag.png" alt="Drag">
            </div>
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
                    <input type="text" class="form-control" placeholder="ginger" aria-label="Ingredient">
                </div>
            </div>
            <div class="col-md-1 d-flex justify-content-center">
                <img src="/assets/delete.png" alt="Delete" style="cursor: pointer;">
            </div>
        </div>
    `;

    // Append the new ingredient li to the container
    ingredientContainer.appendChild(newIngredientLi);
}

// Event listener for the "+ Ingredient" link
document.addEventListener('DOMContentLoaded', function () {
    const addIngredientLink = document.getElementById('add-ingredient');
    addIngredientLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default action of the link
        addIngredientContainer();
    });
});


// Function to add an step li
function addStepContainer() {
    // Get the container where the step will be added
    const stepContainer = document.getElementById('step-container');

    // Create a new li element for the ingredient
    const newStepLi = document.createElement('li');
    newStepLi.draggable = true;
    newStepLi.classList.add('list-item'); // Add the same class as the original

    // Create input fields for the new step
    newStepLi.innerHTML = `
        <div class="col-md-1">
            <img src="/assets/drag.png" style="cursor: grab;">
        </div>
        <div class="col-md-10">
            <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" placeholder="Text A"></textarea>
            </div>
        </div>
        <div class="col-md-1 d-flex justify-content-end">
            <img src="/assets/delete.png" style="cursor: pointer;">
        </div>
    `;

    // Append the new ingredient li to the container
    stepContainer.appendChild(newStepLi);
}



// Event listener for the "+ Step" link
document.addEventListener('DOMContentLoaded', function () {
    const addStepLink = document.getElementById('add-step');
    addStepLink.addEventListener('click', function (event) {
        event.preventDefault();
        addStepContainer();
    });
});