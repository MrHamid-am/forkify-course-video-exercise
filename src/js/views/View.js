import "regenerator-runtime";
import icons from "url:../../img/icons.svg"; // Parcel 2

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup is returned if render is false
     * @this {Object} View instance
     * @author Hamid Mohammadi
     * @todo Finish the implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDom = document
            .createRange()
            .createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll("*"));
        const currentElements = Array.from(
            this._parentElement.querySelectorAll("*")
        );

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i];

            // Update changed text
            if (
                !newElement.isEqualNode(currentElement) &&
                newElement.firstChild?.nodeValue.trim() !== ""
            ) {
                // console.log("💥", newElement.firstChild.nodeValue.trim());
                currentElement.textContent = newElement.textContent;
            }

            // Update changed attributes
            if (!newElement.isEqualNode(currentElement)) {
                Array.from(newElement.attributes).forEach((attribute) =>
                    currentElement.setAttribute(attribute.name, attribute.value)
                );
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}
