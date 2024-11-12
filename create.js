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
            alert("Recipe saved successfully!");
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

        ingredientContainer.appendChild(newIngredientLi);
    }

    window.removeIngredient = function (element) {
        const ingredientLi = element.closest('li');
        if (ingredientLi) {
            ingredientLi.remove();
        }
    };

    function addStepContainer() {
        const stepContainer = document.getElementById('sortable-steps');
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

    window.removeStep = function (element) {
        const stepLi = element.closest('li');
        if (stepLi) {
            stepLi.remove();
        }
    };

    document.getElementById('add-ingredient').addEventListener('click', function (event) {
        event.preventDefault();
        addIngredientContainer();
    });

    document.getElementById('add-step').addEventListener('click', function (event) {
        event.preventDefault();
        addStepContainer();
    });
});

async function getImageUrl(uuid) {
    const publicKey = 'b2d8b3ed8d9768dfcbae';
    const secretKey = '2be26da0b270789cd1e6';

    const response = await axios.get(`https://api.uploadcare.com/files/${uuid}/`, {
        headers: {
            'Authorization': `Uploadcare.Simple ${publicKey}:${secretKey}`,
            'Content-Type': 'application/json'
        }
    });

    const imageUrl = response.data.original_file_url;
    console.log("Image URL", imageUrl);
    return imageUrl
};




