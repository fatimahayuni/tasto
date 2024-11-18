# Recipe Web App

Welcome to the **Recipe Web App**! This web app allows users to search, explore, and manage a collection of recipes from multiple sources, including MealDB and Tasto Bin. Users can search for recipes, view details, and delete unwanted recipes with ease. It integrates data from multiple APIs, providing a rich and diverse recipe database.

## Features

- **Search for Recipes**: Search for recipes based on ingredients or dish names.
- **Recipe Integration**: Combines recipes from MealDB and Tasto Bin APIs.
- **Recipe Display**: Shows recipes with images, cuisine type, and more.
- **Delete Recipes**: Users can remove recipes from the list, with a confirmation dialog.
- **Responsive Design**: Mobile-friendly and accessible design for all devices.
- **Recipe Details**: View detailed recipe information, including ingredients and instructions.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Uses external APIs from MealDB and Tasto Bin (no server-side code required).
- **Libraries**: 
  - [Axios](https://axios-http.com/) for making API requests.
  - [SweetAlert2](https://sweetalert2.github.io/) for user-friendly alerts.
  - [Bootstrap](https://getbootstrap.com/) for responsive design.

## How to Use

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/recipe-web-app.git

## Learnings

Working on this project has helped me enhance my skills in several areas:

- **API Integration**: I learned how to work with third-party APIs (MealDB and Tasto Bin) to fetch data dynamically and display it in a web application.
- **Asynchronous JavaScript**: Using `Axios` for making API requests allowed me to dive deeper into promises and handling asynchronous code effectively.
- **Frontend Development**: I improved my frontend skills by creating a responsive design using **HTML**, **CSS**, and **Bootstrap** to ensure the app works on both desktop and mobile devices.
- **User Interface Design**: By implementing the search functionality and user-friendly pop-ups with **SweetAlert2**, I learned more about creating intuitive and interactive user interfaces.
- **Debugging and Problem Solving**: Debugging API calls and resolving issues like CORS errors taught me how to troubleshoot and find workarounds for common web development challenges.

## Future Improvements

Here are some areas I plan to focus on for future versions of the app:

- **Refactoring**
- **Cleaning Up The Cooking Steps Further**: Currently the steps for each recipe from the mealdb.com are not standardized and the current regex does not address all possible string issues. 
- **User Authentication**: Adding user authentication so users can save their favorite recipes or create custom recipe collections.
- **Recipe Rating and Comments**: Allowing users to rate recipes and leave comments would help other users decide which recipes to try.
- **Nutrition Information**: Adding nutritional information for each recipe, like calories, carbs, proteins, and fats, to help users make healthier choices.
- **Offline Access**: Implementing a feature that allows users to save recipes for offline use, especially when they don’t have access to the internet.
- **Enhanced Search Filters**: Adding more filtering options like cuisine type, meal course (breakfast, lunch, dinner), and dietary restrictions (vegan, gluten-free, etc.).