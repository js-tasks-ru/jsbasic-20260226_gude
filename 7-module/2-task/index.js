import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this._onKeyDown = this.onKeyDown.bind(this);
    this._render();
  }

  _render() {
    const closeIconSrc = '/assets/images/icons/cross-icon.svg';

    const element = createElement('<div class="modal"></div>');
    const overlay = createElement('<div class="modal__overlay"></div>');
    const inner = createElement('<div class="modal__inner"></div>');
    const header = createElement('<div class="modal__header"></div>');
    const closeBtn = createElement('<button type="button" class="modal__close"></button>');
    const img = createElement('<img alt="close-icon" />');
    img.src = closeIconSrc;
    closeBtn.append(img);

    const title = createElement('<h3 class="modal__title"></h3>');
    const body = createElement('<div class="modal__body"></div>');

    header.append(closeBtn, title);
    inner.append(header, body);
    element.append(overlay, inner);

    this._refs = { element, title, body, closeButton: closeBtn };
    this._refs.closeButton.addEventListener('click', () => this.close());
  }

  onKeyDown(event) {
    if (event.code === 'Escape') {
      this.close();
    }
  }
  open() {
    if (document.body.contains(this._refs.element)) return this;

    document.body.append(this._refs.element);
    document.body.classList.add('is-modal-open');
    document.addEventListener('keydown', this._onKeyDown);
    return this;
  }

  setTitle(title) {
    this._refs.title.textContent = title;
    return this;
  }

  setBody(node) {
    if (!node) return this;
    this._refs.body.innerHTML = '';
    this._refs.body.append(node);
    return this;
  }

  close() {
    this._refs.element.remove();
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', this._onKeyDown);
  }

  get element() {
    return this._refs.element;
  }

  get closeButton() {
    return this._refs.closeButton;
  }
}
