import View from "./View.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg"; // Parcel 2

class ResultsView extends View {
    _parentElement = document.querySelector(".results");
    _errorMessage = "No recipes found for your query! Please try again";
    _successMessage = "";
    _checkBoxSort = document.querySelector("input[type=checkbox]");
    _isSorted = false;

    _generateMarkup() {
        const array = this._isSorted
            ? this.sortResults(this._data)
            : this._data;
        return array
            .map((result) => previewView.render(result, false))
            .join("");
    }
    _handleSortResults(handler, e) {
        this._isSorted = e.target.checked;
        handler(this._isSorted);
    }

    sortResults() {
        return this._data?.sort(function (firstTitle, secondTitle) {
            return firstTitle.title > secondTitle.title ? 1 : -1;
        });
    }

    addhandlerSortResults(handler) {
        this._checkBoxSort.addEventListener(
            "change",
            this._handleSortResults.bind(this, handler)
        );
    }
}

export default new ResultsView();
