import View from "./View";
import icons from "url:../../img/icons.svg"; // ensuring we are using the right icon paths

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded!";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal_upload");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._baseHTML = this._parentElement.innerHTML;
  }

  openWindow() {
    this._overlay.classList.remove("hidden");
    this._window.classList.remove("hidden");
  }

  closeWindow() {
    this._overlay.classList.add("hidden");
    this._window.classList.add("hidden");
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.closeWindow.bind(this));
    this._overlay.addEventListener("click", this.closeWindow.bind(this));
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.openWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      if (!e.target.classList.contains("upload__btn")) return;
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  resetHTML() {
    this._parentElement.innerHTML = this._baseHTML;
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
