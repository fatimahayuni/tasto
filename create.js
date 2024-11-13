document.addEventListener('DOMContentLoaded', function () {

    const saveButton = document.querySelector('#save-btn');

    const uploaderCtx = document.querySelector('#uploaderctx');
    console.log("uploaderCtx", uploaderCtx);

    // Get reference to the API instance
    const api = uploaderCtx.getAPI()
    console.log("api: ", api);

    // Use the API methods
    const collectionState = api.getOutputCollectionState()

    // Add event listener for the file upload success event
    uploaderCtx.addEventListener('file-upload-success', async (e) => {
        const uuid = e.detail.uuid;

        // Set a hidden input to pass UUID in form
        document.getElementById('image-url').value = uuid;

        try {
            // Retrieve and display the image URL
            const imageUrl = await getImageUrl(uuid);
            document.getElementById('image-url').value = imageUrl;

        } catch (error) {
            console.error("Error getting image URL:", error);
        }

    })

    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log("Save button clicked.");

        const imageUrl = document.getElementById('image-url').value;
        const title = document.getElementById('recipe-title').value;
        const cuisineOrigin = document.getElementById('cuisine-origin').value;
        const serves = document.getElementById('serves-number').value;

        const ingredients = Array.from(document.querySelectorAll('#sortable-ingredients li')).map(li => ({
            quantity: li.querySelector('input[aria-label="Quantity"]').value,
            unit: li.querySelector('input[aria-label="Unit"]').value,
            name: li.querySelector('input[aria-label="Ingredient Name"]').value
        }));

        const steps = Array.from(document.querySelectorAll('#sortable-steps li')).map(li =>
            li.querySelector('textarea').value
        );

        const recipeData = { imageUrl, title, cuisineOrigin, serves, ingredients, steps };
        console.log("recipeData", recipeData);

        try {
            // Step 1: Fetch the existing data from the bin
            const existingDataResponse = await axios.get('https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382', {
                headers: {
                    'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6'
                }
            });

            const existingRecipes = existingDataResponse.data.record.recipes || []; // Get the existing recipes or initialize an empty array if none exist

            // Step 2: Append the new recipe to the existing recipes array
            existingRecipes.push(recipeData);

            // Step 3: Send the updated data back to JSON Bin
            const response = await axios.put('https://api.jsonbin.io/v3/b/672e286fe41b4d34e450e382', {
                recipes: existingRecipes // Update the entire record with the new array
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': '$2a$10$hizbF/WWO7aCi8N9hdKNKuDWhS.ADUD.qn6O4zhWBRRdlOa8ls7t6',
                    'X-Bin-Name': 'tasto',
                    'X-Bin-Private': 'false'
                }
            });

            console.log("Recipe saved successfully:", response.data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Recipe created and successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error("Error saving recipe:", error);
            alert("Failed to save recipe.");
        }
    });

    function addIngredientContainer() {
        const ingredientContainer = document.getElementById('sortable-ingredients');
        const newIngredientLi = document.createElement('li');
        newIngredientLi.draggable = true;
        newIngredientLi.classList.add('list-item', 'd-flex', 'justify-content-between');

        newIngredientLi.innerHTML = `
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