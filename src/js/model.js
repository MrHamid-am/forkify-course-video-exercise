import { async } from "regenerator-runtime";
import {
    API_URL,
    RESULT_PER_PAGE,
    BOOKMARKS_KEY,
    DEVELOPER_KEY,
} from "./config.js";
// import { getJSON, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";
import { RESULT_PER_PAGE } from "./config.js";

export const state = {
    recipe: {},
    search: {
        query: "",
        results: [],
        page: 1,
        resultsPerPage: RESULT_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${DEVELOPER_KEY}`);
        state.recipe = createRecipeObject(data);

        if (state.bookmarks.some((bookmark) => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log(state.recipe);
    } catch (error) {
        console.log(`${error} 💥💥💥💥`);
        throw error;
    }
};

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(
            `${API_URL}?search=${query}&key=${DEVELOPER_KEY}`
        );
        console.log(data);

        state.search.results = data.data.recipes.map((recipe) => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
                ...(recipe.key && { key: recipe.key }),
            };
        });
        console.log(state.search.results);
        this.state.search.page = 1;
    } catch (error) {
        throw error;
    }
};

export const getSearchResultsPage = function (page = this.state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage; //0;
    const end = page * state.search.resultsPerPage; //9;

    return state.search.results.slice(start, end);
};

export const updateServingsTo = function (newServings) {
    state.recipe.ingredients.forEach((ingredient) => {
        ingredient.quantity =
            ingredient.quantity * (newServings / state.recipe.servings);
    });
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4

    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const removeBookmark = function (bookmarkId) {
    // Delete bookmark
    const index = state.bookmarks.findIndex(
        (element) => element.id === bookmarkId
    );
    const deleteCount = 1;
    state.bookmarks.splice(index, deleteCount);

    // Remove the mark from current recipe
    if (state.recipe.id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem(BOOKMARKS_KEY);
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();
console.log(state.bookmarks);

const clearBookmarks = function () {
    localStorage.clear("bookmarks");
};
clearBookmarks();

// This function first converts array of ingredients to separate objects
export const uploadRecipe = async function (newRecipe) {
    // 1) Get all ingredients as a array
    // 2) Filter that array so that we can get only the ingredient property (and the ingredient value should not be null AT ALL)
    // 3) We return a object which contains each ingredient with key value pairs
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(
                (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
            )
            .map((ingredient) => {
                // const ingredientsArray = ingredient[1]
                //     .replaceAll(" ", "")
                //     .split(",");
                const ingredientsArray = ingredient[1]
                    .split(",")
                    .map((element) => element.trim());

                const [quantity, unit, description] = ingredientsArray;
                return {
                    quantity: quantity ? +quantity : "",
                    unit,
                    description,
                };
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

        const data = await AJAX(`${API_URL}?key=${DEVELOPER_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
};
