import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import confirmationModalView from "./views/confirmationModalView.js";

import "core-js/stable"; //polyfill
import "regenerator-runtime/runtime"; //polyfill

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //update results with active search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks view with active recipe
    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    //rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const loadSearchResults = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.getSearchResults(query);

    loadSearchResults(1);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = function (goTo) {
  loadSearchResults(goTo);
};

const controlServings = function (newServings) {
  //update servings in state
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const initBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Add a new recipe to the database and render it to the DOM
 * @param {Object} newRecipe the recipe to be added and rendered
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //upload recipe data to API
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //update bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    //autoclose modal
    setTimeout(function () {
      addRecipeView.closeWindow();
      //reset form after window closes
      setTimeout(function () {
        addRecipeView.resetHTML();
      }, 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error);
  }
};

const controlDeleteRecipeModal = async function () {
  try {
    //render confirmation window
    confirmationModalView.openWindow();
  } catch (error) {
    recipeView.renderError(error);
  }
};

const controlDeleteRecipe = async function () {
  try {
    //get recipe ID
    const recipeId = window.location.hash.slice(1);
    //render spinner in modal
    confirmationModalView.renderSpinner();
    //send to delete API
    await model.deleteRecipe(recipeId);
    //show success or failure message
    confirmationModalView.renderMessage();
    //remove recipe hash from url
    window.history.pushState(null, "", window.location.pathname);
    //remove recipe from search results
    model.state.search.results.splice(
      model.state.search.results.findIndex((el) => el.id === recipeId),
      1
    );
    //reload search results without the recipe
    loadSearchResults(model.state.search.resultsPage);
    setTimeout(function () {
      //hide success message, close modal
      confirmationModalView.closeWindow();
      //reset recipe window to initial message
      recipeView.renderMessage();
      //reset modal after close
      setTimeout(function () {
        confirmationModalView.resetHTML();
      }, 1000);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    recipeView.renderError(error);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(initBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerDelete(controlDeleteRecipeModal);
  confirmationModalView.addHandlerDelete(controlDeleteRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
