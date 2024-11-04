// Load environment variables
require('dotenv').config();

// Access the environment variables
const BASE_JSON_BIN_URL = process.env.BASE_JSON_BIN_URL;
const BIN_ID = process.env.BIN_ID;
const MASTER_KEY = process.env.MASTER_KEY;

console.log(BASE_JSON_BIN_URL, BIN_ID, MASTER_KEY);

// Counters for ingredients and steps
let ingredientCounter = 1;
let stepCounter = 1;

// Function to add a new ingredient
function addIngredient() {
    ingredientCounter++;
    const newIngredient = document.createElement('li');
    newIngredient.className = 'list-item';
    newIngredient.draggable = 'true';
    newIngredient.id = `ingredient-${ingredientCounter}`; // Assign unique ID

    newIngredient.innerHTML = `
        <div class="row">
            <div class="col-md-1 d-flex justify-content-center">
                <img src="/assets/drag.png">
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
                <img src="/assets/delete.png" onclick="deleteIngredient('${newIngredient.id}')">
            </div>
        </div>
    `;

    document.getElementById('ingredient-container').appendChild(newIngredient);
}

// Function to delete an ingredient
function deleteIngredient(id) {
    const ingredient = document.getElementById(id);
    if (ingredient) {
        ingredient.remove();
    }
}

// Function to add a new step
function addStep() {
    stepCounter++;
    const newStep = document.createElement('li');
    newStep.className = 'list-item d-flex justify-content-between';
    newStep.draggable = 'true';
    newStep.id = `step-${stepCounter}`; // Assign unique ID

    newStep.innerHTML = `
        <div class="col-md-1">
            <img src="/assets/drag.png">
        </div>
        <div class="col-md-10">
            <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" placeholder="Step description"></textarea>
            </div>
        </div>
        <div class="col-md-1 d-flex justify-content-end">
            <img src="/assets/delete.png" onclick="deleteStep('${newStep.id}')">
        </div>
    `;

    document.getElementById('step-container').appendChild(newStep);
}

// Function to delete a step
function deleteStep(id) {
    const step = document.getElementById(id);
    if (step) {
        step.remove();
    }
}

// Attach event listeners to the add ingredient and step links
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-ingredient').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link action
        addIngredient();
    });

    document.getElementById('add-step').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link action
        addStep();
    });
});

// Function to initialize the drag and drop functionality
function enableDragAndDrop() {
    const ingredientContainer = document.getElementById('ingredient-container');
    const stepContainer = document.getElementById('step-container');

    // Event delegation for ingredients
    ingredientContainer.addEventListener('dragstart', (e) => {
        if (e.target.closest('.list-item')) {
            const draggingItem = e.target.closest('.list-item');
            draggingItem.classList.add('dragging');
            e.dataTransfer.setData("text/plain", draggingItem.outerHTML); // Save the item's HTML
        }
    });

    ingredientContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    ingredientContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const dropTarget = e.target.closest('.list-item');
        if (dropTarget && draggingItem !== dropTarget) {
            dropTarget.parentNode.insertBefore(draggingItem, dropTarget);
        }
        draggingItem.classList.remove('dragging');
    });

    // Repeat similar event delegation for steps
    stepContainer.addEventListener('dragstart', (e) => {
        if (e.target.closest('.list-item')) {
            const draggingItem = e.target.closest('.list-item');
            draggingItem.classList.add('dragging');
            e.dataTransfer.setData("text/plain", draggingItem.outerHTML);
        }
    });

    stepContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });

    stepContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const dropTarget = e.target.closest('.list-item');
        if (dropTarget && draggingItem !== dropTarget) {
            dropTarget.parentNode.insertBefore(draggingItem, dropTarget);
        }
        draggingItem.classList.remove('dragging');
    });
}

// Call the function to enable drag and drop after the DOM has loaded
document.addEventListener('DOMContentLoaded', enableDragAndDrop);
