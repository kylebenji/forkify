import { async } from "regenerator-runtime";
import { API_URL, RESULTS_PER_PAGE, API_KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    resultsPage: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    cookTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
  } catch (error) {
    throw error;
  }
};

export const getSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.resultsPage) {
  state.search.resultsPage = page;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmark to list
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //save to local storage
  persistBookmarks();
};

export const removeBookmark = function (id) {
  //remove bookmark from list
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  //remove current recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //save to local storage
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

/**
 * Upload a new recipe to the forkify API using developer key
 * @param {Object} newRecipe the recipe object to be sent
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => {
        return entry[0].startsWith("ingredient") && entry[1] !== "";
      })
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());

        if (ingArr.length !== 3)
          throw new Error("Wrong ingredient format, please use given format.");

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const deleteRecipe = async function (recipeId) {
  try {
    const data = await AJAX(
      `${API_URL}${recipeId}?key=${API_KEY}`,
      undefined,
      true
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
