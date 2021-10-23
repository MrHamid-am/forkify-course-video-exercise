import View from "./View.js";
import icons from "url:../../img/icons.svg"; // Parcel 2

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");
    currentPage;

    addHandlerPagainationClick(handler) {
        this._parentElement.addEventListener("click", function (e) {
            const button = e.target.closest(".btn--inline");
            if (!button) return;

            const goToPage = +button.dataset.goto; // Convert to number
            console.log(goToPage);

            handler(goToPage);
        });
    }

    _generateMarkup() {
        const numberOfPages = this.getResultsPerPageFrom(this._data);
        this.currentPage = this._data.page;

        // Page 1, and there are other pages
        if (this.currentPage === 1 && numberOfPages > 1) {
            return `
            ${this.generateMarkupButtonForState("next")}
            ${this.generateCurrentButton()}
            `;
        }

        // We are on last page
        if (this.currentPage === numberOfPages && numberOfPages > 1) {
            return `
            ${this.generateCurrentButton()}
            ${this.generateMarkupButtonForState("prev")}
            `;
        }

        // We are on other pages
        if (this.currentPage < numberOfPages) {
            return `
            ${this.generateMarkupButtonForState("prev")}
            ${this.generateCurrentButton()}
            ${this.generateMarkupButtonForState("next")}
            `;
        }

        // Page 1, and there are no other pages
        return "";
    }

    getResultsPerPageFrom(data) {
        return Math.ceil(data.results.length / data.resultsPerPage);
    }

    generateMarkupButtonForState(nextOrPrev) {
        const isNext = nextOrPrev === "next";
        const nextPage = this.currentPage + 1;
        const previousPage = this.currentPage - 1;

        // prettier-ignore
        return `
        <button data-goto="${isNext ? nextPage : previousPage}" class="btn--inline pagination__btn--${nextOrPrev}">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-${isNext ? "right" : "left"}"></use>
                </svg>
                <span>Page ${isNext ? nextPage : previousPage}</span>
        </button>
        `;
    }

    generateCurrentButton() {
        return `<button class="btn--inline pagination__btn--prev">${this.currentPage}</button>`;
    }
}

export default new PaginationView();
