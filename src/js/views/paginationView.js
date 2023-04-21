import View from './View';
import icons from 'url:../../img/icons.svg'; // ensuring we are using the right icon paths

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = 'Pagination failed! Please try again.';

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currPage = this._data.resultsPage;
    //page 1 and other pages
    if (currPage === 1 && numPages > 1) {
      return this._nextPageMarkup(currPage + 1);
    }
    //page 1 and no other pages
    if (currPage === 1 && numPages === 1) {
      return '';
    }
    //last page
    if (currPage === numPages) {
      return this._previousPageMarkup(currPage - 1);
    }
    //middle page
    if (currPage < numPages) {
      return (
        this._previousPageMarkup(currPage - 1) +
        this._nextPageMarkup(currPage + 1)
      );
    }
    return; //markup
  }

  _previousPageMarkup(num) {
    return `<button data-goto="${num}" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${num}</span>
  </button>`;
  }

  _nextPageMarkup(num) {
    return `<button data-goto="${num}" class="btn--inline pagination__btn--next">
    <span>Page ${num}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
}

export default new PaginationView();
