import View from "./View";
import icons from "url:../../img/icons.svg"; // ensuring we are using the right icon paths

class DeleteConfirmView extends View {
  _parentElement = document.querySelector(".confirm-delete");
  _message = "Recipe was successfully deleted!";

  _window = document.querySelector(".confirmation-window");
  _overlay = document.querySelector(".overlay");
  _btnClose = document.querySelector(".btn--close-modal_delete");

  constructor() {
    super();
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

  addHandlerDelete(handler) {
    this._parentElement.addEventListener("click", function (e) {
      e.preventDefault();
      if (!e.target.classList.contains("delete__btn")) return;
      handler();
    });
  }

  resetHTML() {
    this._parentElement.innerHTML = this._baseHTML;
  }
}

export default new DeleteConfirmView();
