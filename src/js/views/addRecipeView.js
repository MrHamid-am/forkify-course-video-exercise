import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2
import { getCommaseparatedFor } from "../helper.js";

class AddRecipeView extends View {
    _parentElement = document.querySelector(".upload");
    _message = "Recipe was successfully uploaded :)";
    _errorMessage =
        "Wrong ingredient format! please use the correct format (e.g: 1,kg,sugar)";

    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");
    _btnUpload = document.querySelector(".upload__btn");

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
        this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    }

    checkInputs() {
        let validation = true;
        const formUpload = document.querySelector(".upload");
        const dataArray = [...new FormData(formUpload)];
        dataArray
            .filter(
                (entry) => entry[0].startsWith("ingredient") && entry[1] !== ""
            )
            .forEach((ingredient) => {
                const ingredientArray = ingredient[1]
                    .split(",")
                    .map((element) => element.trim());

                if (ingredientArray.length !== 3) validation = false;
            });

        return validation;
    }

    toggleWindow() {
        this._overlay.classList.toggle("hidden");
        this._window.classList.toggle("hidden");
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", function (e) {
            e.preventDefault();
            const dataArray = [...new FormData(this)];

            const data = Object.fromEntries(dataArray);
            console.log(data);
            handler(data);
        });
    }

    _generateMarkup() {}
}

export default new AddRecipeView();
