// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const uploader = uploadcare.fileUploader.init({
        ctxName: 'my-uploader',
        onFileChange: (file) => {
            const preview = document.getElementById('preview');
            preview.innerHTML = `<img src="${file.cdnUrl}" alt="Uploaded Recipe Photo" class="img-fluid" />`;
        },
        onError: (error) => {
            console.error('Upload error:', error);
        }
    });
});


// Function to add an ingredient container with the exact structure
function addIngredientContainer() {
    // Get the container where the ingredients will be added
    const ingredientContainer = document.getElementById('ingredient-container');

    // Create a new li element for the ingredient
    const newIngredientLi = document.createElement('li');
    newIngredientLi.draggable = true; // Make it draggable
    newIngredientLi.classList.add('list-item', 'd-flex', 'justify-content-between'); // Matches original list item classes

    // Add the exact HTML structure for the new ingredient item
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

    // Append the new ingredient li to the ingredient container
    ingredientContainer.appendChild(newIngredientLi);
}

// Function to remove an ingredient container
function removeIngredient(element) {
    const ingredientLi = element.closest('li');
    if (ingredientLi) {
        ingredientLi.remove();
    }
}

// Function to add a step container with the exact structure
function addStepContainer() {
    // Get the container where the steps will be added
    const stepContainer = document.getElementById('step-container');

    // Create a new li element for the step
    const newStepLi = document.createElement('li');
    newStepLi.draggable = true; // Make it draggable
    newStepLi.classList.add('d-flex', 'justify-content-between'); // Matches original list item classes

    // Add the exact HTML structure for the new step item
    newStepLi.innerHTML = `
        <div class="col-md-1"><img src="/assets/drag.png" alt="drag"></div>
        <div class="col-md-10">
            <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" placeholder="Text A"></textarea>
            </div>
        </div>
        <div class="col-md-1 d-flex justify-content-end"><img src="/assets/delete.png" alt="delete" onclick="removeStep(this)"></div>
    `;

    // Append the new step li to the step container
    stepContainer.appendChild(newStepLi);
}

// Function to remove a step container
function removeStep(element) {
    const stepLi = element.closest('li');
    if (stepLi) {
        stepLi.remove();
    }
}

// Event listener for the "+ Ingredient" link
const addIngredientLink = document.getElementById('add-ingredient');
addIngredientLink.addEventListener('click', function (event) {
    event.preventDefault();
    addIngredientContainer();
});

// Event listener for the "+ Step" link
const addStepLink = document.getElementById('add-step');
addStepLink.addEventListener('click', function (event) {
    event.preventDefault();
    addStepContainer();
});