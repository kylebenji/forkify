## About

    - Forkify app created as a part of Javascript course by Jonas Schmedtmann on Udemy
    - Starter CSS and HTML written by Jonas, all Javascript and some HTML and CSS written by me.
    - Application allows a user to search one of a specific set of search words https://forkify-api.herokuapp.com/phrases.html to get recipes to cook
    - recipes include ingredients, a picture, and a link to the ful directions
    - Further functionality includes the ability to upload your own recipes to the app that are then searchable, bookmarking recipes to add them to a bookmarks menu which is saved across page reloads, and the ability to adjust the servings in a recipe, which then changes the respective quantities of ingredients for the recipe.
    - Fun features that I had not put together bfore: pagination of the search results, search functionality, modularized code. Also uses Parcel, which I had not used before.

### TODO

    - ~~reset upload page so you can upload more than one recipe before reloading page~~
    - ~~make ability to delete created recipes (this would be helpful since I have a ton that I used for testing too)~~

### Features and Improvements

    - Display number of pages in pagination
    - ability to sort results by duration or number of ingredients (not directly available through API, not very feasible since I would need more than allowed API calls)
    - perform ingredient validation directly in the modal window
    - improve recipe ingredient input by seperating fields and adding more
    - Shopping List so the user can see all the ingredients they want to buy
    - weekly meal planning feature, assign recipes to the next few days and mark them on the calender
    - nutrition data on each ingredient via an APi (spoonacular) and calculate total nutrition data
