import * as model from "./model.js";
import { MODAL_CLOSE_SECONDS } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

///////////////////////////////////////

if (module.hot) module.hot.accept();

const controlRecipes = async function () {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;
        recipeView.renderSpinner();

        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        // 3) Updating bookmarks
        bookmarksView.update(model.state.bookmarks);

        // 1) Loading recipe
        await model.loadRecipe(id);
        const { recipe } = model.state;

        // 2) Rendering recipe
        recipeView.render(recipe);
    } catch (error) {
        recipeView.renderError();
        console.log(error);
    }
};

const controlSearchResults = async function () {
    try {
        // 1) Get search query
        const query = searchView.getQuery();
        if (!query) return;

        resultsView.renderSpinner();

        // 2) Load results
        await model.loadSearchResult(query);

        // 3) Render results
        const result = model.getSearchResultsPage(); // Passing nothing is same as passing "1"
        resultsView.render(result);

        resultsView.sortResults();

        // 4) Render pagination buttons
        paginationView.render(model.state.search);
    } catch (error) {
        console.log(error);
    }
};
controlSearchResults();

const controlPagination = function (goToPage) {
    // 1) Render NEW results
    const result = model.getSearchResultsPage(goToPage);
    resultsView.render(result);

    // 4) Render NEW pagination buttons
    paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
    // Update the recipe servings (in state)
    model.updateServingsTo(newServings);

    // Update the view
    const { recipe } = model.state;
    // recipeView.render(recipe);
    recipeView.update(recipe);
};

const controlAddBookmark = function () {
    // 1) Add/Remove bookmark
    const { recipe } = model.state;
    if (!recipe.bookmarked) model.addBookmark(recipe);
    else model.removeBookmark(recipe.id);

    // 2) Update recipe view
    recipeView.update(recipe);

    // 3) Render bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
    try {
        if (!addRecipeView.checkInputs()) {
            addRecipeView.renderError();
            return;
        }

        // Show loading spinner
        addRecipeView.renderSpinner();

        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        // Render recipe
        recipeView.render(model.state.recipe);

        // Success message
        addRecipeView.renderMessage();

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change ID in the URL
        window.history.pushState(null, "", `#${model.state.recipe.id}`);

        // Close form window
        setTimeout(function () {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SECONDS * 1000);
    } catch (error) {
        console.error("💥💥💥", error);
        addRecipeView.renderError();
    }
};

const controlSortResults = function (isSorted) {
    if (isSorted) {
        const sorted = resultsView.sortResults();
        resultsView.update(sorted);
    } else resultsView.update(model.getSearchResultsPage());
};

const newFeature = function () {
    console.log("Welcome to the application");
};

const init = function () {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    resultsView.addhandlerSortResults(controlSortResults);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerPagainationClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
    newFeature();

    // Upload new recipe data
};
init();

// Same as
// window.addEventListener("hashchange", showRecipe);
// window.addEventListener("load", showRecipe);
